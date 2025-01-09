import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";
export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { email, userRole } = req.body;
    let table;
    if (userRole === "admin") {
      table = "admins";
    } else if (userRole === "staff") {
      table = "staffs";
    } else if (userRole === "customer") {
      table = "users";
    }

    const { data: userInfo, error: userInfoError } = await supabase
      .from(`${table}`)
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
