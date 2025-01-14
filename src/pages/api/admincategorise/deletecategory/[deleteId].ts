import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

/**
 * @swagger
 * /api/admincategorise/deletecategory/{deleteId}:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category from the database based on the provided ID
 *     tags: [Admin, Categories]
 *     parameters:
 *       - in: path
 *         name: deleteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to delete
 *     responses:
 *       201:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category id is missing.
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error.
 */

export default async function adminDelete(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // ดึงค่า deleteId จาก query
  const { deleteId } = req.query;

  if (!deleteId) {
    return res.status(400).json({ error: "Category id is missing." });
  }

  // ตรวจสอบและแปลงค่าจาก query
  const categoryId = Array.isArray(deleteId) ? deleteId[0] : deleteId;

  if (isNaN(Number(categoryId))) {
    return res.status(400).json({
      error: "Invalid category id format. Category id must be a number.",
    });
  }

  const parsedId = parseInt(categoryId, 10);

  try {
    // ลบข้อมูลจากฐานข้อมูล
    const result = await connectionPool.query(
      `DELETE FROM categories WHERE id=$1`,
      [parsedId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    return res.status(201).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error(`Error during delete: ${error}`);
    return res.status(500).json({ error: "Internal server error." });
  }
}
