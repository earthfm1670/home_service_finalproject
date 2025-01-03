import { redirect } from "next/navigation";

export function protectLogin(): void {
  const user = window.localStorage.getItem("user");
  if (user) {
    console.log("Protect login");
    redirect("/");
  }
}
