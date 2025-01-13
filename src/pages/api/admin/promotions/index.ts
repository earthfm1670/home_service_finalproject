// นำเข้า Supabase client จาก utility file
import { supabase } from "@/utils/supabase";

// นำเข้า Types ของ Next.js สำหรับ Request และ Response
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/admin/promotions:
 *   get:
 *     summary: Get all promotion codes
 *     description: Retrieves all promotion codes, with optional search functionality
 *     tags: [Admin, Promotions]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter promotion codes
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: fetch promotion successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       promotion_id:
 *                         type: integer
 *                       promotion_code:
 *                         type: string
 *                       discount_value:
 *                         type: number
 *                         format: float
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: promotion not found.
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */

// ฟังก์ชันหลักที่เป็น API Endpoint สำหรับดึงข้อมูล promotion code
export default async function getAllPromotionCode(
  req: NextApiRequest, // ออบเจ็กต์ Request จาก Next.js
  res: NextApiResponse // ออบเจ็กต์ Response จาก Next.js
) {
  try {
    // ดึง query parameter 'search' จาก request (ถ้ามี)
    const { search } = req.query;

    // สร้าง query เพื่อดึงข้อมูลจาก table 'promotion_codes' ในฐานข้อมูล
    const query = supabase.from("promotion_codes").select();

    // ตรวจสอบว่ามี search parameter หรือไม่
    if (search) {
      // ใช้ ilike เพื่อค้นหาข้อมูลที่คล้ายกับค่าของ search (case insensitive)
      query.ilike("promotion_code", `%${search}%`);
    }

    // รัน query และดึงผลลัพธ์ออกมา
    const { data, error } = await query;

    // ถ้ามีข้อมูล (data) และข้อมูลมีจำนวนมากกว่า 0 แถว
    if (data && data.length > 0) {
      return res
        .status(200) // ส่ง HTTP status code 200 (OK)
        .json({
          message: "fetch promotion successfully", // ข้อความแสดงความสำเร็จ
          data: data, // ข้อมูลที่ได้จากฐานข้อมูล
        });
    }

    // ถ้ามีข้อมูล (data) แต่ไม่มีแถวที่ตรงกับเงื่อนไข (แถว = 0)
    if (data && data.length === 0) {
      return res.status(200).json({
        message: "No promotion found for the given search query.", // ข้อความแจ้งว่าไม่พบข้อมูล
        data: null, // ส่งค่า null กลับไปใน data
      });
    }

    // ถ้าเกิดข้อผิดพลาดใน query (error ไม่ใช่ null)
    if (error) {
      return res
        .status(404) // ส่ง HTTP status code 404 (Not Found)
        .json({
          message: "promotion not found.", // ข้อความแจ้งว่าไม่พบ promotion
          error: error.message, // ข้อความของ error ที่เกิดขึ้น
        });
    }
  } catch (e) {
    // กรณีที่เกิดข้อผิดพลาดอื่น ๆ ในฟังก์ชัน (ที่ไม่ใช่ query)
    const error = e as Error; // แปลง e ให้เป็นประเภท Error
    console.log(error.message); // แสดงข้อความ error ใน console
    return res
      .status(500) // ส่ง HTTP status code 500 (Internal Server Error)
      .json({
        message: "Internal server error.", // ข้อความแจ้งว่ามีปัญหาในระบบ
      });
  }
}
