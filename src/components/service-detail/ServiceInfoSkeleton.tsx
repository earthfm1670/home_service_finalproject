import { Skeleton } from "@/components/ui/skeleton"

export function ServiceInfoSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* Main Content */}
      <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Form Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Summary Skeleton */}
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-full mb-2" />
              <Skeleton className="h-10 w-full mb-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
