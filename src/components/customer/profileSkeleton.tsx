import { Skeleton } from "@/components/ui/skeleton";

export default function profileSkeleton() {
  return (
    <div className="content bg-gray-300 h-96 flex flex-col justify-start w-full lg:ml-72 p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}
