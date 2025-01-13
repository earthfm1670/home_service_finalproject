import { Skeleton } from "@/components/ui/skeleton";

export function ServiceHeroSkeleton() {
  return (
    <div className="relative h-[168px] w-full lg:h-56">
      <Skeleton className="w-full h-full" />
    </div>
  );
}
