import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import chain from "./middleware-stack/chain";
import authorizationCheck from "./middleware-stack/authorizationCheck";
import roleCheck from "./middleware-stack/roleCheck";
import dummy1 from "./middleware-stack/dummyMW/dummy1";
import dummy2 from "./middleware-stack/dummyMW/dummy2";
//create axios interceptor for frontend

// export function middleware() {
//   //1. modify req, add header
//   //handle by axios intercept
//   //2. authorizationCheck(req);
//   //3. Check Role
//   //4. return
//   //================================================
//   const middlewareFactory = [authorizationCheck, roleCheck];
//   chain(middlewareFactory);

//   return NextResponse.next();
// }

export default function middleware(req: NextRequest) {
  console.log("From MW***********************************");
  authorizationCheck(req);
  roleCheck(req);
  // dummy1(req);
  // dummy2(req);
  return NextResponse.next();
}
