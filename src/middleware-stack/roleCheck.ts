import { NextRequest, NextResponse } from "next/server";

export default function roleCheck(req: NextRequest) {
  console.log("From rolecheck");
  const user = req.headers.get("userPayload");
  if (user) {
    const payload = JSON.parse(user);
    console.log(`Payload from role check.`);
    console.log(payload);
    console.log(`________________________`);
  } else {
    console.log("Role: Unauthenticated");
  }

  return NextResponse.next();
}
