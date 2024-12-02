import { NextApiRequest, NextApiResponse } from "next";
export function protectAdmin(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Token has invalid format" });
  }
  const tokenWithoutBearer = token.split(" ")[1];
  return true;
}