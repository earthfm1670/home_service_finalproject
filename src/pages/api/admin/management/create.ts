import { NextApiRequest, NextApiResponse } from "next";
// ใช้เชื่อมข้อมูลในฝั่งของ admin
import { adminSupabase } from "@/utils/supabase";
// ใช้สำหรับการสร้าง id ที่ไม่ซ้ำกันเพื่อบันทึกใน table
import { v4 as uuidv4 } from "uuid";
// ใช้สำหรับการส่งข้อมูลแทน muler เนื่องจากใช้งาน express ไม่ได้
import formidable from "formidable";
// ใช้ในการอ่านไฟล์ (ในกรณีนี้คือไฟล์ที่อัปโหลด) ใช้ฟังก์ชันต่างๆ ของ fs แบบที่ใช้ Promise (Asynchronous) แทนการใช้ callback function.
import { promises as fs } from "fs";

// nextjs auto use body parser แล้วเราใช้ formidable ในการ upload file จึงไม่ได้ใช้ body parser (ใช้กับ express.js)
export const config = {
  api: {
    bodyParser: false,
  },
};

// กำหนดชนิดข้อมูลที่ได้รับมาจาก form แล้วจะใช้ส่งขึ้นไป
interface SubServiceFromAdmin {
  description: string;
  unit: string;
  pricePerUnit: number;
}

interface PostRequestBody {
  title: string;
  category_id: number;
  subServices: Array<SubServiceFromAdmin>;
  image: formidable.File | undefined;
  created_at: string;
  updated_at: string;
}

// เป็นฟังก์ชันที่ถูกกำหนดให้เป็น API route สำหรับจัดการคำขอ (request) และตอบกลับ (response) บนฝั่งเซิร์ฟเวอร์ใน Next.js
export default async function adminCreate(
  // paramether of typeScript type req,res
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ตรวจสอบ method ว่าเป็น post
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Method not allowed." });
  }
  // check credential

  // create data chunk
  const newService: PostRequestBody = {
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  console.log("---start-------------------------------------------");
  try {
    // 1.คิวรี่เพื่อใส่ main service + ใส่ image url
    console.log(newService.title);
    const { data: serviceId, error: insertError } = await adminSupabase
      .from("services")
      .insert([
        {
          service_name: newService.title,
          category_id: newService.category_id,
        },
      ])
      .select("service_id");
    if (insertError) {
      console.log("Error occor during insert main service.");
      console.error(insertError);
      return res.status(400).json({ error: "Service already exit." });
    } else {
      console.log("Main service inserted.");
    }
    console.log("---1-------------------------------------------");
    //2.5 Image Upload
    console.log("newService data for first time to send at api", newService);
    if (newService.image) {
      const imageFileName = serviceId[0].service_id + "/" + uuidv4();
      console.log("data from serviceId", serviceId[0].service_id);
      console.log("newService.image", newService.image);

      const fileBlob = new Blob([newService.image], {
        type: newService.image.type,
      });
      console.log("check type of file Blob", fileBlob); // ตรวจสอบว่าเป็น Blob

      const { error: insertedImageError } = await adminSupabase.storage
        .from("service_pictures")
        .upload(imageFileName, newService.image);
      //0.1 ยัด url ลง database
      if (insertedImageError) {
        console.log("Error occor during image upload.");
        console.log(insertedImageError);
        return res
          .status(400)
          .json({ error: "Error occor during image upload." });
      } else {
        const { error: insertedImageUrlError } = await adminSupabase
          .from("services")
          .update({
            service_picture_url: urlData.publicUrl,
          })
          .eq("service_id", serviceId[0].service_id);

        if (updateImageUrlError) {
          return res
            .status(400)
            .json({ error: "Error during image URL update." });
        }
      }

      if (newService.subServices.length > 0) {
        const subInsert = newService.subServices.map((subService) => ({
          service_id: serviceId[0].service_id,
          description: subService.description,
          unit: subService.unit,
          unit_price: subService.pricePerUnit,
          created_at: newService.created_at,
          updated_at: newService.updated_at,
        });
      }

      const { data: subInsertedData, error: subInsertedError } =
        await adminSupabase.from("sub_services").insert(subInsert).select();
      if (subInsertedError) {
        console.log(subInsertedError);
        return res.status(400).json({
          message: "Error occur during insert sub services.",
          detail: subInsertedError,
        });
        console.log("---3-------------------------------------------");
      }

      return res.status(201).json({ message: "Data inserted successfully." });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Unexpected error occurred." });
    }
  });
}
