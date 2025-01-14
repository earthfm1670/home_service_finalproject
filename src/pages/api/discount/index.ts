import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/discount:
 *   post:
 *     summary: Use a discount code
 *     description: Validates and applies a discount code
 *     tags: [Discount]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionCode
 *             properties:
 *               promotionCode:
 *                 type: string
 *               useCount:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Discount code applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     promotion_id:
 *                       type: integer
 *                     promotion_code:
 *                       type: string
 *                     discount_value:
 *                       type: number
 *                     promotion_status:
 *                       type: string
 *       400:
 *         description: Bad request or promotion code unavailable
 *       404:
 *         description: Promotion code not found
 *       500:
 *         description: Internal server error
 */

export default async function useDiscountCode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { promotionCode, useCount } = req.body;
  // for test only
  if (useCount) {
    console.log(useCount);
  }
  try {
    // 1. validate promotion code: valid and use count remain
    const { data: hasPromotion, error: hasPromotionError } = await supabase
      .from("promotion_codes")
      .select(`promotion_id, promotion_code , discount_value, promotion_status`)
      .eq(`promotion_code`, promotionCode)
      .single();

    if (hasPromotionError) {
      console.log(hasPromotionError.message);
      return res.status(404).json({
        message: `Promotion code not found: `,
        error: hasPromotionError.message,
      });
    }

    if (hasPromotion.promotion_status === "unavailable") {
      return res
        .status(400)
        .json({ error: "Promotion code is no longer available." });
    }
    // 2. use code by -1 out of useage pool
    if (hasPromotion) {
      const { error: useCodeFail } = await supabase.rpc(
        "update_promotion_use_count",
        {
          input_promotion: promotionCode,
          use_count: useCount,
        }
      );
      // 2.5 handle fail scinario
      if (useCodeFail) {
        console.log(`Fail to use promotion code: ${useCodeFail.message}`);
        return res
          .status(400)
          .json({ message: "Fail to use code", error: useCodeFail.message });
      }
    }
    // // 3. return discount value
    return res.status(201).json({
      message: `Use promotion code successfully.`,
      data: hasPromotion,
    });
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
}
