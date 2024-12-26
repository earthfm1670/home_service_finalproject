import { NextFetchEvent, NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { NextMiddleware } from "next/server";
export default function dummy2(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log(`dummy2 path name => ${path}`);
  console.log(`dummy2 get data =>`);
  console.log(req.headers.get("dummy1"));
  return NextResponse.next();
}
