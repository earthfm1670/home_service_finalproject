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
