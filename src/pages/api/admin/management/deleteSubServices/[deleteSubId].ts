import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

// interface QueryParams {
//   deleteSubId: string | string[];
// }
/**
 * @swagger
 * /api/admin/management/deleteSubServices/{deleteSubId}:
 *   delete:
 *     summary: Delete a sub-service
 *     description: Deletes a sub-service from the database based on the provided ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: deleteSubId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the sub-service to delete
 *     responses:
 *       201:
 *         description: Sub-service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete service successfully.
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
  //access params
  const { deleteSubId } = req.query;
  if (!deleteSubId) {
    return res.status(400).json({ error: "Service id is missing " });
  }
  //validate params id
  const subSevicesIdFromClient: string = Array.isArray(deleteSubId)
    ? deleteSubId[0]
    : deleteSubId;

  if (isNaN(Number(subSevicesIdFromClient))) {
    return res
      .status(400)
      .json({ error: "Invalid service id format. Id must be number." });
  }

  const parsedId = parseInt(subSevicesIdFromClient, 10);

  try {
    //query for delete
    const result = await connectionPool.query(
      `DELETE FROM sub_services WHERE id=$1`,
      [parsedId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Service not found." });
    }
    //return
    return res.status(201).json({ message: "Delete service successfully." });
  } catch (error) {
    console.log(`error during delete. see detail: ${error}`);
    return res.status(500).json({ error: "Internal server error." });
  }
}
