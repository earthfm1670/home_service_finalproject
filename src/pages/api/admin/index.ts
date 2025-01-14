import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Get all services
 *     description: Retrieves all services from the database
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   # Add other properties as needed
 *       404:
 *         description: No services found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    
    try {
      const { data: user, error } = await supabase
        .from("services")
        .select("*")

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (e) {
      const error = e as Error
      return res.status(500).json({ error: error.message });
    }
  }
}
