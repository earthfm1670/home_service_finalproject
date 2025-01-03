import IconX from "@/components/ui/IconX";
import IconWarning from "@/components/ui/Iconwarning";

interface AdminServiceDeletePopUpProps {
  showPopUpDeleteImg: boolean;
  setShowPopUpDeleteImg: (value: boolean) => void;
  handleDeleteImg: () => void; // ฟังก์ชันสำหรับลบรูปภาพ
  message?: string; // ข้อความแสดงใน popup
  subMessage?: string; // ข้อความย่อย
  confirmationText?: string; // ข้อความบนปุ่มยืนยัน
  redirectPath?: string; // เส้นทางที่ต้องการ redirect หลังยืนยัน
  cancelAction?: string // ยกเลิกคำสั่งแล้วกลับไปหน้าเดิม
}

export function AdminDeletePopUp({
  showPopUpDeleteImg,
  setShowPopUpDeleteImg,
  handleDeleteImg,
  message,
  subMessage,
  confirmationText,
  cancelAction,
}: AdminServiceDeletePopUpProps): JSX.Element {
  return (
    <>
      {/* Popup for delete image */}
      {showPopUpDeleteImg && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
            <div className="w-full">
              <div
                className="w-full flex justify-end "
                onClick={() => setShowPopUpDeleteImg(false)}
              >
                <IconX />
              </div>
              <div className="flex justify-center">
                <IconWarning />
              </div>
            </div>
            <h1 className="font-medium text-xl">{message}</h1>
            <h1 className="text-center text-gray-500">
              {/* คุณต้องการลบรายการ ‘{serviceName}’ <br /> */}
              {subMessage}
            </h1>
            <div className="flex flex-row gap-3 my-1">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={handleDeleteImg}
              >
                {confirmationText}
              </button>
              <button
                className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
                onClick={() => setShowPopUpDeleteImg(false)}
              >
                {cancelAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
