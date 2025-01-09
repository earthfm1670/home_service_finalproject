import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutPopup } from "@/components/navbar/logoutPopup";

export default function Logout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Skeleton className="w-full h-16" /> {/* Navbar placeholder */}
      <div className="flex items-center justify-center">
        <Card className="my-10 mx-2 max-w-[614px] w-[343px] lg:w-screen">
          <CardHeader>
            <CardTitle className="text-center">
              <Skeleton className="h-8 w-32 mx-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Email form */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Password form */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Login button */}
            <Skeleton className="h-10 w-full" />
            {/* Divider */}
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-[1.25px] flex-1" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[1.25px] flex-1" />
            </div>
            {/* Facebook login button */}
            <Skeleton className="h-10 w-full" />
            {/* Register link */}
            <div className="flex justify-center items-center space-x-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
        <LogoutPopup />
      </div>
    </div>
  );
}
