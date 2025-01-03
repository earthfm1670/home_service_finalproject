import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isToken } from "./middleware-stack/isToken";
import { roleCheck } from "./middleware-stack/roleCheck";
import customerserviceProtect from "./middleware-stack/mw-map/customerservice-protect";
import adminserviceProtect from "./middleware-stack/mw-map/adminservice-protect";
import handymanProtect from "./middleware-stack/mw-map/handyman-protect";
import authorizationCheck from "./middleware-stack/authorizationCheck";

// import isToken from "./middleware-stack/authorizationCheck";
//New middleware will only check if token is exit and valid, withou expire
type MiddlewareMap = {
  [key: string]: (req: NextRequest) => Promise<NextResponse<unknown>>;
};
const middlewareMap: MiddlewareMap = {
  "/customerservice": customerserviceProtect,
  "/adminservice": adminserviceProtect,
  "/handyman": handymanProtect,
};

export async function middleware(req: NextRequest) {
  // 1. validate token
  const pathName = req.nextUrl.pathname;
  const url = req.url;
  await isToken(req);
  // 2. validate role
  await roleCheck(req);
  //--------Mapping-------------------
  for (const path in middlewareMap) {
    if (req.nextUrl.pathname.startsWith(path)) {
      console.log(
        "******************Loop working******************************************************************************************************************"
      );
      const handler = middlewareMap[path];
      if (handler) {
        return handler(req);
      }
    }
  }
  //---------------------------
  // 3. api protection
  if (pathName.startsWith(`/api`)) {
    console.log("try to connect API?");
    await authorizationCheck(req);
  }

  console.log(`path name: `, pathName);
  console.log(`url: `, url);
  return NextResponse.next();
}

//---------Legacy code------------
// export default async function middleware(req: NextRequest) {
//   console.log("From MW____************____**************____*********");
//   const authorization = req.headers.get("Authorization");
//   const pathName = req.nextUrl.pathname;
//   console.log(`path name: ${pathName}`);

//   if (!authorization || !authorization.startsWith(`Bearer `)) {
//     console.log("No Authorization");
//     console.log(req.headers.get("Authorization"));
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // // 2. check if token format is valid
//   const trimedToken = authorization.split(" ")[1];
//   console.log(`Auth check. I`);

//   // 3. check if sercret key is exit for the sake of TS
//   const secretKey = process.env.SECRET_KEY;
//   if (!secretKey) {
//     console.error("SECRET_KEY is not defined in environment variables");
//     return NextResponse.json({
//       status: 500,
//       message: "Internal Server Error",
//     });
//   }

//   // 4. validate token, if not, redirect to login
//   console.log(`Auth check. II`);

//   let expired = false;
//   try {
//     await jwtVerify(trimedToken, new TextEncoder().encode(secretKey));
//     expired = false;
//     // console.log(payload);
//   } catch (err) {
//     const error = err as Error;
//     expired = true;
//     console.log(error.message);
//   }

//   console.log(`token expired? : `, expired);
//   if (expired) {
//     NextResponse.redirect(new URL("/login", req.url));
//   }

//   console.log(`Auth check. III`);
//   console.log("user has token---------------------------------------");
//   // const userRole = userPayload.user_metadata.role;
//   // //---Role base Authorization-----------------------
//   // if (pathName.startsWith("/api/customer") && userRole !== "customer") {
//   //   console.log(`Hitting customer path`);
//   //   return NextResponse.redirect(new URL("/", req.url));
//   // }
//   // if (pathName.startsWith("/api/admin") && userRole !== "admin") {
//   //   console.log(`Hitting admin path`);
//   //   return NextResponse.redirect(new URL("/", req.url));
//   // }
//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/api/customer/:path*"],
// };
