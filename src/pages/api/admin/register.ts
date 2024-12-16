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
    //FIXME change to supabase query && find new way to get email
    //check if user already exists in users table
    const { data: checkIfUserExit } = await adminSupabase
      .from("admins")
      .select("admin_id")
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
          role: "admin",
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

    // Insert user data into users table
    //FIXME change to supabase query && change user_type to role_id = 2
    const { data: insertedAdmin, error: insertedAdminError } =
      await adminSupabase
        .from("admins")
        .insert([
          {
            admin_id: data.user.id,
            name,
            email,
            phone_number: phoneNumber,
            address: null,
            role_id: 2,
          },
        ])
        .select();

    if (insertedAdminError) {
      await adminSupabase.auth.admin.deleteUser(data.user.id);
      console.log("Fail to insert admin data.");
      console.log(insertedAdminError);
      return res.status(500).json({ error: "Fail to insert admin data." });
    }

    return res
      .status(201)
      .json({ message: "Register successfully", detail: insertedAdmin[0] });
  } catch (err) {
    console.log("Unexpected error during registration:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}
