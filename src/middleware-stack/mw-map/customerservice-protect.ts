import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
export default async function customerserviceProtect(req: NextRequest) {
  const userRoleHeader = req.headers.get("userRole");
  if (userRoleHeader) {
    const userRole = JSON.parse(userRoleHeader);
    console.log(`From adminservice protect`);
    console.log(`user role: `, userRole);
    console.log(`path name: `, req.nextUrl.pathname);
    if (userRole !== "customer") {
      console.log("unauthorized user)");
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }
  return NextResponse.next();
}
