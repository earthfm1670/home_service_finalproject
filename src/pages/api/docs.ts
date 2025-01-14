import { NextApiRequest, NextApiResponse } from "next";
import swaggerSpec from "@/utils/swagger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // เพิ่ม CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
