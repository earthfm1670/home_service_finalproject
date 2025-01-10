import { useRouter } from "next/router";

export function AdminPromotionAddNavbar(): JSX.Element {
  const router = useRouter();

  return (
    <>
      {/* navbar for admin page */}
      <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
        <div className="text-xl">เพิ่มหมวดหมู่</div>
        <div className="h-full flex flex-row items-center gap-6 relative">
          <button
            className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
            onClick={() => router.push("/adminpromotioncode")}
          >
            ยกเลิก
          </button>
          <button
            className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
            type="submit"
          >
            สร้าง
          </button>
        </div>
      </div>
    </>
  );
}
