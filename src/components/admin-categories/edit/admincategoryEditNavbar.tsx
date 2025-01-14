import { useRouter } from "next/router";
import { IconArrowBack } from "@/components/ui/IconArrowBack";
interface Category {
  categoryTitle: string;
}
export function AdminCategoryEditNavbar({ categoryTitle }: Category) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b border-gray-300 z-10">
        {/* <div className="text-xl">เพิ่มหมวดหมู่</div> */}
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={() => router.push("/admincategory")}
        >
          <IconArrowBack />
          <div className="flex flex-col">
            <div className="text-xs">หมวดหมู่</div>
            <div className="text-xl font-medium">{categoryTitle}</div>
          </div>
        </div>
        <div className="h-full flex flex-row items-center gap-6">
          <button
            type="button"
            className="bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
            onClick={() => router.push("/admincategory")}
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center"
          >
            บันทึก
          </button>
        </div>
      </div>
    </>
  );
}
