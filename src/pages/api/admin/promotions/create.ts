import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";
//sending {promotionCode: string, discountValue: flot2 (0.12) }
export default async function createPromotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(503).json({ error: "method not allow" });
  }
  console.log("Create promotion I");
  const { promotionCode, discountValue, useLimit } = req.body;
  try {
    const { data: InsertPromotion, error: InsertPromotionError } =
      await adminSupabase
        .from("promotion_codes")
        .insert([
          {
            promotion_code: promotionCode,
            discount_value: discountValue,
            usage_limit: useLimit,
            usage_pool: useLimit,
            promotion_status: "available",
          },
        ])
        .select();


    if (InsertPromotion) {
      console.log("Create promotion I");
      console.log(InsertPromotion);
      return res.status(200).json({
        message: `create code successfully: ${InsertPromotion[0].promotion_code}`,
      });
    }

    if (InsertPromotionError) {
      console.log("Create Promotion Error");
      console.log(InsertPromotionError);
      return res.status(400).json({
        error: `error occure during create promotion code, see detail: ${InsertPromotionError.message}`,
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
