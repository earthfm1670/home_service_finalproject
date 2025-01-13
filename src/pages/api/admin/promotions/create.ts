import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/admin/promotions/create:
 *   post:
 *     summary: Create a new promotion code
 *     description: Creates a new promotion code with the provided details
 *     tags: [Admin, Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotion_code
 *               - discount_value
 *               - usage_limit
 *               - end_at
 *             properties:
 *               promotion_code:
 *                 type: string
 *                 description: The code for the promotion
 *               discount_value:
 *                 type: number
 *                 format: float
 *                 description: The discount value (e.g., 0.12 for 12%)
 *               usage_limit:
 *                 type: integer
 *                 description: The number of times this promotion can be used
 *               end_at:
 *                 type: string
 *                 format: date-time
 *                 description: The expiration date and time of the promotion
 *     responses:
 *       200:
 *         description: Promotion code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (missing fields or creation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       503:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

// sending {promotionCode: string, discountValue: flot2 (0.12) }
export default async function createPromotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(503).json({ error: "method not allowed" });
  }
  console.log("Create promotion I");

  const { promotion_code, discount_value, usage_limit, end_at } = req.body;

  // log ค่า req.body ที่ได้รับจาก client
  console.log("Request Body:", req.body);

  console.log("----------------------1----------------------");

  // Validate request body
  if (!promotion_code || !discount_value || !usage_limit || !end_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("----------------------2----------------------");

  // Validate date format
  // if (!selectedEndDate || isNaN(new Date(selectedEndDate).getTime())) {
  //   return res.status(400).json({ error: "Invalid or missing end date" });
  // }
  // let end_at = new Date(selectedEndDate);
  // console.log("selectedEndDate", end_at);

  // To avoid toISOString() causing errors
  // if (isNaN(end_at.getTime())) {
  //   return res.status(400).json({ error: "Invalid date format for end_at" });
  // }

  console.log("----------------------3----------------------");
  try {
    const { data: InsertPromotion, error: InsertPromotionError } =
      await adminSupabase
        .from("promotion_codes")
        .insert([
          {
            promotion_code: promotion_code,
            discount_value: discount_value,
            usage_limit: usage_limit,
            usage_pool: usage_limit,
            promotion_status: "available",
            end_at: end_at,
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
