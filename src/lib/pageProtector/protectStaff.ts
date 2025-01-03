import { redirect } from "next/navigation";

export function protectStaff(userRole: string | undefined): void {
  if (userRole !== "staff") {
    console.log(`path protect not allow: No staff authorization`);
    redirect("/");
  }
}
