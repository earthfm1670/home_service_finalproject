import { NextFetchEvent, NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { NextMiddleware } from "next/server";

export default function dummy1(req: NextRequest) {
  const url = req.url;
  console.log(`dummy1 url => ${url}`);
  req.headers.set(`dummy1`, `data from dummy1`);
  return NextResponse.next();
}
