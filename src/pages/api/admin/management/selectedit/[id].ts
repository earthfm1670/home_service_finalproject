import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

/**
 * @swagger
 * /api/admin/management/selectedit/{id}:
 *   get:
 *     summary: Get service details by ID
 *     description: Retrieves details of a service, including associated sub-services and categories.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the service to retrieve
 *     responses:
 *       200:
 *         description: Service details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service_id:
 *                   type: integer
 *                 service_name:
 *                   type: string
 *                 service_picture_url:
 *                   type: string
 *                 sub_services:
 *                   type: array
 *                   items:
 *                     type: object
 *                 categories:
 *                   type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or missing ID
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("------------------ Start ------------------");
  if (req.method === "GET") {
    const { id } = req.query; // Dynamic Route จะดึง id จาก req.query

    console.log("Received ID:", id); // Debug log

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid or missing ID" });
    }

    try {
      // Query ข้อมูลจาก table 'services' และ join กับ table 'sub_services'
      const { data, error } = await adminSupabase
        .from("services")
        .select(
          `
          *, 
          sub_services (*),
          categories(*)
        `
        )
        .eq("service_id", Number(id)) // แปลง id เป็น number
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(data);
    } catch (e) {
      const error = e as Error;
      return res.status(500).json({ error: error.message });
    }
  }
  //  else {
  //   res.setHeader("Allow", ["GET"]);
  //   return res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
