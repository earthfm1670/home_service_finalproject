import { Skeleton } from "@/components/ui/skeleton";

const ServiceDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* Navbar Skeleton */}
      <div className="h-16 bg-white shadow-sm mb-4"></div>

      {/* Hero Section Skeleton */}
      <div className="relative h-[168px] w-full lg:h-56">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Main Content Skeleton */}
      <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service List Skeleton */}
          <div className="lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-4">
                <Skeleton className="h-20 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>

          {/* Desktop Summary Skeleton */}
          <div className="hidden lg:block">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md lg:hidden">
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
};

export default ServiceDetailSkeleton;
