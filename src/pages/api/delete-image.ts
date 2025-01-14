import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";
import { adminSupabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/delete-image:
 *   delete:
 *     summary: Delete image associated with a service
 *     description: Deletes the image from Supabase storage and removes the image URL from the service record in the database.
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service whose image should be deleted
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid service ID
 *       404:
 *         description: Service or image not found
 *       500:
 *         description: Internal server error
 */

export default async function deleteImageOnly(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { serviceId } = req.query;

  // ตรวจสอบว่า serviceId ถูกส่งมาและเป็นตัวเลข
  if (!serviceId || isNaN(Number(serviceId))) {
    return res.status(400).json({
      error: "Invalid service ID. Service ID is required and must be a number.",
    });
  }

  const parsedId = parseInt(serviceId as string, 10);

  try {
    // Step 1: ดึง URL ของรูปภาพจาก Database
    const { rows } = await connectionPool.query(
      `SELECT service_picture_url FROM services WHERE service_id=$1`,
      [parsedId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Service not found." });
    }

    const imageUrl = rows[0]?.service_picture_url;

    if (!imageUrl) {
      return res.status(404).json({ error: "No image associated with this service." });
    }

    // Step 2: ลบไฟล์จาก Supabase Storage
    const filePath = imageUrl.split('/').pop(); // แยกชื่อไฟล์จาก URL

    if (filePath) {
      const { error: storageError } = await adminSupabase
        .storage
        .from('service_pictures') // ชื่อ Bucket
        .remove([filePath]); // ลบไฟล์

      if (storageError) {
        console.error("Error deleting file from storage:", storageError.message);
        return res.status(500).json({ error: "Error deleting image from storage." });
      }

      console.log("File deleted from storage:", filePath);
    } else {
      return res.status(500).json({ error: "Invalid file path extracted from URL." });
    }

    // Step 3: อัปเดต Database เพื่อลบ URL รูปภาพ
    await connectionPool.query(
      `UPDATE services SET service_picture_url = NULL WHERE service_id = $1`,
      [parsedId]
    );

    return res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
