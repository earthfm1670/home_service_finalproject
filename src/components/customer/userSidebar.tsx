import { useRouter } from "next/router";
import {
  UserRound as UserIcon,
  ClipboardList as ListIcon,
  History as HistoryIcon,
} from "lucide-react";
//TODO แก้โครงสร้าง folder
interface ParamsProp {
  userId: string;
}
export default function UserSidebar({ userId }: ParamsProp) {
  const router = useRouter();
  const handleProfile = (): void => {
    router.push(`/customerservice/${userId}`);
  };
  const handleOrderList = (): void => {
    router.push(`/customerservice/${userId}/orderlist`);
  };
  const handleHistory = (): void => {
    router.push(`/customerservice/${userId}/history`);
  };

  return (
    <>
      <div
        className="sidebar-body bg-white flex flex-col justify-start items-start 
      my-2 pl-4 pr-9 w-11/12
      lg:w-64 lg:h-64 border rounded-lg">
        <div className="header-box border-b w-full mx-4">
          <h3 className="sidebar-heade font-normal text-xl text-gray-700 p-6">
            บัญชีผู้ใช้
          </h3>
        </div>
        <div className="sidebar-buttons mx-6 my-4 flex flex-row justify-between lg:flex-col">
          <button
            className={`font-normal text-base py-3 pr-5 pl-1 w-32 lg:w-44 text-start
            flex justify-start items-center gap-2 ${
              router.pathname === `/customerservice`
                ? `text-blue-700`
                : `text-gray-950`
            } `}
            onClick={handleProfile}>
            <span>
              <UserIcon
                size={24}
                color={router.pathname === "/customerservice" ? "blue" : "grey"}
              />
            </span>
            ข้อมูลผู้ใช้งาน
          </button>

          <button
            className={`font-normal text-base py-3 pr-5 pl-1 w-32 lg:w-44 text-start 
            flex justify-start items-center gap-2 ${
              router.pathname === "/orderlist"
                ? `text-blue-700`
                : `text-gray-950`
            }`}
            onClick={handleOrderList}>
            <span>
              <ListIcon
                size={24}
                color={router.pathname === "/orderlist" ? "blue" : "grey"}
              />
            </span>
            รายการคำสั่งซ่อม
          </button>

          <button
            className={`font-normal text-base py-3 pr-5 pl-1 w-32 lg:w-44 text-start 
            flex justify-start items-center gap-2 ${
              router.pathname === "/history" ? `text-blue-700` : `text-gray-950`
            } `}
            onClick={handleHistory}>
            <span>
              <HistoryIcon
                size={24}
                color={router.pathname === "/history" ? "blue" : "grey"}
              />
            </span>
            ประวัติการซ่อม
          </button>
        </div>
      </div>
    </>
  );
}
