import { supabase } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

interface UserLoginRequestBody {
  email: string;
  password: string;
}

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
    console.log(error);
    
    if (
      error.code === "invalid_credential" ||
      error.message.includes("Invalid login credential")
    ) {
      return res.status(400).json({ error: "Your password is incorect" });
    }
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({
    message: "Signed in successfully",
    access_token: data.session.access_token,
  });
}
