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
  // const user = "";
  // if (!user) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }
  console.log("From MW***********************************");
  await authorizationCheck(req);
  await roleCheck(req);
  await pathProtect(req);
  console.log("PASS ALL MW");
  //---------------------------------------------
  // //มี effect แต่ยังใช้ไม่ได้ VVV
  // if (pathName.startsWith("/api/customer")) {
  //   const newURL = new URL("/login", req.nextUrl.origin);
  //   console.log(`From surface redirection`);
  //   console.log(`URL: ${newURL}`);
  //   return NextResponse.redirect(newURL);
  // }

  return NextResponse.next();
}
export const config = {
  matcher: ["/customerservice"],
};

//-----------------------------------------------
//VV ทำงานได้เฉย
// export default async function middleware(req: NextRequest) {
//   const user = "";
//   if (!user) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }
// export const config = {
//   matcher: ["/login"],
// };
//------------------------------------------------
/** โครง
 * function middleware(req){
 * await authCheck(req) << will inwoke logout() if token expired
 * return NextResponse.next()
 * }
 *
 * function routeHandler(children){
 * if(userRole !== 'admin'){
 * redirect("/")
 * }
 *
 * return({children})
 * }
 */
