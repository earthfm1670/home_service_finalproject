// นำเข้า Supabase client และ Types เหมือนเดิม
import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

// API Endpoint รองรับการ GET ทั้งหมดหรือ by ID
export default async function handlePromotionCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query; // ดึง id จาก query parameter

    if (id) {
      // ดึงข้อมูลเฉพาะที่ id ตรงกับในฐานข้อมูล
      const { data, error } = await supabase
        .from("promotion_codes")
        .select()
        .eq("promotion_id", id) // ใช้เงื่อนไข id ตรงกับ query parameter

      if (data && data.length > 0) {
        return res.status(200).json({
          message: "Promotion fetched successfully.",
          data: data[0], // ส่งข้อมูลแถวเดียว
        });
      } else if (data && data.length === 0) {
        return res.status(404).json({
          message: `No promotion found with id: ${id}`,
          data: null,
        });
      }

      if (error) {
        return res.status(400).json({
          message: "Error fetching promotion by ID.",
          error: error.message,
        });
      }
    } else {
      // กรณีไม่มี id ให้ทำงานแบบ getAll
      const { data, error } = await supabase.from("promotion_codes").select();

      if (data && data.length > 0) {
        return res.status(200).json({
          message: "Fetched all promotions successfully.",
          data,
        });
      }

      if (error) {
        return res.status(400).json({
          message: "Error fetching promotions.",
          error: error.message,
        });
      }
    }
  } catch (e) {
    const error = e as Error;
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}
