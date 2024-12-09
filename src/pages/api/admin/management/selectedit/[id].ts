import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query; // Dynamic Route จะดึง id จาก req.query

    console.log("Received ID:", id); // Debug log

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }

    try {
      const { data: user, error } = await supabase
        .from("services")
        .select("*")
        .eq("service_id", Number(id)) // แปลง id เป็น number
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  //  else {
  //   res.setHeader("Allow", ["GET"]);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
