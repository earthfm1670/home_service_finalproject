import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="profile-body rounded-lg bg-white h-11/12 w-11/12 flex flex-col justify-center items-center gap-6 p-6">
      <Skeleton className="h-8 w-64 mb-4" />

      <div className="form flex flex-col items-center justify-center gap-6 w-full max-w-md">
        <div className="picture-box flex flex-col lg:flex-row justify-center items-center gap-4">
          <Skeleton className="rounded-full w-32 h-32" />
          <Skeleton className="h-10 w-56" />
        </div>

        {["Name", "Email", "Phone number", "Address"].map((field, index) => (
          <div key={index} className="flex flex-col justify-start w-full">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}

        <Skeleton className="h-10 w-56 rounded-lg mt-4" />
      </div>
    </div>
  );
}
