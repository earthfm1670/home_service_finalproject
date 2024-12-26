import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authorizationCheck from "./middleware-stack/authorizationCheck";
import roleCheck from "./middleware-stack/roleCheck";
//create axios interceptor for frontend
export function middleware(req: NextRequest) {
  //1. modify req, add header
  //handle by axios intercept
  //2. authorizationCheck(req);
  authorizationCheck(req);
  //3. Check Role
  roleCheck(req);
  //4. return
  return NextResponse.next();
}
