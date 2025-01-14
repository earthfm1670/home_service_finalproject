import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
interface UserLoginRequestBody {
  email: string;
  password: string;
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password
 *     tags: [Auth]
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
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signed in successfully
 *                 access_token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Your email or password is incorrect
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export default async function userLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password }: UserLoginRequestBody = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    //check if credential invalid
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
    message: "Signed in successfully",
    access_token: data.session.access_token,
  });
}
