import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { editId } = req.query; // ดึงค่า editId จาก URL path

  // ตรวจสอบว่า editId ถูกส่งมาหรือไม่
  if (!editId || isNaN(Number(editId))) {
    return res.status(400).json({
      error: "ID parameter is required and must be a valid number",
    });
  }

  if (req.method === "PUT") {
    try {
      const { category } = req.body; // รับข้อมูล category จาก body

      // ตรวจสอบว่า category ถูกส่งมาหรือไม่
      if (!category) {
        return res.status(400).json({
          error: "Category parameter is required",
        });
      }

      // แปลง editId เป็นตัวเลข
      const idNumber = Number(editId);

      // ตรวจสอบว่า id มีอยู่ในฐานข้อมูลหรือไม่
      const { data: existingCategory, error: fetchError } = await adminSupabase
        .from("categories")
        .select("id")
        .eq("id", idNumber)
        .single(); // ใช้ single() เพื่อดึงแถวเดียวที่ตรงกับ id

      if (fetchError) {
        console.error("Database Query Error:", fetchError.message);
        return res.status(500).json({
          error: `Database Error: ${fetchError.message}`,
        });
      }

      if (!existingCategory) {
        return res.status(404).json({
          error: `Category with ID ${idNumber} not found.`,
        });
      }

      // อัพเดตข้อมูลในฐานข้อมูลตาม id
      const { data, error } = await adminSupabase
        .from("categories")
        .update({ category })
        .eq("id", idNumber); // อัพเดตข้อมูลตาม id

      if (error) {
        console.error("Database Query Error:", error.message);
        return res.status(500).json({
          error: `Database Error: ${error.message}`,
        });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({
          error: `Category with ID ${idNumber} not found.`,
        });
      }

      // ส่งข้อความตอบกลับว่าอัพเดตสำเร็จ
      res.status(200).json({
        message: "Edit successfully",
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: `Internal Server Error: ${(error as Error).message}`,
      });
    }
  } else {
    // ถ้าไม่ใช่ PUT
    res.setHeader("Allow", ["PUT"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
