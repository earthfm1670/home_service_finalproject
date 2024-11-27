import { supabase } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - email
 *               - password
 *               - agreementAccepted
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number (format: 0XXXXXXXXX)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (must be longer than 12 characters)
 *               agreementAccepted:
 *                 type: boolean
 *                 description: Indicates if the user has accepted the agreement and policy
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     address:
 *                       type: string
 *                       nullable: true
 *                     user_type:
 *                       type: string
 *       400:
 *         description: Bad request - validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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

interface UserRegistrationRequestBody {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  agreementAccepted: boolean;
}

export default async function userRegister(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    phoneNumber,
    email,
    password,
    agreementAccepted,
  }: UserRegistrationRequestBody = req.body;

  // Validate input
  if (!validateName(name)) {
    return res.status(400).json({ error: "Invalid name format" });
  }

  if (!validatePhoneNumber(phoneNumber)) {
    return res
      .status(400)
      .json({
        error:
          "Phone number should be in the format 0XXXXXXXXX (10 digits starting with 0)",
      });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json({ error: "Password must be longer than 12 characters" });
  }

  if (!agreementAccepted) {
    return res
      .status(400)
      .json({ error: "You must accept the agreement and policy" });
  }

  try {
    // Check if user already exists in the users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Register user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message === "User already registered") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Insert user data into 'users' table
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          user_id: data.user.id,
          name,
          email,
          phone_number: phoneNumber,
          address: null,
          user_type: "Customer",
        },
      ])
      .select();

    if (insertError) {
      // If there's an error inserting into the users table, delete the auth user
      await supabase.auth.admin.deleteUser(data.user.id);
      console.error("Error inserting user data:", insertError);

      if (insertError.code === "23505") {
        // This error code indicates a unique constraint violation
        return res.status(400).json({
          error: "User with this email or phone number already exists",
        });
      } else {
        return res.status(500).json({
          error: "Failed to create user profile",
          details: insertError.message,
        });
      }
    }

    if (!insertData || insertData.length === 0) {
      await supabase.auth.admin.deleteUser(data.user.id);
      return res
        .status(500)
        .json({ error: "Failed to create user profile: No data returned" });
    }

    return res
      .status(200)
      .json({ message: "User registered successfully", user: insertData[0] });
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

function validateName(name: string): boolean {
  return /^[a-zA-Z]+([''-]?[a-zA-Z]+)*([ ]?[a-zA-Z]+)*$/.test(name);
}

function validatePhoneNumber(phoneNumber: string): boolean {
  // Validate phone number format: 0XXXXXXXXX (10 digits starting with 0)
  return /^0\d{9}$/.test(phoneNumber);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith(".com");
}
// function validateEmail(email: string): boolean {
//   // This regex pattern is more permissive and covers most valid email formats
//   const emailRegex =
//     /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//   return emailRegex.test(email);
// }

function validatePassword(password: string): boolean {
  return password.length > 12;
}
