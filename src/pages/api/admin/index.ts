import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    
    try {
      const { data: user, error } = await supabase
        .from("services")
        .select("*")

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (e) {
      const error = e as Error
      return res.status(500).json({ error: error.message });
    }
  }
}
