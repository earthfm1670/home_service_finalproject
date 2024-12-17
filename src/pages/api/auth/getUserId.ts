import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
export default async function getUserId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;
  const { data: userInfo, error: userInfoError } = await supabase
    .from("users")
    .select("user_id")
    .eq("email", email)
    .single();
  if (userInfoError) {
    return res
      .status(400)
      .json({ message: "Get Id fail", error: userInfoError });
  }
  return res
    .status(200)
    .json({ message: "Get Id successful", userId: userInfo });
}
