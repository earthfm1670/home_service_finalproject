import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";
export default async function getOrderList(
    req: NextApiRequest,
    res: NextApiResponse
  ){
    if(req.method !== "POST"){
        return res.status(400).json({error: "Method no allow"})
    }
  }