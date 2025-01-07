import IconX from "../ui/IconX";
import IconWarning from "../ui/Iconwarning";

interface AdminDeleteServicePopUp {
  deleteServiceButton: boolean;
  setDeleteServiceButton: React.Dispatch<React.SetStateAction<boolean>>;
  inputTitle: string;
  handleDelete: (id: string | string[] | undefined) => Promise<void>;
  id: string | string[] | undefined;
}

export function AdminDeleteServicePopUp({
  deleteServiceButton,
  setDeleteServiceButton,
  inputTitle,
  handleDelete,
  id,
}: AdminDeleteServicePopUp) {
  return (
    <>
      {deleteServiceButton && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
            <div className="w-full">
              <div
                className="w-full flex justify-end cursor-pointer"
                onClick={() => setDeleteServiceButton(false)}
              >
                <IconX />
              </div>
              <div className="flex justify-center">
                <IconWarning />
              </div>
            </div>
            <h1 className="font-medium text-xl ">ยืนยันการลบรายการ ?</h1>
            <h1 className="text-center text-gray-500">
              คุณต้องการลบรายการ {inputTitle.toString()} <br />
              ใช่หรือไม่
            </h1>
            <div className="flex flex-row gap-3">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={() => handleDelete(id)}
                type="button"
              >
                ลบรายการ
              </button>
              <button
                className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
                onClick={() => setDeleteServiceButton(false)}
                type="button"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
