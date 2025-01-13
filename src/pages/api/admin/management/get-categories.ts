import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/admin/management/get-categories:
 *   get:
 *     summary: Get all categories
 *     description: Retrieves all categories from the database.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful response with categories data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The category ID
 *                   name:
 *                     type: string
 *                     description: The category name
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The creation timestamp
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     description: The last update timestamp
 *       404:
 *         description: No categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method Not Allowed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error message
 */
export default async function getCategoryById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("------------------ Start ------------------");

  if (req.method === "GET") {
    try {
      // Query ข้อมูลจาก table 'categories' ตาม id
      const { data, error } = await adminSupabase
        .from("categories")
        .select("*");
      // .eq("id", id)

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      return res.status(200).json(data);
    } catch (e) {
      const error = e as Error;
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
