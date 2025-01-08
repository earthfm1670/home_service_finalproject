// นำเข้า NextApiRequest และ NextApiResponse จาก "next" สำหรับใช้ในชนิดของคำขอและคำตอบ
import { NextApiRequest, NextApiResponse } from "next";

// นำเข้า adminSupabase ซึ่งเป็นอินสแตนซ์ของ Supabase client ที่ใช้งานในด้านการเข้าถึงฐานข้อมูล
import { adminSupabase } from "@/utils/supabase";

// ฟังก์ชัน handler เป็น async function ที่รับคำขอและคำตอบเพื่อจัดการกับ API
export default async function handler(
  req: NextApiRequest,  // คำขอ (Request) ที่มาจากผู้ใช้งาน
  res: NextApiResponse  // คำตอบ (Response) ที่จะส่งกลับไปยังผู้ใช้งาน
) {
  console.log("--------------------1--------------------");
  // แสดงข้อความ log สำหรับการตรวจสอบว่า API ถูกเรียกใช้งานหรือไม่
  console.log("Request method:", req.method);  // แสดงประเภทของคำขอ (เช่น GET, POST, PUT)
  console.log("Request query:", req.query);    // แสดงข้อมูลที่มาจาก query string

  const { editId } = req.query;  // ดึงค่า editId จาก query string

  // ตรวจสอบว่า editId มีอยู่ในคำขอหรือไม่ และต้องเป็นตัวเลขที่ถูกต้อง
  if (!editId || Array.isArray(editId) || isNaN(Number(editId))) {
    console.log("Invalid editId:", editId);  // ถ้าข้อความผิดปกติให้แสดงค่า editId
    return res.status(400).json({
      error: "ID parameter is required and must be a valid number",  // ส่ง error กลับถ้า editId ไม่ถูกต้อง
    });
  }

  console.log("--------------------2--------------------");
  console.log("Valid editId:", editId);  // แสดงค่า editId หลังจากตรวจสอบแล้ว

  // ตรวจสอบว่าคำขอเป็นชนิด PUT หรือไม่
  if (req.method === "PUT") {
    try {
      const { category } = req.body;  // ดึงข้อมูล category จาก body ของคำขอ
      console.log("Received category data:", category);  // แสดงข้อมูล category ที่ได้รับมา

      // ถ้าข้อมูล category ไม่มี หรือเป็นค่า null/undefined ให้ส่ง error กลับ
      if (!category) {
        console.log("Category parameter is missing");
        return res.status(400).json({
          error: "Category parameter is required",  // ส่ง error กลับถ้าไม่มี category
        });
      }

      console.log("--------------------3--------------------");
      const idNumber = Number(editId);  // แปลง editId ที่ได้จาก query ให้เป็นตัวเลข
      console.log("Converted editId to number:", idNumber);  // แสดงค่า id ที่ถูกแปลงเป็นตัวเลข

      console.log("Checking if category exists in database...");
      // ใช้ Supabase client ดึงข้อมูลจากตาราง "categories" โดยการเลือกแถวที่มี id ตรงกับ idNumber
      const { data: existingCategory, error: fetchError } = await adminSupabase
        .from("categories")
        .select("id")
        .eq("id", idNumber)  // ตรวจสอบว่ามีข้อมูลในฐานข้อมูลที่ตรงกับ editId หรือไม่
        .single();  // คำสั่งนี้หมายความว่าเราต้องการผลลัพธ์เพียงแถวเดียว

      // ถ้ามีข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล
      if (fetchError) {
        console.error("Database Query Error:", fetchError.message);
        return res.status(500).json({
          error: `Database Error: ${fetchError.message}`,  // ส่ง error กลับถ้าเกิดข้อผิดพลาดในการดึงข้อมูล
        });
      }

      console.log("--------------------4--------------------");
      console.log("Existing category data:", existingCategory);  // แสดงข้อมูลที่ดึงมาจากฐานข้อมูล

      // ถ้าไม่พบข้อมูล category ที่ตรงกับ idNumber
      if (!existingCategory) {
        console.log(`Category with ID ${idNumber} not found.`);
        return res.status(404).json({
          error: `Category with ID ${idNumber} not found.`,  // ส่ง error กลับถ้าไม่พบข้อมูล
        });
      }

      console.log("--------------------5--------------------");
      console.log("Updating category in database...");
      // อัปเดตข้อมูลในฐานข้อมูล โดยการเปลี่ยนแปลงค่า category ที่มี id ตรงกับ idNumber
      const { data, error } = await adminSupabase
        .from("categories")
        .update({ category })  // อัปเดตข้อมูลในฐานข้อมูล
        .eq("id", idNumber)    // ค้นหาตาม id
        .select();  // เลือกข้อมูลที่ถูกอัปเดต

      // ถ้ามีข้อผิดพลาดในการอัปเดตข้อมูล
      if (error) {
        console.error("Database Update Error:", error.message);
        return res.status(500).json({
          error: `Database Error: ${error.message}`,  // ส่ง error กลับถ้าเกิดข้อผิดพลาดในการอัปเดต
        });
      }

      console.log("--------------------6--------------------");
      console.log("Update result:", data);  // แสดงผลลัพธ์หลังจากการอัปเดตข้อมูล

      // ถ้าไม่พบข้อมูลที่อัปเดตหรือข้อมูลที่คืนกลับมาเป็นค่าว่าง
      if (!data || data.length === 0) {
        console.log(`No data returned after update for ID ${idNumber}`);
        return res.status(404).json({
          error: `Category with ID ${idNumber} not found or not updated.`,  // ส่ง error กลับถ้าไม่พบข้อมูลที่อัปเดต
        });
      }

      console.log("--------------------7--------------------");
      console.log("Sending success response");
      // ส่งคำตอบกลับเป็นผลลัพธ์สำเร็จ
      res.status(200).json({
        message: "Edit successfully",  // ข้อความสำเร็จ
        updatedCategory: data[0],  // ข้อมูลที่ถูกอัปเดต
      });
    } catch (error) {
      console.error("--------------------ERROR--------------------");
      console.error("API Error:", error);  // แสดงข้อผิดพลาดในกรณีที่เกิดข้อผิดพลาดในส่วนของฟังก์ชันนี้
      res.status(500).json({
        error: `Internal Server Error: ${(error as Error).message}`,  // ส่งข้อผิดพลาดกลับไป
      });
    }
  } else {
    console.log("--------------------METHOD NOT ALLOWED--------------------");
    console.log(`Method ${req.method} not allowed`);  // แสดงว่าคำขอไม่อนุญาต
    res.setHeader("Allow", ["PUT"]);  // ระบุว่าอนุญาตเฉพาะคำขอแบบ PUT
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });  // ส่ง error กลับถ้าคำขอไม่ใช่ PUT
  }
}
