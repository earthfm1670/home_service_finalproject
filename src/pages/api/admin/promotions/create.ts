import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

// sending {promotionCode: string, discountValue: flot2 (0.12) }
export default async function createPromotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(503).json({ error: "method not allowed" });
  }
  console.log("Create promotion I");

  const { promotionCode, discountValue, useLimit, selectedEndDate } = req.body;
  // log ค่า req.body ที่ได้รับจาก client
  console.log("Request Body:", req.body);

  console.log("----------------------1----------------------");

  // Validate request body
  // if (!promotionCode || !discountValue || !useLimit) {
  //   return res.status(400).json({ error: "Missing required fields" });
  // }

  console.log("----------------------2----------------------");

  // Validate date format
  if (!selectedEndDate || isNaN(new Date(selectedEndDate).getTime())) {
    return res.status(400).json({ error: "Invalid or missing end date" });
  }
  const end_at = new Date(selectedEndDate);
  console.log("selectedEndDate", end_at);

  // To avoid toISOString() causing errors
  if (isNaN(end_at.getTime())) {
    return res.status(400).json({ error: "Invalid date format for end_at" });
  }

  console.log("----------------------3----------------------");
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
            end_at: new Date(selectedEndDate).toISOString(),
          },
        ])
        .select();

    console.log("----------------------4----------------------");

    if (InsertPromotion) {
      console.log("Create promotion I");
      console.log(InsertPromotion);
      return res.status(200).json({
        message: `create code successfully: ${InsertPromotion[0].promotion_code}`,
      });
    }

    console.log("----------------------5----------------------");

    if (InsertPromotionError) {
      console.log("Create Promotion Error");
      console.log(InsertPromotionError);
      return res.status(400).json({
        error: `error occurred during create promotion code, see detail: ${InsertPromotionError.message}`,
      });
    }

    console.log("----------------------6----------------------");
  } catch (e) {
    const error = e as Error;
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
