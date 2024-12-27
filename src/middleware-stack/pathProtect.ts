import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
//* next do not redirect beacuse cache
//* remove cache before redirect
export default async function pathProtect(req: NextRequest) {
  const pathName = req.nextUrl.pathname;
  const url = req.url;
  const userRole = req.headers.get("userRole");
  console.log(`url: ${url}`);
  console.log(`path name: ${pathName}`);
  console.log(`---------------------------`);
  console.log("Path Protect I");
  //   if (pathName.startsWith("/api/customer")) {
  //     console.log(`From Path : user can access customer`);
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  console.log("Path Protect II");
  //   if (pathName.startsWith("/api/admin")) {
  //     console.log(`From Path : user can access admin`);
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }

  //for handyman path name vv
  console.log("type check");
  console.log(new URL("/", req.url));
  console.log("Path Protect III");
  return NextResponse.next();
  //SOLUTION for redirect not working
  //   const redirectResponse = NextResponse.redirect(new URL("/", req.url));
  //   redirectResponse.headers.set("x-middleware-cache", "no-cache"); // Set x-middleware-cache to no-cache
  //   console.log("Path Protect IV");
  //   return redirectResponse;
  //NOT WORKING
}
//path name: /api/customer/orderlist/a8371d36-b1af-4582-a31d-4edf8fbacb38
