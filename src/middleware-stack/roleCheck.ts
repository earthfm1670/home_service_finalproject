import { NextRequest, NextResponse } from "next/server";
//1. เข้าถึง role ได้แล้ว
//2. เช็คว่าการส่งข้อมูล user เกิดขึ้นตอนไหนบ้าง + useEffect ทำงานยังไงกันแน่
//3. เขียน logic การตรวจสอบ role
export async function roleCheck(req: NextRequest) {
  console.log("From rolecheck");
  //const user = req.headers.get("userPayload");
  const role = req.headers.get("userRole");
  console.log(`Form role check: ${role}`);
  if (role === `unauthorized`) {
    console.log(`User unauthorized`);
  }
  console.log(`________________________`);
  return NextResponse.next();
}
//PASS
