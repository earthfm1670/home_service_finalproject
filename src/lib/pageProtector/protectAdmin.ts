import { redirect } from "next/navigation";

export function protectAdmin(userRole: string | undefined): void {
  if (userRole !== "admin") {
    console.log(`path protect not allow: No admin authorization`);
    redirect("/");
  }
}
