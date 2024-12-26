import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import roleCheck from "./roleCheck";
export default function authorizationCheck(req: NextRequest) {
  //1. access authorization
  const authorization = req.headers.get("authorization");
  if (!authorization || authorization.startsWith(`Bearer `)) {
    return NextResponse.next();
  }
  // 2. check if token is valid
  const trimedToken = authorization.split(" ")[1];
  console.log(`From auth check.`);
  //2.1 check if sercret key is exit for the sake of TS
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    console.error("SECRET_KEY is not defined in environment variables");
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }

  jwt.verify(trimedToken, secretKey, (err, payload) => {
    if (err) {
      return NextResponse.json({ status: 403, message: err.message });
    }
    req.headers.set(`userPayload`, JSON.stringify(payload));
  });

  // 3. set payload and userRole to req
  return NextResponse.next(roleCheck(req));
}
