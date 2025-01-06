import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email } = req.body;
    const { data: userInfo, error: userInfoError } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();
    if (userInfoError) {
      return res
        .status(400)
        .json({ message: "Get user fail", error: userInfoError.message });
    }
    return res
      .status(200)
      .json({ message: "Get user successful", userInfo: userInfo });
  } catch (err) {
    const error = err as Error;
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Internal sever error", error: error.message });
  }
}
