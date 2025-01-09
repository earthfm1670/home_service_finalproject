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
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthNavbarProps {
  media: string;
}

export const AuthNavbar: React.FC<AuthNavbarProps> = ({ media }) => {
  const router = useRouter();
  const { logout, isAdmin, isStaff, authState } = useAuth();
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const handleLogout = (): void => {
    logout();
    router.push("/");
  };
  const userId = authState.user?.sub;
  const email = authState.userEmail;
  useEffect(() => {
    if (email) {
      setIsProfileLoading(false);
    }
  }, [email]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-full flex justify-center items-center">
          {isProfileLoading ? (
            <Skeleton className="h-full w-full rounded-full" />
          ) : (
            <img
              src={media}
              alt="profile image"
              className="w-full h-full object-cover"
            />
          )}
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
};
