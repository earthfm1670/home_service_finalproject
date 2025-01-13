import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const tableAssign = async (userRole: string) => {
  let table;
  if (userRole === "admin") {
    table = "admins";
  }
  if (userRole === "staff") {
    table = "staffs";
  }
  if (userRole === "customer") {
    table = "users";
  }
  console.log("table check from async: ", table);
  return table;
};

/**
 * @swagger
 * /api/auth/getUser:
 *   post:
 *     summary: Get user information
 *     description: Retrieves user information based on email and user role
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - userRole
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               userRole:
 *                 type: string
 *                 enum: [admin, staff, customer]
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get user successful
 *                 userInfo:
 *                   type: object
 *                   description: User information (structure depends on the user role)
 *       400:
 *         description: Failed to get user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get user fail
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
 *                   example: Internal server error
 *                 error:
 *                   type: string
 */

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, userRole } = req.body;
  console.log("check email: ", email);
  console.log("check role:", userRole);
  const table = await tableAssign(userRole);

  console.log("Check if async work: ", table);
  console.log("________________________");
  try {
    const { data: userInfo, error: userInfoError } = await supabase
      .from(`${table}`)
      .select()
      .eq("email", email)
      .single();
    if (userInfoError) {
      return res
        .status(400)
        .json({ message: "Get user fail", error: userInfoError.message });
    }
    return res
      .status(200)
      .json({ message: "Get user successful", userInfo: userInfo });
  } catch (err) {
    const error = err as Error;
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal sever error", error: error.message });
  }
}
