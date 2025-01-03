import { type NextRequest, NextResponse } from "next/server";
import { cors } from "./middlewares/cors";
import { checkSession } from "./middlewares/checkSession";
import { cronAuth } from "./middlewares/cronAuth";

type MiddlewareMap = {
  [key: string]: (req: NextRequest) => NextResponse<unknown>;
};

const middlewareMap: MiddlewareMap = {
  "/api/auth": cronAuth,
  "/api": cors,
  "/user": checkSession,
};

export function middleware(req: NextRequest) {
  try {
    for (const path in middlewareMap) {
      if (req.nextUrl.pathname.startsWith(path)) {
        const handler = middlewareMap[path];
        if (handler) {
          return handler(req);
        }
      }
    }
  } catch (err) {
    console.log(err);
  }

  return NextResponse.next();
}
//------------------------------------------------------------------------
import { type NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export function checkSession(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const domainName = process.env.NEXT_PUBLIC_BASE_URL || "";
  const sessionToken =
    cookies["__Secure-next-auth.session-token"] ||
    cookies["next-auth.session-token"];

  try {
    if (!sessionToken || sessionToken === "") {
      return NextResponse.redirect(`${domainName}/auth/login`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.redirect(`${domainName}/auth/login`);
  }

  return NextResponse.next();
}