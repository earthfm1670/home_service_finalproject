import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import { adminSupabase } from "@/utils/supabase";
import { connectionPool } from "@/utils/db";
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function adminEdit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const editId = req.query.editId as string;
    if (!editId || Array.isArray(editId)) {
      return res.status(400).json({ error: "Invalid service id." });
    }

    // Parse the form data using formidable
    const form = new IncomingForm();
    form.keepExtensions = true;

    const [fields, files] = await new Promise<[formidable.Fields<string>, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error:", err);
          return reject(err);
        }
        resolve([fields, files]);
      });
    });

    console.log("Fields:", fields);
    console.log("Files:", files);

    const parsedId = parseInt(editId, 10);
    if (isNaN(parsedId)) {
      return res
        .status(400)
        .json({ error: "Invalid service id format. Id must be a number." });
    }

    // Access req body (fields)
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const categoryId = Array.isArray(fields.category_id)
      ? parseInt(fields.category_id[0], 10)
      : parseInt(fields.category_id, 10);
    const subServices = JSON.parse(
      Array.isArray(fields.subservices) ? fields.subservices[0] : fields.subservices
    );

    if (!title || isNaN(categoryId) || !Array.isArray(subServices)) {
      return res.status(400).json({
        error: "Invalid input. Ensure title, categoryId, and subServices are valid.",
      });
    }

    // Handle image upload
    let imageUrl = '';
    if (files.image && !Array.isArray(files.image)) {
      const file = files.image[0] as File; // ตรวจสอบว่าเป็นไฟล์เดียว
      const fileBuffer = fs.readFileSync(file.filepath); // ใช้ buffer แทนการอ่านไฟล์จาก disk

      // อัปโหลดไฟล์ไปยัง Supabase Storage ใน Bucket service_pictures
      const { data, error: uploadError } = await adminSupabase
        .storage
        .from('service_pictures') // ชื่อ Bucket ที่ต้องการใช้
        .upload(`services/${file.originalFilename}`, fileBuffer, {
          cacheControl: '3600',
          upsert: true, // ถ้ามีไฟล์เก่าจะอัปเดต
        });

      if (uploadError) {
        console.error("Error uploading image to Supabase Storage:", uploadError);
        return res.status(500).json({ error: "Failed to upload image to Supabase Storage." });
      }

      // ถ้าอัปโหลดสำเร็จ จะได้ URL ของไฟล์
      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/service_pictures/services/${file.originalFilename}`;
      console.log("Image uploaded to Supabase:", imageUrl);
    }

    // Update main service using Supabase
    const { data: updatedMainService, error: updatedMainServiceError } =
      await adminSupabase
        .from("services")
        .update({
          service_name: title,
          category_id: categoryId,
          service_picture_url: imageUrl || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("service_id", parsedId);

    if (updatedMainServiceError) {
      console.error("Error updating main service:", updatedMainServiceError);
      return res.status(500).json({ error: "Failed to update main service." });
    }

    // Update sub services using connectionPool
    for (const subService of subServices) {
      if (subService.id) {
        // Update existing sub-service
        const subQuery = `
          UPDATE sub_services
          SET description=$1, unit=$2, unit_price=$3, updated_at=$4
          WHERE id=$5
        `;
        const subValues = [
          subService.description,
          subService.unit,
          subService.unit_price,
          new Date(),
          subService.id,
        ];
        await connectionPool.query(subQuery, subValues);
      } else {
        // Insert new sub-service
        const subQuery = `
          INSERT INTO sub_services (service_id, description, unit, unit_price, created_at)
          VALUES ($1, $2, $3, $4, $5)
        `;
        const subValues = [
          parsedId,
          subService.description,
          subService.unit,
          subService.unit_price,
          new Date(),
        ];
        await connectionPool.query(subQuery, subValues);
      }
    }

    return res.status(200).json({ message: "Service updated successfully", imageUrl });
  } catch (error) {
    console.error("Error during API execution:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

// แก้ไขไฟล์ได้
