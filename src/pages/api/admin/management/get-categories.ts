import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

export default async function getCategoryById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("------------------ Start ------------------");

  if (req.method === "GET") {


    try {
      // Query ข้อมูลจาก table 'categories' ตาม id
      const { data, error } = await adminSupabase
        .from("categories")
        .select("*")
        // .eq("id", id) 

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
