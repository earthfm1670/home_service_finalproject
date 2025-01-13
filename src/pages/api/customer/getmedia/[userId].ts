import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/customer/getmedia/{userId}:
 *   get:
 *     summary: Get user profile pictures
 *     description: Retrieves a list of profile pictures for a specific user
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successful response with image list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       id:
 *                         type: string
 *       403:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

export default async function getMedai(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method not allow" });
  }
  const userId = req.query.userId;
  console.log(userId);

  const { data: getImage, error: getImageError } = await supabase.storage
    .from(`profile_pictures`)
    .list(userId + "/", {
      limit: 10,
      offset: 0,
      sortBy: { column: `name`, order: `asc` },
    });
  if (getImage) {
    console.log("getImage");
    console.log(getImage);
  }
  if (getImageError) {
    console.log("getImageError");
    console.log(getImageError);
  }
  return res
    .status(222)
    .json({ message: "API Test Image fetching", image: getImage });
}
