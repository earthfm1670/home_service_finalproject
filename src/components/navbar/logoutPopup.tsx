import IconCheck from "../ui/IconCheck";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";

// interface CustomerSubmitPopUpProps {
//   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   showPopUpSubmit: boolean;
//   redirectPath: string; // เส้นทางที่ต้องการ redirect หลังยืนยัน
// }

export function LogoutPopup() {
  const { logout } = useAuth();
  const router = useRouter();

  const hadleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div
          className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl 
            p-3 gap-3 absolute">
          <div className="w-full">
            <div className="flex justify-center ">
              <div className="absolute top-12">
                <IconCheck />
              </div>
            </div>
          </div>
          <h1 className="head-meassage font-medium text-xl -mb-2">
            เซสชั่นหมดอายุแล้ว
          </h1>
          <h1 className="syb-message text-center text-gray-500">
            กรุณาล็อกอินอีกครั้ง
          </h1>
          <div className="flex flex-row gap-3 mb-2">
            <button
              className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
              onClick={hadleLogout}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
