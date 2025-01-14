import { IconFinding } from "@/components/ui/IconFindingGrey";
import { IconPlus } from "@/components/ui/IconPlusWhite";
import { useRouter } from "next/router";

interface AdminPromotionIndexNavbarProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdminPromotionIndexNavbar({
  handleInputChange,
}: AdminPromotionIndexNavbarProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-12 py-5 min-w-[1200px] border-b  border-gray-300">
        <div className="text-xl">Promotion Code</div>
        <div className="h-full flex flex-row items-center gap-6 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ">
            <IconFinding />
          </div>
          <input
            type="text"
            placeholder="ค้นหา Promotion Code..."
            onChange={handleInputChange}
            className="border border-gray-300 h-full rounded-lg w-80 pl-10"
          />
          <button
            className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg"
            onClick={() => router.push("/adminpromotioncode/add")}
          >
            เพิ่ม Promotion Code
            <span>
              <IconPlus />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
