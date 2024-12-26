import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function roleCheck(req: NextRequest) {
  console.log("From rolecheck");
  const user = req.headers.get("userPayload");
  const payload = JSON.parse(user);
  console.log(`Payload from role check.`);
  console.log(payload);
  console.log(`________________________`);

  return NextResponse.next();
}
