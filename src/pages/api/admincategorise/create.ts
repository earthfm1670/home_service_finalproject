import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

interface Category {
  category: string;
}

/**
 * @swagger
 * /api/admincategorise/create:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category in the database
 *     tags: [Admin, Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The name of the new category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category created successfully
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category is required. OR Category already exists.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database Error: [error message] OR Internal Server Error: [error message]
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method [METHOD] Not Allowed
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("----------Start of API----------");

  if (req.method === "POST") {
    try {
      const { category }: Category = req.body;

      // ตรวจสอบว่า category มีค่าหรือไม่
      if (!category) {
        console.log("No category provided in request body");
        return res.status(400).json({
          error: "Category is required.",
        });
      }

      console.log("Category received:", category);

      // ตรวจสอบว่าหมวดหมู่นี้มีอยู่ในฐานข้อมูลหรือไม่
      const { data: existingCategory, error: checkError } = await adminSupabase
        .from("categories")
        .select("category")
        .eq("category", category)
        .limit(1); // ใช้ limit(1) แทน single()

      if (checkError) {
        console.error("Error checking existing category:", checkError.message);
        return res.status(500).json({
          error: `Database Error: ${checkError.message}`,
        });
      }

      if (existingCategory.length > 0) {
        console.log("Category already exists:", category);
        return res.status(400).json({
          error: "Category already exists.",
        });
      }

      // เพิ่มข้อมูลหมวดหมู่ใหม่
      const { data, error } = await adminSupabase.from("categories").insert([
        {
          category,
        },
      ]);

      console.log("Supabase insert result:", data);
      console.log("Supabase insert error:", error);

      if (error) {
        console.error("Database Insert Error:", error.message);
        return res.status(500).json({
          error: `Database Error: ${error.message}`,
        });
      }

      // ส่งข้อมูลกลับหลังจากการเพิ่มสำเร็จ
      console.log("Insert successful. Sending response...");
      return res.status(201).json({
        message: "Category created successfully",
        data: data,
      });
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({
        error: `Internal Server Error: ${(error as Error).message}`,
      });
    }
  } else {
    // ถ้าเป็น method ที่ไม่ใช่ POST จะตอบกลับด้วย error
    res.setHeader("Allow", ["POST"]);
    console.log(`Method not allowed: ${req.method}`);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
