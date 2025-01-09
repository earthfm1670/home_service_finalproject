import IconCheck from "../ui/IconCheck";
import { useRouter } from "next/router";

interface CustomerSubmitPopUpProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  showPopUpSubmit: boolean;
  redirectPath: string; // เส้นทางที่ต้องการ redirect หลังยืนยัน
}

export function UserSubmitPopUp({
  handleSubmit,
  showPopUpSubmit, //ตั้งให้ popup แสดงผล
  redirectPath, // เส้นทางเริ่มต้น
}: CustomerSubmitPopUpProps): JSX.Element {
  const router = useRouter(); // ใช้ useRouter เพื่อสร้าง router
  const handleOkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent form submission behavior (if necessary)
    e.preventDefault();
    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // Pass the event to handleSubmit
    router.push(redirectPath);
  };

  return (
    <>
      {/* Popup for submit */}
      {showPopUpSubmit && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl 
            p-3 gap-3 absolute">
            <div className="w-full">
              <div className="flex justify-center ">
                <div className="bg-green-600 w-10 h-10 rounded-full mx-auto"></div>
                <div className="absolute top-12">
                  <IconCheck />
                </div>
              </div>
            </div>
            <h1 className="head-meassage font-medium text-xl -mb-2">
              บันทึกสำเร็จ
            </h1>
            <h1 className="syb-message text-center text-gray-500">
              กรุณากดยืนยันกลับสู่หน้าโปรไฟล์
            </h1>
            <div className="flex flex-row gap-3 mb-2">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={handleOkClick}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
