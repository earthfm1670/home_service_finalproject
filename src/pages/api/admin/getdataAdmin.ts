import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
// interface Service {
//   service_id: number;
//   service_name: string;
//   category_id: number;
//   categories: { category: string } | { category: string }[]; // รองรับ object หรือ array
//   service_picture_url: string;
//   created_at: string;
//   updated_at: string;
// }

/**
 * @swagger
 * /api/admin/getdataAdmin:
 *   get:
 *     summary: Get services data for admin
 *     description: Retrieves a list of services with optional search functionality
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for service name
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service_id:
 *                         type: integer
 *                       service_name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       service_picture_url:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 totalCount:
 *                   type: integer
 *       405:
 *         description: Method Not Allowed
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Method GET Not Allowed
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: null
 *                 totalCount:
 *                   type: integer
 *                   example: 0
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { query } = req;

      // รับค่า search และ category จาก query parameter
      const search = (query.search as string) || ""; // รับค่า search หากมี
      // ดึงข้อมูลทั้งหมดจากตาราง services โดยไม่สนใจราคาหรือการคำนวณ
      let dbQuery = supabase.from("services").select(
        `
        service_id,
        service_name,
        category_id,
        categories!inner(category),
        service_picture_url,
        created_at,
        updated_at
      `,
        { count: "exact" }
      );

      // ถ้ามี search จะทำการค้นหาตามชื่อบริการ
      if (search) {
        dbQuery = dbQuery.ilike("service_name", `%${search}%`);
      }

      // ดึงข้อมูลจากฐานข้อมูล
      const { data: services, error } = await dbQuery;

      if (error) throw error;

      // ประมวลผลข้อมูลที่ได้รับมา
      const processedServices = (services || []).map((service) => {
        // ตรวจสอบว่า categories เป็น array หรือ object เดี่ยว
        const category =
          Array.isArray(service.categories) && service.categories.length > 0
            ? service.categories[0].category
            : "category" in service.categories
            ? service.categories.category
            : "ไม่มีหมวดหมู่"; // ถ้าไม่มี category จะตั้งค่าเป็น "ไม่มีหมวดหมู่"

        return {
          service_id: service.service_id,
          service_name: service.service_name,
          category, // เพิ่ม category ที่รับมาจากฐานข้อมูล
          service_picture_url: service.service_picture_url,
          created_at: service.created_at,
          updated_at: service.updated_at,
        };
      });

      // ส่งข้อมูลที่ประมวลผลไปยัง client
      const totalCount = processedServices.length;

      // เรียงลำดับตาม service_id
      processedServices.sort((a, b) => a.service_id - b.service_id);

      res.status(200).json({
        data: processedServices, // ส่งผลลัพธ์ที่ประมวลผลแล้ว
        totalCount, // จำนวนทั้งหมด
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        data: null,
        totalCount: 0,
        error: "Internal Server Error: ",
      });
    }
  } else {
    // ถ้าเป็น method ที่ไม่ใช่ GET จะตอบกลับด้วย error
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
