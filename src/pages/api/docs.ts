import { NextApiRequest, NextApiResponse } from "next";
import swaggerSpec from "@/utils/swagger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
