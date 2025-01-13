import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

const tableAssign = async (userRole: string) => {
  let table;
  if (userRole === "admin") {
    table = "admins";
  }
  if (userRole === "staff") {
    table = "staffs";
  }
  if (userRole === "customer") {
    table = "users";
  }
  console.log("table check from async: ", table);
  return table;
};

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, userRole } = req.body;
  console.log("check email: ", email);
  console.log("check role:", userRole);
  const table = await tableAssign(userRole);

  console.log("Check if async work: ", table);
  console.log("________________________");
  try {
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
