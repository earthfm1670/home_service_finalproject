import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

export default async function edit(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ m: "This is from edit" });
}
