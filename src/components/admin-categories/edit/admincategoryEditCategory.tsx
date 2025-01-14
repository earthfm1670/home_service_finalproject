import { useRouter } from "next/router";
import IconX from "@/components/ui/IconX";
import IconCheck from "@/components/ui/IconCheck";
import IconTrash from "@/components/ui/IconTrash";
import IconTrashRed from "@/components/ui/IconTrashRed";
import { useState } from "react";
import IconWarning from "@/components/ui/Iconwarning";
import axios from "axios";

interface Category {
  id: number;
  category: string;
  created_at: string;
  updated_at: string;
}

interface AdminCategoryEditCategory {
  inputCategory: string;
  handleInputCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showPopUpSubmit: boolean;
  setShowPopUpSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
}

export function AdminCategoryEditCategory({
  inputCategory,
  handleInputCategory,
  showPopUpSubmit,
  setShowPopUpSubmit,
  category,
}: AdminCategoryEditCategory) {
  const router = useRouter();
  const { id } = router.query;
  const [showPopupDelete, setShowPopupDelete] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admincategorise/deletecategory/${id}`);
      router.push("/admincategory");
      console.log();
    } catch (error) {
      console.log("Error deleting the service:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col justify-start items-center py-12 min-w-[1200px] bg-gray-100 gap-5">
        <div className="flex flex-col w-[1120px] py-10 border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 justify-center px-7">
          <div className="w-full bg-white">
            <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
              <label htmlFor="categoryName">ชื่อหมวดหมู่</label>
              <input
                type="text"
                id="categoryName"
                value={inputCategory}
                onChange={handleInputCategory}
                className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5 text-black font-normal"
              />
            </div>
          </div>
          <div>
            <div className="h-px w-full bg-gray-300 mb-10"></div>
            <div className="flex flex-row gap-5 w-[400px]">
              <div className="flex flex-col justify-between w-full gap-5 text-gray-500 font-medium">
                <div>สร้างเมื่อ</div>
                <div>แก้ไขล่าสุด</div>
              </div>
              <div className="flex flex-col justify-between w-full gap-5">
                <div className="flex gap-2">
                  <div>
                    {new Date(category.created_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  {new Date(category.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="flex gap-2">
                  <div>
                    {new Date(category.updated_at).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  {new Date(category.updated_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* button delete service */}
        <div className="w-[1120px] flex flex-row justify-end">
          <button
            className="flex flex-row items-center gap-2 font-medium underline cursor-pointer text-gray-500 active:text-red-600 group"
            type="button"
            // onClick={() => setDeleteServiceButton(true)}
            onClickCapture={() => {
              // setPromotionToDelete(promotionCode);
              setShowPopupDelete(true);
            }}
          >
            {/* IconTrash */}
            <div className="group-active:hidden">
              <IconTrash />
            </div>
            {/* IconTrashRed */}
            <div className="hidden group-active:inline">
              <IconTrashRed />
            </div>
            ลบบริการ
          </button>
        </div>
      </div>
      {/* show popup */}
      {showPopUpSubmit && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-3 gap-3 absolute">
            <div
              className="w-full flex justify-end"
              onClick={() => setShowPopUpSubmit(false)}
            >
              <IconX />
            </div>
            <div className="flex justify-center relative">
              <div className="bg-green-600 w-10 h-10 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <IconCheck />
              </div>
            </div>
            <h1 className="font-medium text-xl">แก้ไขรายการสำเร็จ</h1>
            <h1 className="text-center text-gray-500">
              กรุณากดยืนยันเพื่อกลับสู่หน้าหลัก
            </h1>
            <button
              className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium mb-2 mt-2"
              onClick={() => router.push("/admincategory")}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      )}
      {showPopupDelete && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
            <div className="w-full">
              <button
                type="button"
                className="ml-auto flex justify-end items-end"
                onClick={() => {
                  setShowPopupDelete(false);
                  // setPromotionToDelete(null);
                }}
              >
                <IconX />
              </button>
              <div className="flex justify-center">
                <IconWarning />
              </div>
            </div>
            <h1 className="font-medium text-xl ">ยืนยันการลบรายการ ?</h1>
            <h1 className="text-center text-gray-500">
              คุณต้องการลบรายการ &apos;{category.category}&apos; <br />
              ใช่หรือไม่
            </h1>
            <div className="flex flex-row gap-3">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={() => {
                  handleDelete();
                  setShowPopupDelete(false);
                }}
              >
                ลบรายการ
              </button>
              <button
                className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
                onClick={() => {
                  setShowPopupDelete(false);
                }}
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
