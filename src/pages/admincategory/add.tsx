import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import IconX from "@/components/ui/IconX";
import IconCheck from "@/components/ui/IconCheck";

export default function AdminNavbar() {
  const [showPopUpSubmit, setShowPopUpSubmit] = useState<boolean>(false);
  const [inputCategory, setInputCategory] = useState<string>();
  console.log("input category for check", inputCategory);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newInputData = {
        category: inputCategory,
      };
      console.log("new input data for create check", newInputData);

      // await axios.post(`/api/admin/management/create`, newInputData);
      await axios.post(`/api/admincategorise/create`, newInputData, {
        headers: { "Content-Type": "application/json" },
      });
      // router.push("/adminservice");
      // setShowPopup(true);
      console.log("newInputData2", newInputData);
      setShowPopUpSubmit(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCategory(event.target.value);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement; // Cast ให้เป็น HTMLElement
          if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
            e.preventDefault(); // ป้องกันการกด Enter ยกเว้นใน <textarea>
          }
        }}>
        <div className="flex flex-row w-full">
          <div>
            <AdminSidebar />
          </div>
          <div className="w-full flex flex-col">
            <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
              <div className="text-xl">เพิ่มหมวดหมู่</div>
              <div className="h-full flex flex-row items-center gap-6 relative">
                <button
                  className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
                  onClick={() => router.push("/admincategory")}>
                  ยกเลิก
                </button>
                <button
                  className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
                  type="submit">
                  สร้าง
                </button>
              </div>
            </div>
            <div>
              <div className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
                <div className="flex flex-col w-[1120px] h-[124px] border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 justify-center px-7">
                  <div className="w-full bg-white ">
                    <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
                      <label htmlFor="ชื่อบริการ">ชื่อหมวดหมู่</label>
                      <input
                        type="text"
                        onChange={handleInputCategory}
                        className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5 text-black font-normal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {showPopUpSubmit && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-3 gap-3 absolute">
            <div className="w-full">
              <div
                className="w-full flex justify-end "
                onClick={() => {
                  setShowPopUpSubmit(false);
                  window.location.reload();
                }}>
                <IconX />
              </div>
              <div className="flex justify-center ">
                <div className="bg-green-600 w-10 h-10 rounded-full mx-auto"></div>
                <div className="absolute top-12">
                  <IconCheck />
                </div>
              </div>
            </div>
            <h1 className="font-medium text-xl ">สร้างรายการสำเร็จ</h1>
            <h1 className="text-center text-gray-500">
              {/* คุณต้องการลบรายการ ‘{serviceName}’ <br /> */}
              กรุณากดยืนยันเพื่อกลับสู่หน้าหลัก ?
            </h1>
            <div className="flex flex-row gap-3 mb-2 mt-2">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                // onClick={handleDeleteImg}
                onClick={() => router.push("/admincategory")}>
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
