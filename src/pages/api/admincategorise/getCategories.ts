import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { adminSupabase } from "@/utils/supabase";

interface Categories {
  id: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { query } = req;

      // รับค่า search จาก query parameter
      const search = (query.search as string) || "";
      const sanitizedSearch = search.replace(/[%_]/g, "\\$&");

      // ดึงข้อมูลทั้งหมดจากตาราง categorise
      let dbQuery = adminSupabase
        .from("categories")
        .select(
          `
          id,
          category,
          created_at,
          updated_at
        `,
          { count: "exact" }
        )
        .order("id", { ascending: true }); // เรียงลำดับโดยตรงใน SQL

      // ถ้ามี search จะทำการค้นหาตามชื่อหมวดหมู่
      if (sanitizedSearch) {
        dbQuery = dbQuery.ilike("category", `%${sanitizedSearch}%`);
      }

      // ดึงข้อมูลจากฐานข้อมูล
      const { data: categories, error } = await dbQuery;

      if (error) {
        console.error("Database Query Error:", error.message);
        return res.status(500).json({
          data: null,
          totalCount: 0,
          error: `Database Error: ${error.message}`,
        });
      }

      // ถ้าไม่มีข้อมูลที่ตรงกับคำค้นหาหรือผลลัพธ์เป็นอาเรย์ว่าง
      if (!categories || categories.length === 0) {
        return res.status(200).json({
          data: [],
          totalCount: 0,
        });
      }

      // ประมวลผลข้อมูลที่ได้รับมา
      const processedCategories: Categories[] = categories.map((category) => ({
        id: category.id,
        category: category.category,
        created_at: category.created_at,
        updated_at: category.updated_at,
      }));

      res.status(200).json({
        data: processedCategories,
        totalCount: processedCategories.length,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        data: null,
        totalCount: 0,
        error: `Internal Server Error: ${(error as Error).message}`,
      });
    }
  } else {
    // ถ้าเป็น method ที่ไม่ใช่ GET จะตอบกลับด้วย error
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
