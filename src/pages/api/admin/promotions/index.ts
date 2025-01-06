import { supabase } from "@/utils/supabase";
import { NextApiResponse } from "next";

export default async function getAllPromotionCode(res: NextApiResponse) {
  const { data, error } = await supabase.from("promotion_codes").select();
  if (data) {
    return res
      .status(200)
      .json({ message: "fetch promotion successfully", data: data });
  }
  if (error) {
    return res
      .status(200)
      .json({ message: "fetch promotion fail", error: error.message });
  }
}
