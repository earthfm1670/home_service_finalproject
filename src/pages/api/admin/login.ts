import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase, supabase } from "@/utils/supabase";

interface AdminLoginRequestBody {
  email: string;
  password: string;
}
//FIXME Token มา แต่ user ไม่มา

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     description: Authenticate an admin user and return an access token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin signed in successfully
 *                 access_token:
 *                   type: string
 *       400:
 *         description: Bad request or invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized - incorrect email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Your email or password is incorrect
 *       403:
 *         description: Forbidden - user is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User email not found
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Method not allowed
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
 */

export default async function adminLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password }: AdminLoginRequestBody = req.body;

  //check type of user
  const { data: checkIfAdmin, error: checkIfAdminError } = await adminSupabase
    .from("admins")
    .select("role_id")
    .eq("email", email);
  if (checkIfAdminError) {
    return res
      .status(400)
      .json({ m: "check role error", e: checkIfAdminError });
  }
  if (!checkIfAdmin) {
    return res.status(404).json({ error: "User email not found" });
  }
  if (checkIfAdmin[0].role_id !== 2) {
    return res.status(403).json({ error: "User unauthorized" });
  }

  try {
    //loggin in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //check if credential invalid
    if (error) {
      if (
        error.code === "invalid_credential" ||
        error.message.includes("Invalid login credential")
      ) {
        return res
          .status(401)
          .json({ error: "Your email or password is incorect" });
      }
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({
      message: "Admin signed in successfully",
      access_token: data.session.access_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
