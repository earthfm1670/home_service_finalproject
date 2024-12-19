import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("------------------ Start ------------------")
  if (req.method === "GET") {
    const { id } = req.query; // Dynamic Route จะดึง id จาก req.query

    console.log("Received ID:", id); // Debug log

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }

    try {
      // Query ข้อมูลจาก table 'services' และ join กับ table 'sub_services'
      const { data, error } = await adminSupabase
        .from("services")
        .select(
          `
          *, 
          sub_services (*),
          categories(*)
        `
        )
        .eq("service_id", Number(id)) // แปลง id เป็น number
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  //  else {
  //   res.setHeader("Allow", ["GET"]);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
