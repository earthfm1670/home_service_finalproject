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
import Image from "next/image";

export default function UnauthNavbar() {
  const router = useRouter();
  const { logout, authState, isAdmin, isStaff, isLoggedIn } = useAuth();
  const handleLogout = (): void => {
    logout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full bg-gray-100 flex justify-center items-center">
          <img
            src="/image/defaultprofile.svg"
            alt="notification bell"
            className="w-[14px] h-[14px] lg:w-[18px] lg:h-[18px]"></img>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/customerservice")}>
          User Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/adminservice")}>
          Admin Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>Staff Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
