import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

interface UpdatedData {
  promotion_code?: string;
  discount_value?: number;
  usage_limit?: number;
  usage_pool?: number;
  end_at?: string;
  lastupdated_at?: string;
}
export default async function updatePromotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(503).json({ error: "method not allowed" });
  }

  console.log("Update promotion I");

  const { promotion_id, promotion_code, discount_value, usage_limit, end_at } =
    req.body;

  // Log ค่า req.body ที่ได้รับจาก client
  console.log("Request Body:", req.body);
  console.log("----------------------1----------------------");

  // Validate request body
  if (!promotion_id) {
    return res.status(400).json({ error: "Missing required field: id" });
  }

  const updates: UpdatedData = {};
  if (promotion_code) updates.promotion_code = promotion_code;
  if (discount_value) updates.discount_value = discount_value;
  if (usage_limit) {
    updates.usage_limit = usage_limit;
    updates.usage_pool = usage_limit; // ปรับ usage_pool ให้เท่ากับ usage_limit ใหม่
  }
  if (end_at) updates.end_at = end_at;

  // เพิ่มการอัปเดต field 'lastupdated_at' เป็นเวลาปัจจุบัน
  updates.lastupdated_at = new Date().toISOString();

  console.log("Updates to be applied:", updates);

  console.log("----------------------2----------------------");

  try {
    const { data: UpdatedPromotion, error: UpdatePromotionError } =
      await adminSupabase
        .from("promotion_codes")
        .update(updates)
        .eq("promotion_id", promotion_id)
        .select();

    console.log("----------------------3----------------------");

    if (UpdatedPromotion) {
      console.log("Update promotion I");
      console.log(UpdatedPromotion);
      return res.status(200).json({
        message: `Updated promotion successfully: ${UpdatedPromotion[0].promotion_code}`,
      });
    }

    console.log("----------------------4----------------------");

    if (UpdatePromotionError) {
      console.log("Update Promotion Error");
      console.log(UpdatePromotionError);
      return res.status(400).json({
        error: `Error occurred during updating promotion code, see detail: ${UpdatePromotionError.message}`,
      });
    }

    console.log("----------------------5----------------------");
  } catch (e) {
    const error = e as Error;
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
