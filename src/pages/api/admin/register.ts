import { adminSupabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import {
  validateName,
  validatePhoneNumber,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validate";

//TODO register api: pass the test : pass
//FIXME database signature is missing FIX ASAP: fixed

interface AdminRegistrationRequestBody {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  roleId: number;
  agreementAccepted: boolean;
}

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin or staff
 *     description: Register a new admin or staff user with the provided details
 *     tags: [Admin]
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
 *               - roleId
 *               - agreementAccepted
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^0[0-9]{9}$'
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 12
 *               roleId:
 *                 type: integer
 *                 enum: [2, 3]
 *               agreementAccepted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register successfully
 *       400:
 *         description: Bad request
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
 *                   example: Method not allowed
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An unexpected error occurred
 */

export default async function adminRegister(
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
    roleId,
    agreementAccepted,
  }: AdminRegistrationRequestBody = req.body;
  // Validate input
  if (!validateName) {
    return res.status(400).json({ error: "Invalid name format" });
  }
  if (!validatePhoneNumber) {
    return res.status(400).json({
      error:
        "Phone number should be in the format 0XXXXXXXXX (10 digits starting with 0)",
    });
  }
  if (!validateEmail) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!validatePassword) {
    return res
      .status(400)
      .json({ error: "Password must be at least 12 characters long" });
  }
  if (!agreementAccepted) {
    res.status(400).json({ error: "You must accept the agreement and policy" });
  }
  if (roleId < 2 || roleId > 3) {
    res.status(400).json({ error: "Role id can only be 2 or 3" });
  }

  let roleTable;
  let roleColumn;
  let roleText;
  if (roleId === 2) {
    roleTable = "admins";
    roleColumn = "admin_id";
    roleText = "admin";
  } else if (roleId === 3) {
    roleTable = "staffs";
    roleColumn = "staff_id";
    roleText = "staff";
  }

  try {
    //FIXME change to supabase query && find new way to get email
    //check if user already exists in users table
    const { data: checkIfUserExit } = await adminSupabase
      .from(`${roleTable}`)
      .select(`${roleColumn}`)
      .eq("email", email) //<<<FIXME
      .single();

    if (checkIfUserExit) {
      return res.status(400).json({ error: "Admin email already exit" });
    }

    //register via supabase auth
    const { data, error } = await adminSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: phoneNumber,
          role: roleText,
        },
      },
    });
    if (error) {
      if (error.message === "User already registered") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      return res.status(400).json({ error: error.message });
    }
    // if supabase return data === register into auth database successfull
    if (!data.user) {
      return res.status(500).json({ error: "Failed to create user" });
    }
    console.log("Check signup I", data);
    // Insert user data into users table
    //FIXME change to supabase query && change user_type to role_id = 2
    if (roleId === 2) {
      const { error: insertedAdminError } = await adminSupabase
        .from(`${roleTable}`)
        .insert([
          {
            admin_id: data.user.id,
            name,
            email,
            phone_number: phoneNumber,
            address: null,
            role_id: roleId,
          },
        ])
        .select();

      if (insertedAdminError) {
        await adminSupabase.auth.admin.deleteUser(data.user.id);
        console.log("Fail to insert admin data.");
        console.log(insertedAdminError);
        return res.status(500).json({ error: "Fail to insert admin data." });
      }
    }
    if (roleId === 3) {
      const { error: insertedAdminError } = await adminSupabase
        .from(`${roleTable}`)
        .insert([
          {
            staff_id: data.user.id,
            name,
            email,
            phone_number: phoneNumber,
            address: null,
            role_id: roleId,
          },
        ])
        .select();

      if (insertedAdminError) {
        await adminSupabase.auth.admin.deleteUser(data.user.id);
        console.log("Fail to insert admin data.");
        console.log(insertedAdminError);
        return res.status(500).json({ error: "Fail to insert admin data." });
      }
    }

    return res.status(201).json({ message: "Register successfully" });
  } catch (err) {
    console.log("Unexpected error during registration:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
