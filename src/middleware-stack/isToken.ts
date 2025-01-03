import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function isToken(req: NextRequest) {
  const secretKey = process.env.SECRET_KEY;

  // 1. access token
  const authCookie = req.cookies.get("authToken");
  const token = authCookie?.value;
  if (!token) {
    console.log(`No auth cookie`);
    return NextResponse.next(); //<< need to logout
  }

  // 2. decode and verify
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(secretKey)
  );

  const userRole = payload.user_metadata?.role;
  if (!userRole) {
    req.headers.set(`userRole`, `unauthorized`);
    return NextResponse.next();
  }

  req.headers.set(`userRole`, JSON.stringify(userRole));
  return NextResponse.next();
}
