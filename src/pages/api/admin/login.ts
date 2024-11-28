import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";
import { supabase } from "@/utils/supabase";

interface AdminLoginRequestBody {
  email: string;
  password: string;
}

export default async function adminLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { email, password }: AdminLoginRequestBody = req.body;

  //check type of user
  const checkIfAdmin = await connectionPool.query(
    `
    SELECT user_type 
    FROM users
    WHERE email=$1`,
    [email]
  );

  if (!checkIfAdmin.rows[0]) {
    return res.status(404).json({ error: "User email not found" });
  }
  if (checkIfAdmin.rows[0].user_type !== "admin") {
    return res.status(403).json({ error: "User unauthorized" });
  }

  try {
    //loggin in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //check if credential invalid
    if (error) {
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
      message: "Admin signed in successfully",
      access_token: data.session.access_token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
