import React, { useEffect, useState } from "react";
import { AuthNavbar } from "./navbar/authNavbar";
import { useRouter } from "next/router";
import { NavbarSkeleton } from "./customer/navbarSkeleton";
import { useAuth } from "@/context/authContext";
import axios from "axios";

export function Navbar() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { authState, isLoggedIn } = useAuth();
  const [media, setMedia] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const email = authState.userEmail;
  const userRole = authState.userRole;

  const getMedia = async () => {
    try {
      const res = await axios.post("api/auth/getUser", {
        email,
        userRole,
      });
      const userName = res.data.userInfo.name;
      if (userName) {
        setUserName(userName);
      }
      const profileImage = res.data.userInfo.profile_picture_url;
      if (profileImage) {
        setMedia(profileImage);
      }
    } catch (e) {
      const error = e as Error;
      console.log("get medai error: ", error.message);
    }
  };

  const redirectToHome = (): void => {
    router.push("/");
  };

  const redirectToServiceList = (): void => {
    router.push("/servicelist");
  };

  const redirectToLogin = (): void => {
    router.push("/login");
  };

  useEffect(() => {
    console.log("Navbar loading");
    if (email) {
      getMedia();
      console.log("check auth state");
      console.log(authState);
    }
    setIsLoading(false);
  }, [email]);

  return (
    <div className="flex justify-between items-center border shadow-lg p-2 px-4 bg-white lg:px-32 ">
      <div className="flex gap-10 cursor-pointer lg:items-center lg:ml-8">
        <img
          src="/image/homeservicelogo.svg"
          onClick={redirectToHome}
          className="lg:w-[167px] mb-1"
        />
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

        {isLoading ? (
          <NavbarSkeleton />
        ) : isLoggedIn ? (
          <div className="flex gap-2 items-center lg:mr-20">
            <p className="hidden lg:block lg:text-[14px] text-gray-700">
              {userName || "Guest"}
            </p>
            <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
              <AuthNavbar media={media} />
            </div>
            <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
              <img
                src="/image/notibell.svg"
                alt="notification bell"
                className="w-full h-full"
              />
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

/* backup for not login */

/* <div
  onClick={redirectToLogin}
  className="flex justify-center items-center w-[90px] h-[37px] text-[14px] font-medium text-blue-600 bg-white border border-blue-600 px-2 hover:text-blue-400 hover:border-blue-400 rounded-lg cursor-pointer"
>
  <button>เข้าสู่ระบบ</button>
</div> */
