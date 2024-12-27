import { NextRequest, NextResponse } from "next/server";
//1. เข้าถึง role ได้แล้ว
//2. เช็คว่าการส่งข้อมูล user เกิดขึ้นตอนไหนบ้าง + useEffect ทำงานยังไงกันแน่
//3. เขียน logic การตรวจสอบ role
export default async function roleCheck(req: NextRequest) {
  console.log("From rolecheck");
  //const user = req.headers.get("userPayload");
  const user = req.headers.get("userRole");
  console.log("Role check. 1");

  if (user) {
    console.log("Role check. 2.5");
    const role = JSON.parse(user);
    console.log(role.user_metadata.role);
    const userRole = role.user_metadata.role;
    req.headers.set(`userRole`, JSON.stringify(userRole));
  } else {
    console.log("Role check. 2");
    const userRole = "guest";
    req.headers.set(`userRole`, JSON.stringify(userRole));
  }

  console.log("Role check. 3");
  console.log("Role: ");
  console.log(req.headers.get(`userRole`));
  console.log("Role check. 4");
  console.log(`________________________`);
  return NextResponse.next();
}
//PASS
