import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
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

  const cookieStorage = cookies();
  (await cookieStorage).set("authToken", data.session.access_token);

  return res.status(200).json({
    message: "Signed in successfully",
    access_token: data.session.access_token,
  });
}
