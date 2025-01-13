import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

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
