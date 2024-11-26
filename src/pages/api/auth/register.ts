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
    return res.status(400).json({ error: "Invalid phone number format" });
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
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Register user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Add additional user data to a custom table
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert({
        user_id: data.user!.id,
        name,
        phone_number: phoneNumber,
      });

    if (profileError) {
      return res.status(500).json({ error: "Failed to create user profile" });
    }

    return res.status(200).json({
      message: "User registered successfully",
      userId: data.user!.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
}

function validateName(name: string): boolean {
  return /^[a-zA-Z'-]+$/.test(name);
}

function validatePhoneNumber(phoneNumber: string): boolean {
  // This is a simple regex for phone number validation
  // You might want to use a more sophisticated validation based on your specific requirements
  return /^\+?[\d\s-]{10,14}$/.test(phoneNumber);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.endsWith(".com");
}

function validatePassword(password: string): boolean {
  return password.length > 12;
}
