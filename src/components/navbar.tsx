import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check is user is logged in or not and use the Boolean value to set state
    const userLoggedIn: boolean = Boolean(localStorage.getItem("userToken"));
    setIsLoggedIn(userLoggedIn);
  });

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
    <div className="flex justify-between items-center border shadow-lg p-2 px-4 bg-white lg:px-32 ">
      <div className="flex gap-10 cursor-pointer">
        <img src="/image/homeservicelogo.svg" onClick={redirectToHome}></img>

        <div
          className="hidden lg:block text-[16px] font-medium"
          onClick={redirectToServiceList}
        >
          บริการของเรา
        </div>
      </div>
      <div className="flex items-center gap-4 cursor-pointer">
        <div className="lg:hidden text-[14px]" onClick={redirectToServiceList}>
          บริการของเรา
        </div>
        <div className="flex gap-2 items-center mr-20">
          {/* still hard code */}
          <p className="hidden lg:block lg:text-[14px] text-gray-700">
            สมศรี จันทร์อังคารพุธ
          </p>
          <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
            <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full bg-gray-100 flex justify-center items-center">
              <img
                src="/image/defaultprofile.svg"
                alt="notification bell"
                className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px]"
              ></img>
            </div>
          </div>
          <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
            <img
              src="/image/notibell.svg"
              alt="notification bell"
              className="w-full h-full"
            ></img>
          </div>
        </div>

        {/* backup for not login */}
        {/* <div
          onClick={redirectToLogin}
          className="flex justify-center items-center w-[90px] h-[37px] text-[14px] font-medium text-blue-600 bg-white border border-blue-600 px-2 hover:text-blue-400 hover:border-blue-400 rounded-lg cursor-pointer"
        >
          <button>เข้าสู่ระบบ</button>
        </div> */}
      </div>
    </div>
  );
}
