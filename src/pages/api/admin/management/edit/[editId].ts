// สำหรับจัดการคำขอและคำตอบ API
import { NextApiRequest, NextApiResponse } from "next";
// สำหรับเชื่อมต่อกับฐานข้อมูล Supabase
import { adminSupabase } from "@/utils/supabase";
// สำหรับสร้าง UUID ใหม่
import { v4 as uuidv4 } from "uuid";
// สำหรับการจัดการฟอร์มที่มีไฟล์อัปโหลด
import formidable from "formidable";
// สำหรับการทำงานกับไฟล์ในระบบ
import { promises as fs } from "fs";

// การตั้งค่าของ API ซึ่งจะไม่ใช้การแปลงข้อมูล (body parser) แบบอัตโนมัติจาก Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// กำหนดโครงสร้างของข้อมูล SubService ที่จะรับจากผู้ใช้
interface SubServiceFromAdmin {
  description: string;
  unit: string;
  pricePerUnit: number;
  unit_price: number;
  id?: number;
  created_at: string;
}

// กำหนดโครงสร้างข้อมูลสำหรับคำขอ PUT ที่จะได้รับจากฟอร์ม
interface PutRequestBody {
  service_id: number;
  title: string;
  category_id: number;
  subServices: Array<SubServiceFromAdmin>;
  image: formidable.File | undefined;
}

/**
 * @swagger
 * /api/admin/management/update:
 *   put:
 *     summary: Update a service and its sub-services
 *     description: Updates an existing service, including its details, image, and sub-services
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: service_id
 *         required: true
 *         type: integer
 *         description: ID of the service to update
 *       - in: formData
 *         name: title
 *         required: true
 *         type: string
 *         description: New title of the service
 *       - in: formData
 *         name: category_id
 *         required: true
 *         type: integer
 *         description: ID of the category for the service
 *       - in: formData
 *         name: subservices
 *         required: true
 *         type: string
 *         description: JSON string of sub-services array
 *       - in: formData
 *         name: image
 *         type: file
 *         description: New image file for the service
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Service updated successfully
 *       400:
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *       405:
 *         description: Method not allowed
 *         schema:
 *           type: object
 *           properties:
 *             error:
 *               type: string
 *               example: Method not allowed
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Unexpected error occurred
 */
// ฟังก์ชันหลักที่ใช้จัดการคำขอ PUT สำหรับการอัปเดตบริการ
export default async function adminUpdate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("----------start----------");
  console.log("----------1----------");
  // ตรวจสอบว่าเป็นคำขอแบบ PUT หรือไม่ ถ้าไม่ใช่ ให้คืนค่าผลลัพธ์เป็น 405 (Method Not Allowed)
  if (req.method !== "PUT") {
    console.log("Method not allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // สร้างอ็อบเจ็กต์ formidable เพื่อจัดการฟอร์มที่มีการอัปโหลดไฟล์
  const form = formidable();

  // ทำการแปลงข้อมูลจากฟอร์ม
  form.parse(req, async (err, fields, files) => {
    console.log("----------2----------");

    // ตรวจสอบข้อมูลที่ได้รับจากฟอร์ม เช่น fields และ files
    console.log("Received fields:", fields); // ดูข้อมูลจาก fields
    console.log("Received files:", files); // ดูข้อมูลจาก files

    // ถ้ามีข้อผิดพลาดในการแปลงฟอร์ม
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(400).json({ error: "Error parsing form data" });
    }

    // ตัวแปรเพื่อเก็บข้อมูล subservices ที่ได้รับจากฟอร์ม
    let subServices: Array<SubServiceFromAdmin> = [];
    // ถ้ามีข้อมูล subservices ใน fields
    if (fields.subservices) {
      try {
        console.log("Parsing subservices...");
        // แปลงข้อมูล subservices จาก JSON string เป็นอ็อบเจ็กต์
        subServices = JSON.parse(
          Array.isArray(fields.subservices)
            ? fields.subservices[0]
            : fields.subservices
        );
      } catch (e) {
        console.log("Error parsing subservices JSON:", e);
        return res.status(400).json({ error: "Invalid subservices data" });
      }
    }

    console.log("subservice for check data request", subServices);

    console.log("----------3----------");

    // ดึงข้อมูลจาก fields เช่น service_id, title, category_id, image
    const service_id = Array.isArray(fields.service_id)
      ? fields.service_id[0]
      : fields.service_id;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const category_id = Array.isArray(fields.category_id)
      ? fields.category_id[0]
      : fields.category_id;
    const image = Array.isArray(files.image) ? files.image[0] : files.image;

    // ตรวจสอบความถูกต้องของข้อมูลที่ได้รับ
    console.log(
      "service_id:",
      service_id,
      "title:",
      title,
      "category_id:",
      category_id
    );

    // หากไม่มี service_id หรือไม่ใช่ตัวเลข
    if (!service_id || isNaN(Number(service_id))) {
      return res.status(400).json({ error: "Valid service_id is required" });
    }
    // หากไม่มี title
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    // หากไม่มี category_id หรือไม่ใช่ตัวเลข
    if (!category_id || isNaN(Number(category_id))) {
      return res.status(400).json({ error: "Valid category_id is required" });
    }

    // สร้างอ็อบเจ็กต์ PutRequestBody ที่ประกอบด้วยข้อมูลที่ได้รับ
    const updateService: PutRequestBody = {
      service_id: Number(service_id),
      title,
      category_id: Number(category_id),
      subServices,
      image,
    };

    console.log("----------4----------");

    // พยายามอัปเดตข้อมูลบริการในฐานข้อมูล
    try {
      console.log("Updating service in the database...");
      const { error: updateError } = await adminSupabase
        .from("services")
        .update({
          service_name: updateService.title,
          category_id: updateService.category_id,
          updated_at: new Date().toISOString(),
        })
        .eq("service_id", updateService.service_id);

      // ถ้ามีข้อผิดพลาดในการอัปเดต
      if (updateError) {
        console.log("Error updating service:", updateError);
        return res.status(500).json({ error: "Failed to update service" });
      }

      // ถ้ามีไฟล์ภาพที่ต้องการอัปโหลด
      if (updateService.image && "filepath" in updateService.image) {
        console.log("----------5----------");

        // ดึงข้อมูล URL ของภาพเดิม
        const { data: currentImageData, error: fetchError } =
          await adminSupabase
            .from("services")
            .select("service_picture_url")
            .eq("service_id", updateService.service_id)
            .single();

        if (fetchError) {
          console.log("Error fetching current image URL:", fetchError);
          return res
            .status(500)
            .json({ error: "Failed to fetch current image URL" });
        }

        const currentImageUrl = currentImageData?.service_picture_url;

        // อ่านข้อมูลไฟล์จาก path ของไฟล์ที่อัปโหลด
        const fileData = await fs.readFile(updateService.image.filepath);
        const fileExtension =
          updateService.image.originalFilename?.split(".").pop() || "jpg";
        const fileName = `${Date.now()}_${uuidv4()}.${fileExtension}`.replace(
          /['"]/g,
          ""
        );

        // อัปโหลดไฟล์ภาพไปยัง Supabase Storage
        const { error: uploadError } = await adminSupabase.storage
          .from("service_pictures")
          .upload(fileName, fileData, {
            contentType:
              updateService.image.mimetype || "application/octet-stream",
          });

        // ถ้ามีข้อผิดพลาดในการอัปโหลด
        if (uploadError) {
          console.log("Error uploading file:", uploadError);
          return res.status(400).json({ error: "Error during image upload" });
        }

        // ดึง URL ของภาพที่อัปโหลดมา
        const { data: urlData } = adminSupabase.storage
          .from("service_pictures")
          .getPublicUrl(fileName);

        // ถ้าไม่สามารถดึง URL ได้
        if (!urlData?.publicUrl) {
          return res
            .status(400)
            .json({ error: "Error getting public URL for uploaded image" });
        }

        // อัปเดต URL ของภาพในฐานข้อมูล
        const { error: updateImageUrlError } = await adminSupabase
          .from("services")
          .update({ service_picture_url: urlData.publicUrl })
          .eq("service_id", updateService.service_id);

        // ถ้ามีข้อผิดพลาดในการอัปเดต URL ของภาพ
        if (updateImageUrlError) {
          return res
            .status(400)
            .json({ error: "Error during image URL update" });
        }

        // ลบไฟล์ภาพเก่า (ถ้ามี)
        if (currentImageUrl) {
          const oldFileName = currentImageUrl.split("/").pop();
          if (oldFileName) {
            const { error: deleteError } = await adminSupabase.storage
              .from("service_pictures")
              .remove([oldFileName]);

            if (deleteError) {
              console.log("Error deleting old image file:", deleteError);
              // เราไม่ return ที่นี่เพราะเราต้องการให้การอัปเดตดำเนินต่อไป แม้จะลบไฟล์เก่าไม่สำเร็จ
            }
          }
        }
      }

      console.log("----------6----------");
      console.log("----------subservice step 1----------");

      // ถ้ามีข้อมูล subservices ที่ต้องการอัปเดต
      // จัดการกับ subservices
      const newSubServices = updateService.subServices.map((subService) => ({
        service_id: updateService.service_id,
        description: subService.description,
        unit: subService.unit,
        unit_price: subService.unit_price,
        created_at: subService.id
          ? subService.created_at
          : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: subService.id || undefined,
      }));
      console.log("check select subservice data", subServices);

      console.log("----------subservice step 2----------");

      // แยกกรณีที่มี sub_service_id (อัปเดต) กับไม่มี sub_service_id (เพิ่มใหม่)
      const subServiceUpdates = newSubServices.filter((subService) => {
        return subService.id;
      });
      // console.log("Filtered subServiceUpdates: ", subServiceUpdates);

      const subServiceInserts = newSubServices.filter((subService) => {
        return !subService.id;
      });
      // console.log("Check new subServiceInserts: ", subServiceInserts);

      const idSubservices = subServiceUpdates.map(
        (subService) => subService.id
      );
      console.log("check id old subservice for update", idSubservices);

      const idService = subServiceUpdates[0]?.service_id;
      console.log("check id old service for update", idService);

      const now = new Date().toISOString(); // เวลาปัจจุบันในรูปแบบ ISO
      console.log("Current time for comparison:", now);

      if (idService && idSubservices.length > 0) {
        const formattedIdSubservices = `(${idSubservices.join(",")})`;
        console.log("check formatted idSubservices:", formattedIdSubservices);
        console.log("check idService:", idService);

        const { error: deleteError } = await adminSupabase
          .from("sub_services")
          .delete()
          .eq("service_id", idService) // ลบเฉพาะ service_id นี้
          .not("id", "in", formattedIdSubservices); // ลบที่ id ไม่อยู่ในชุดใหม่

        if (deleteError) {
          console.error("Delete Error:", deleteError);
          return res.status(400).json({ error: "Error deleting subservices" });
        }
      }

      console.log("----------subservice step 3----------");

      const subServiceInsertsCleanData = subServiceInserts.map(
        (subService) => ({
          service_id: updateService.service_id,
          description: subService.description,
          unit: subService.unit,
          unit_price: subService.unit_price,
          created_at: subService.created_at,
        })
      );
      console.log("Check new subServiceInserts: ", subServiceInsertsCleanData);

      console.log("----------subservice step 4----------");
      // อัปเดต sub_service ที่มี sub_service_id
      for (const update of subServiceUpdates) {
        const { error: updateError } = await adminSupabase
          .from("sub_services")
          .update({
            description: update.description,
            unit: update.unit,
            unit_price: update.unit_price,
            created_at: update.created_at,
            updated_at: update.updated_at,
          })
          .eq("id", update.id);

        if (updateError) {
          console.log("Error updating service:", updateError);
          return res.status(400).json({ error: "Error updating subservice" });
        }
      }

      console.log("----------subservice step 5----------");
      // เพิ่ม sub_service ใหม่
      if (subServiceInsertsCleanData.length > 0) {
        const { error: insertError } = await adminSupabase
          .from("sub_services")
          .insert(subServiceInsertsCleanData);

        if (insertError) {
          return res.status(400).json({ error: "Error inserting subservice" });
        }
      }

      console.log("----------7----------");
      console.log("----------finish----------");
      // ส่งผลลัพธ์กลับไปยังผู้ใช้
      return res.status(200).json({ message: "Service updated successfully" });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Unexpected error occurred" });
    }
  });
}
