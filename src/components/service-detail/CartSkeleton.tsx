import { Skeleton } from "../ui/skeleton";
export function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-20 mt-14 lg:mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
        <div className="lg:col-span-2">
          <Skeleton className="h-72" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-11" />
        </div>
      </div>
    </div>
  );
}
