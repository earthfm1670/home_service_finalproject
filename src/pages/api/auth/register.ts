// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/db";

type RegisterRequestBody = {
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password }: RegisterRequestBody = req.body;

  // Register the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.status(200).json({ user: data?.user });
}
