import { useRouter } from "next/router";
export function ProtectCustomer(userRole: string | undefined): void {
  const router = useRouter();
  if (userRole !== "customer") {
    console.log(`path protect not allow: No customer authorization`);
    router.push("/");
  }
}
