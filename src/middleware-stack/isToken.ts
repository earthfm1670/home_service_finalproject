import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
interface JwtPayload {
  user_metadata?: {
    role?: string;
  };
}
export async function isToken(req: NextRequest) {
  const secretKey = process.env.SECRET_KEY;
  // 1. access token
  const authCookie = req.cookies.get("authToken");
  const token = authCookie?.value;
  if (!token) {
    return NextResponse.next(); //<< need to logout
  }
  // 2. decode and verify

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secretKey)
    );
    const userRole = (payload as JwtPayload).user_metadata?.role;
    if (!userRole) {
      req.headers.set(`userRole`, `unauthorized`);
      return NextResponse.next();
    }
    req.headers.set(`userRole`, JSON.stringify(userRole));
    return NextResponse.next();
  } catch (error) {
    const e = error as Error;
    console.error("JWT verification failed:", e.name);
    if (e.name === "JWTExpired") {
      console.log("Token Expired.");
    }
  }
}
