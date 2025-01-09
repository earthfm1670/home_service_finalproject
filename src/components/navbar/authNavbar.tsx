import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthNavbar() {
  const router = useRouter();
  const { logout, isAdmin, isStaff, authState } = useAuth();
  const [media, setMedai] = useState<string>("/image/defaultprofile.svg");
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const handleLogout = (): void => {
    logout();
    router.push("/");
  };
  const userId = authState.user?.sub;
  const email = authState.userEmail;

  const getMedia = async () => {
    try {
      const res = await axios.post("api/auth/getUser", {
        email,
      });
      const profileImage = res.data.userInfo.profile_picture_url;
      if (profileImage) {
        setMedai(profileImage);
      }
      setIsProfileLoading(false);
    } catch (e) {
      const error = e as Error;
      console.log("get medai error: ", error.message);
    }
  };
  useEffect(() => {
    if (email) {
      getMedia();
    }
  }, [email]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full flex justify-center items-center">
          {isProfileLoading ? (
            // <img
            //   src="/image/defaultprofile.svg"
            //   alt="profile image"
            //   className="w-4 h-5 object-cover"
            // />
            <Skeleton className="h-full w-full rounded-full" />
          ) : (
            <img
              src={media}
              alt="profile image"
              className="w-full h-full object-cover"
            />
          )}

          {/* <img
            src="/image/defaultprofile.svg"
            alt="notification bell"
            className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px]"
          /> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem onClick={() => router.push("/adminservice")}>
            Admin Dashboard
          </DropdownMenuItem>
        ) : isStaff ? (
          <DropdownMenuItem onClick={() => router.push("/")}>
            Staff Dashboard
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => router.push(`/customerservice/${userId}/profile`)}>
            User Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
