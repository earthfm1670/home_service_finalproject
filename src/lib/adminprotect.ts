import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
export function protectAdmin(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Token has invalid format" });
  }
  const tokenWithoutBearer = token.split(" ")[1];

  // jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload))=>{
  //   if(err){
  //     return res.status(401).json({message: "Token is invalid"})
  //   }
  //   req.user = payload;
  // };

}
