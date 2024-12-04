import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.headers.authorization)
    return NextResponse.redirect(new URL(`/`, req.url));
}

// type MiddlewareMap = {
//   [key: string]: (req: NextRequest) => NextResponse<unknown>;
// };
// const middlewareMap: MiddlewareMap = {
//   "/api/admin": protectAdmin,
// };

// export async function middleware(req: NextRequest) {
//   // console.log("MW Testing");
//   // console.log(req.method);
//   // console.log(req.url);
//   // console.log(req.headers.get("origin"));
//   try {
//     for (const path in middlewareMap) {
//       if (req.nextUrl.pathname.startsWith(path)) {
//         const handler = middlewareMap[path];
//         if (handler) {
//           return handler(req);
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

export const config = { matcher: ["/api/admin/"] };
