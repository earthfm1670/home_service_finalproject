import React from "react";
import AuthNavbar from "./navbar/authNavbar";
import { useRouter } from "next/router";

import { useAuth } from "@/context/authContext";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const { authState, isLoggedIn } = useAuth();
  const user = authState.user;

  // useEffect(() => {
  //   console.log("login successful");
  //   console.log("user data");
  //   console.log(user);
  //   console.log("auth state");
  //   console.log(authState);
  //   console.log("is login " + isLoggedIn);
  //   console.log("is admin " + isAdmin);
  //   console.log("is staff " + isStaff);
  //   console.log("user role" + user?.user_metadata.role);
  // }, [authState, user]);

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
          onClick={redirectToServiceList}>
          บริการของเรา
        </div>
      </div>
      <div className="flex items-center gap-4 cursor-pointer">
        <div className="lg:hidden text-[14px]" onClick={redirectToServiceList}>
          บริการของเรา
        </div>

        {isLoggedIn ? (
          <div className="flex gap-2 items-center lg:mr-20">
            <p className="hidden lg:block lg:text-[14px] text-gray-700">
              {user?.user_metadata.name || "Guest"}
            </p>
            <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
              <AuthNavbar />
            </div>
            <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
              <img
                src="/image/notibell.svg"
                alt="notification bell"
                className="w-full h-full"></img>
            </div>
          </div>
        ) : (
          <div
            onClick={redirectToLogin}
            className="flex justify-center items-center lg:mr-16 w-[90px] h-[37px] text-[14px] font-medium text-blue-600 bg-white border border-blue-600 px-2 hover:text-blue-400 hover:border-blue-400 rounded-lg cursor-pointer">
            <button>เข้าสู่ระบบ</button>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* backup for not login */
}
{
  /* <div
  onClick={redirectToLogin}
  className="flex justify-center items-center w-[90px] h-[37px] text-[14px] font-medium text-blue-600 bg-white border border-blue-600 px-2 hover:text-blue-400 hover:border-blue-400 rounded-lg cursor-pointer"
>
  <button>เข้าสู่ระบบ</button>
</div> */
}
