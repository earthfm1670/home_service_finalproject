import { supabase } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

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

function validatePassword(password: string): boolean {
  return password.length > 12;
}
