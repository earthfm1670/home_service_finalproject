import { supabase } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

//test api is working

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }

    res.status(200).json(data);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
