// ใช้สำหรับกำหนดประเภทของคำสั่ง req, res
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

/**
 * @swagger
 * /api/admin/management/create:
 *   post:
 *     summary: Create a new service
 *     description: Creates a new service with associated sub-services and image upload.
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the service
 *               category_id:
 *                 type: integer
 *                 description: The ID of the category for the service
 *               subservices:
 *                 type: string
 *                 format: json
 *                 description: JSON string of sub-services array
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the service
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service created successfully
 *                 serviceId:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Title is required.
 *       403:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method not allowed.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to insert service
 */

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
  // สร้าง instance ของ formidable เพื่อใช้ในการแยกข้อมูลจากฟอร์ม
  // const form = formidable({ multiples: true }); ในกรณีส่งหลายไฟล์ แล้วจะมีการเก็บข้อมูลในรูปแบบ Array
  const form = formidable();

  // เป็นฟังก์ชันหลักที่ Formidable ใช้ในการแยกข้อมูลจากคำขอ (req)  ซึ่งข้อมูลที่ได้จะมี 2 แบบ
  // fields: ข้อมูลทั่วไปจากฟอร์ม (ที่ไม่ใช่ไฟล์ เช่น ชื่อ, อีเมล ฯลฯ) || files: ไฟล์ที่แนบมาในฟอร์ม
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(400).json({ error: "Error parsing form data" });
    }

    // แปลงข้อมูล subservices ที่ได้รับมาในรูปแบบ JSON
    // ข้อมูลยู่ในรูปแบบ string และเราต้องการแปลงให้เป็น (array of objects) เพื่อให้สามารถทำงานกับข้อมูลได้สะดวกขึ้น เลยใช้ .parse แค่ตรงนี้
    // ซึ่ง multipart/form-data หรือการใช้ formData.append จะบังคับแปลง array of object เป็น JSON.stringify ตอนที่รับข้อมูลมาจาก frontend
    // ดึงข้อมูลจาก fields และ files มาสร้าง service ใหม่
    // fields: ข้อมูลทั่วไปจากฟอร์ม (ที่ไม่ใช่ไฟล์ เช่น ชื่อ, อีเมล ฯลฯ)
    // files: ไฟล์ที่แนบมาในฟอร์ม
    let subServices: Array<SubServiceFromAdmin> = [];
    if (fields.subservices) {
      try {
        // แปลงข้อมูลจาก JSON ให้อยู่ในรูปแบบ Array
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

    if (subServices.length === 0) {
      console.log(
        "--------- Warning: Subservice is null or undefined. ---------"
      );
    }

    // มีการใช้ array ในการครอบ ข้อมูลซ้อนกันอยู่ข้างในจึงต้องทำการแปลงและดึงออกมาแค่ข้อมูลข้างในเท่านั้น
    // fields.title = ["My Title"];
    // fields.title = My Title;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const category_id = Array.isArray(fields.category_id)
      ? fields.category_id[0]
      : fields.category_id;
    const image = Array.isArray(files.image) ? files.image[0] : files.image;

    // algorythm ที่ใช้ตรวจสอบค่าว่าง (!title || title.trim() === "")
    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }
    if (!category_id || isNaN(Number(category_id))) {
      return res.status(400).json({ error: "Valid category_id is required." });
    }
    if (!image) {
      console.log("--------- Warning: Image is null or undefined. ---------");
    }

    // เตรียมข้อมูลบริการที่ได้จากฟอร์ม
    const newService: PostRequestBody = {
      // title: typeof title === 'string' ? title.replace(/["\[\]]/g, '').trim() : ''
      // ^ หากข้อมูลมีเป็น array หรือมีข้อมูลครอบเกินมาอีกทีจะใช้วิธีนี้ในการลบสัญลักษณ์ที่เกินออก
      title: title,
      category_id: Number(
        Array.isArray(fields.category_id)
          ? fields.category_id[0]
          : fields.category_id
      ),
      subServices: subServices,
      image: image,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // บันทึกข้อมูลบริการใหม่ลงในฐานข้อมูล Supabase
    try {
      const { data: serviceId, error: insertError } = await adminSupabase
        .from("services")
        .insert([
          {
            service_name: newService.title,
            category_id: newService.category_id,
          },
        ])
        .select("service_id"); // เลือก service_id ที่ถูกสร้างขึ้น

      // ถ้ามีข้อผิดพลาดในการบันทึกข้อมูล
      if (insertError) {
        console.log("Error inserting service:", insertError);
        return res.status(500).json({ error: "Failed to insert service" });
      }

      // ถ้ามีไฟล์ภาพให้ทำการอัปโหลด
      if (newService.image && "filepath" in newService.image) {
        // อ่านไฟล์จาก filepath
        const fileData = await fs.readFile(newService.image.filepath);
        // หาค่า extension ของไฟล์
        const fileExtension =
          newService.image.originalFilename?.split(".").pop() || "jpg";
        // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
        const fileName = `${Date.now()}_${uuidv4()}.${fileExtension}`.replace(
          /['"]/g,
          ""
        );

        const { error: uploadError } = await adminSupabase.storage
          .from("service_pictures")
          .upload(fileName, fileData, {
            contentType:
              newService.image.mimetype || "application/octet-stream",
          });

        if (uploadError) {
          console.log("Error uploading file:", uploadError);
          return res.status(400).json({ error: "Error during image upload." });
        }

        const { data: urlData } = adminSupabase.storage
          .from("service_pictures")
          .getPublicUrl(fileName);

        if (!urlData?.publicUrl) {
          return res
            .status(400)
            .json({ error: "Error getting public URL for uploaded image." });
        }

        const { error: updateImageUrlError } = await adminSupabase
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
        }));
        console.log(subInsert, "subInsert for check data with push");

        const { error: subInsertedError } = await adminSupabase
          .from("sub_services")
          .insert(subInsert);

        if (subInsertedError) {
          return res.status(400).json({
            message: "Error inserting subservices.",
            detail: subInsertedError,
          });
        }
      }

      return res.status(201).json({ message: "Data inserted successfully." });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(500).json({ message: "Unexpected error occurred." });
    }
  });
}
