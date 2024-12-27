import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import authorizationCheck from "./middleware-stack/authorizationCheck";
import roleCheck from "./middleware-stack/roleCheck";
import pathProtect from "./middleware-stack/pathProtect";
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

export default async function middleware(req: NextRequest) {
  console.log("From MW***********************************");
  await authorizationCheck(req);
  await roleCheck(req);
  await pathProtect(req);
  console.log("PASS ALL MW");
  return NextResponse.next();
}
// export const config = {
//   matcher: ["/api/customer"],
// };
