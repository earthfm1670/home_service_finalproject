// นำเข้า Supabase client จาก utility file
import { adminSupabase } from "@/utils/supabase";

// นำเข้า Types ของ Next.js สำหรับ Request และ Response
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/admin/promotions/delete/{promotionId}:
 *   delete:
 *     summary: Delete a promotion
 *     description: Deletes a promotion code based on the provided promotionId
 *     tags: [Admin, Promotions]
 *     parameters:
 *       - in: path
 *         name: promotionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the promotion to delete
 *     responses:
 *       204:
 *         description: Promotion successfully deleted
 *       403:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method not allow.
 *       404:
 *         description: Promotion not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: promotion not found.
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
 *                   example: Internal server error.
 *                 error:
 *                   type: string
 */

// ฟังก์ชันหลักที่เป็น API Endpoint สำหรับดึงข้อมูล promotion code
export default async function deletePromotion(
  req: NextApiRequest, // ออบเจ็กต์ Request จาก Next.js
  res: NextApiResponse // ออบเจ็กต์ Response จาก Next.js
) {
  if (req.method !== "DELETE") {
    return res.status(403).json({ error: "Method not allow." });
  }
  const promotionId = req.query.promotionId;
  console.log(promotionId);
  try {
    const { data, error } = await adminSupabase
      .from("promotion_codes")
      .delete()
      .eq("promotion_id", promotionId)
      .select();

    if (data) {
      return res.status(204).end();
    }
    if (error) {
      return res.status(404).json({
        message: "promotion not found.",
        error: error.message,
      });
    }
  } catch (e) {
    const error = e as Error;
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
}
