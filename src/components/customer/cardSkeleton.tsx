import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card className="card-box w-11/12 min-h-[18rem] lg:min-h-48 my-3 ">
      <CardContent className="card-content flex flex-row justify-between items-start p-4 gap-4 lg:py-6 lg:px-6">
        <div className="flex flex-col gap-4 w-full">
          <div className="I flex flex-col gap-2">
            <Skeleton className="h-6 w-2/4" />
            <div className="lg:hidden flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <div className="II flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            <div className="lg:hidden flex gap-6 items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          <Skeleton className="buuton h-10 w-36 rounded-lg lg:hidden" />
        </div>

        <div className="rigth-box hidden lg:flex lg:flex-col lg:w-48 lg:justify-between">
          <div className="flex flex-col gap-3 mb-16">
            <div className="flex items-center justify-between">
              <Skeleton className="II h-6 w-full rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="IV h-6 w-full" />
            </div>
          </div>
          <Skeleton className="V h-11 rounded-lg w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
