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
    console.log(`No auth cookie`);
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
    console.error("JWT verification failed:", error);
    if (error instanceof Error && error.message.includes("jwt expired")) {
      console.log("Token Expired.");
      return NextResponse.redirect(new URL("/logout", req.url)); // Redirect to login page
    }
    console.log("Token check fail:", error);
    return NextResponse.redirect(new URL("/logout", req.url)); // Redirect to login page
  }
}
