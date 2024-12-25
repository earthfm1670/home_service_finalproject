import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export default function authorizationCheck(req: NextRequest) {
  if (req.headers) {
    // const url = req.url;
    // const pathName = req.nextUrl;
    console.log("-V--V--V-Header--V--V--V----------------");
    console.log(req);

    console.log(req.cookies);
    console.log("-A--A--A------------------------");
  } else {
    console.log("No header");
  }
  return NextResponse.next();
}
