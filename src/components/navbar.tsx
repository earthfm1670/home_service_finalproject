import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export function Navbar() {
  const router = useRouter();

  const redirectToHome = (): void => {
    router.push("/");
  };

  const redirectToServiceList = (): void => {
    router.push("/servicelist");
  };

  const redirectToLogin = (): void => {
    router.push("/login");
  };

  return (
    <div
      className="flex justify-between items-center border shadow-lg p-2 bg-white lg:px-20"
      onClick={redirectToHome}
    >
      <div className="flex gap-10">
        <img src="/image/homeservicelogo.svg"></img>
        <div className="hidden lg:block" onClick={redirectToServiceList}>
          บริการของเรา
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="lg:hidden" onClick={redirectToServiceList}>
          บริการของเรา
        </div>
        <div onClick={redirectToLogin}>
          <ButtonLogin />
        </div>
      </div>
    </div>
  );
}

export function ButtonLogin() {
  return (
    <Button className="text-[#336DF2] bg-white border border-blue-600 px-2">
      เข้าสู่ระบบ
    </Button>
  );
}
