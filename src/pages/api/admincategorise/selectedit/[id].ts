import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/admincategorise/selectedit/{id}:
 *   get:
 *     summary: Get a specific category by ID
 *     description: Retrieves details of a specific category from the database
 *     tags: [Admin, Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     category:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - ID parameter is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ID parameter is required
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method GET Not Allowed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error: Error message
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query; // รับค่า id จาก query parameters

      // ตรวจสอบว่า id ถูกส่งมาหรือไม่
      if (!id) {
        return res.status(400).json({
          error: "ID parameter is required",
        });
      }

      // ดึงข้อมูลจากฐานข้อมูลตาม id
      const { data: categories, error } = await adminSupabase
        .from("categories")
        .select("id, category, created_at, updated_at")
        .eq("id", id) // กรองข้อมูลตาม id
        .single(); // หาค่าหนึ่งรายการ

      if (error) {
        console.error("Database Query Error:", error.message);
        return res.status(500).json({
          error: `Database Error: ${error.message}`,
        });
      }

      if (!categories) {
        return res.status(404).json({
          error: "Category not found",
        });
      }

      // ส่งข้อมูลกลับ
      res.status(200).json({
        data: categories,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        error: `Internal Server Error: ${(error as Error).message}`,
      });
    }
  } else {
    // ถ้าไม่ใช่ GET
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
