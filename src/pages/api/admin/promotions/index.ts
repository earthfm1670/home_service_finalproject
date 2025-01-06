import { supabase } from "@/utils/supabase";
import { NextApiResponse } from "next";

export default async function getAllPromotionCode(res: NextApiResponse) {
  try {
    const { data, error } = await supabase.from("promotion_codes").select();
    if (data) {
      return res
        .status(200)
        .json({ message: "fetch promotion successfully", data: data });
    }
    if (error) {
      return res
        .status(404)
        .json({ message: "promotion not found.", error: error.message });
    }
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
}
