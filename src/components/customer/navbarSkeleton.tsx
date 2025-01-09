import { Skeleton } from "../ui/skeleton";
export function NavbarSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="user-name-skeleton h-3 w-10 hidden lg:block" />
      <Skeleton className="image-skeleton h-8 w-8 rounded-full lg:h-10 lg:w-10" />
      <div className="h-8 w-8 lg:h-10 lg:w-10">
        <Skeleton className="bell-skeleton h-full w-full rounded-full" />
      </div>
    </div>
  );
}

/* <div className="flex gap-2 items-center lg:mr-20">
      <p className="hidden lg:block lg:text-[14px] text-gray-700">Guest</p>
      <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
      <div className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px]">
        <img
          src="/image/notibell.svg"
          alt="notification bell"
          className="w-full h-full"
        />
      </div>
    </div> */
