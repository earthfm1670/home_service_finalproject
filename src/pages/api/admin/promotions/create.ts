import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";
export default async function createPromotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(503).json({ error: "method not allow" });
  }
  try {
    const { discountCode, discountValue } = req.body;
    const { data: promotionCode, error: promotionCodeError } =
      await adminSupabase
        .from("promotion_code")
        .insert([
          { discount_code: discountCode, discount_value: discountValue },
        ])
        .select("discount_code")
        .single();
    if (promotionCode) {
      return res
        .status(200)
        .json({ message: `create code successfully: ${promotionCode}` });
    }
    if (promotionCodeError) {
      return res.status(400).json({
        error: `error occure during create promotion code, see detail: ${promotionCodeError.message}`,
      });
    }
  } catch (e) {
    const error = e as Error;
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
