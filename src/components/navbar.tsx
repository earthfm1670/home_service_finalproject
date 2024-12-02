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
      className="flex justify-between items-center border shadow-lg p-2 px-4 bg-white lg:px-32 "
      onClick={redirectToHome}
    >
      <div className="flex gap-10 cursor-pointer">
        <img src="/image/homeservicelogo.svg"></img>

        <div className="hidden lg:block" onClick={redirectToServiceList}>
          บริการของเรา
        </div>
      </div>
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="lg:hidden " onClick={redirectToServiceList}>
          บริการของเรา
        </div>
        <div
          onClick={redirectToLogin}
          className="flex justify-center items-center w-[90px] h-[37px] text-[14px] font-medium text-blue-600 bg-white border border-blue-600 px-2 hover:text-blue-400 hover:border-blue-400 rounded-lg cursor-pointer"
        >
          <button>เข้าสู่ระบบ</button>
        </div>
      </div>
    </div>
  );
}
