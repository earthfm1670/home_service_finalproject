import { supabase } from "@/utils/supabase";
import { connectionPool } from "@/utils/db";
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
  agreementAccepted: boolean;
}

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

  try {
    //check if user already exists in users table
    const checkIfUserExit = await connectionPool.query(
      `SELECT email FROM users WHERE email=$1`,
      [email]
    );

    if (checkIfUserExit.rows[0]) {
      return res.status(400).json({ message: "User email already exit" });
    }

    //register via supabase auth
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
    // if supabase return data === register into auth database successfull
    if (!data.user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Insert user data into users table
    const insertResult = await connectionPool.query(
      `INSERT INTO users (user_id, name, email, phone_number, address, user_type)
      VALUES ( $1,$2,$3,$4,$5,$6 )
      `,
      [data.user.id, name, email, phoneNumber, null, "admin"]
    );
    // If rowCount === 0 meannig insert fail return 500 and delete user from auth table
    if (insertResult.rowCount === 0) {
      await supabase.auth.admin.deleteUser(data.user.id);
      return res
        .status(500)
        .json({ error: "Error occurred during insert data" });
    }

    return res.status(201).json({ message: "Register successfully" });
  } catch (err) {
    console.log("Unexpected error during registration:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
