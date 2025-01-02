import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
//New middleware will only check if token is exit and valid, withou expire
export default async function middleware(req: NextRequest) {
  console.log("From MW____************____**************____*********");
  const authorization = req.headers.get("Authorization");
  if (!authorization || !authorization.startsWith(`Bearer `)) {
    console.log("No Authorization");
    console.log(req.headers.get("Authorization"));
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // // 2. check if token format is valid
  const trimedToken = authorization.split(" ")[1];
  console.log(`Auth check. I`);

  // 3. check if sercret key is exit for the sake of TS
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    console.error("SECRET_KEY is not defined in environment variables");
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }

  // 4. validate token, if not, redirect to login
  console.log(`Auth check. II`);

  let expired = false;
  try {
    const { payload } = await jwtVerify(
      trimedToken,
      new TextEncoder().encode(secretKey)
    );
    expired = false;
    console.log(payload);
  } catch (err) {
    const error = err as Error;
    expired = true;
    console.log(error.message);
  }

  console.log(`token expired? : `, expired);
  if (expired) {
    NextResponse.redirect(new URL("/login", req.url));
  }

  console.log(`Auth check. III`);
  console.log("user has token---------------------------------------");
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/customer/:path*", "/api/admin/:path*"],
};
//"/api/auth/getUser"
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
