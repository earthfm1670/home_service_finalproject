import IconX from "../ui/IconX";
import IconCheck from "../ui/IconCheck";
import { useRouter } from "next/router";

interface AdminServiceSubmitPopUpProps {
  setShowPopUpSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  showPopUpSubmit: boolean;
  message: string; // ข้อความแสดงใน popup
  subMessage: string; // ข้อความย่อย
  confirmationText: string; // ข้อความบนปุ่มยืนยัน
  redirectPath: string ; // เส้นทางที่ต้องการ redirect หลังยืนยัน
}

export function AdminSubmitPopUp({
  setShowPopUpSubmit,
  showPopUpSubmit,
  message, // ข้อความเริ่มต้น
  subMessage, // ข้อความย่อยเริ่มต้น
  confirmationText, // ข้อความบนปุ่มเริ่มต้น
  redirectPath, // เส้นทางเริ่มต้น
}: AdminServiceSubmitPopUpProps): JSX.Element {
  const router = useRouter(); // ใช้ useRouter เพื่อสร้าง router

  return (
    <>
      {/* Popup for submit */}
      {showPopUpSubmit && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl 
            p-3 gap-3 absolute"
          >
            <div className="w-full">
              <div
                className="w-full flex justify-end "
                onClick={() => {
                  setShowPopUpSubmit(false);
                  window.location.reload();
                }}
              >
                <IconX />
              </div>
              <div className="flex justify-center ">
                <div className="bg-green-600 w-10 h-10 rounded-full mx-auto"></div>
                <div className="absolute top-12">
                  <IconCheck />
                </div>
              </div>
            </div>
            <h1 className="font-medium text-xl -mb-2">{message}</h1>
            <h1 className="text-center text-gray-500">{subMessage}</h1>
            <div className="flex flex-row gap-3 mb-2">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={() => router.push(redirectPath)}
              >
                {confirmationText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
