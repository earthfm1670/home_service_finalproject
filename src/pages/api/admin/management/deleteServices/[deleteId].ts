import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";
import { adminSupabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/admin/management/deleteServices/{deleteId}:
 *   delete:
 *     summary: Delete a service
 *     description: Deletes a service and its associated image from the database and storage.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: deleteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service to delete
 *     responses:
 *       201:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Service deleted successfully.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Service id is missing
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Service not found.
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
  const { deleteId } = req.query;

  if (!deleteId) {
    return res.status(400).json({ error: "Service id is missing." });
  }

  const servicesIdFromClient: string = Array.isArray(deleteId)
    ? deleteId[0]
    : deleteId;

  if (isNaN(Number(servicesIdFromClient))) {
    return res.status(400).json({
      error: "Invalid service id format. Service id must be a number.",
    });
  }

  const parsedId = parseInt(servicesIdFromClient, 10);

  try {
    // Step 1: ดึงข้อมูล URL ของไฟล์จากฐานข้อมูล
    const { rows } = await connectionPool.query(
      `SELECT service_picture_url FROM services WHERE service_id=$1`,
      [parsedId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Service not found." });
    }

    const imageUrl = rows[0].service_picture_url;

    // Step 2: ลบไฟล์จาก Supabase Storage
    if (imageUrl) {
      const filePath = imageUrl.split("/").pop(); // ดึงชื่อไฟล์จาก URL
      console.log("File path to delete:", filePath); // Log ตรวจสอบชื่อไฟล์

      if (!filePath) {
        console.error("Error: File path is empty.");
        return res.status(500).json({ error: "File path is invalid." });
      }

      const { data: removeResponse, error: storageError } =
        await adminSupabase.storage.from("service_pictures").remove([filePath]); // ลบไฟล์

      console.log("Remove response from storage:", removeResponse); // Log การตอบกลับจาก Supabase

      if (storageError) {
        console.error(
          "Error deleting file from Supabase Storage:",
          storageError.message
        );
        return res
          .status(500)
          .json({ error: "Error deleting file from storage." });
      }
    }

    // Step 3: ลบข้อมูลบริการจากฐานข้อมูล
    const result = await connectionPool.query(
      `DELETE FROM services WHERE service_id=$1`,
      [parsedId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Service not found." });
    }

    return res.status(201).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error(`Error during delete: ${error}`);
    return res.status(500).json({ error: "Internal server error." });
  }
}
