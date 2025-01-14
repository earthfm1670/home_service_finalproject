import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { IconArrowBack } from "@/components/ui/IconArrowBack";

export default function AdminNavbar() {
  const router = useRouter();

  const [fetchNameCatagory, setFetchDataCategories] = useState<string>("");
  const [createAt, setCreateAt] = useState<string>(new Date().toISOString());
  const [updateAt, setUpdateAt] = useState<string>(new Date().toISOString());
  const [nameTopic, setNameTopic] = useState<string>("loading");

  const { id } = router.query;
  console.log("Router ID:", id); // ตรวจสอบค่าที่ได้รับ

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/admincategorise/selectedit/${id}`);

      console.log("check data fetching all by id", response.data.data);

      setFetchDataCategories(response.data.data.category);
      console.log(
        "check name form data in method get",
        response.data.data.category
      );

      setCreateAt(response.data.data.created_at);
      setUpdateAt(response.data.data.updated_at);
      setNameTopic(response.data.data.category);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      console.log("ID is undefined, waiting for router to be ready...");
    }
  }, [id]);

  return (
    <>
      <form
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
            {/* navbar for admin page */}
            <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
              {/* <div className="text-xl">เพิ่มหมวดหมู่</div> */}
              <div
                className="flex flex-row items-center cursor-pointer"
                onClick={() => router.push("/admincategory")}>
                <IconArrowBack />
                <div className="flex flex-col">
                  <div className="text-xs">หมวดหมู่</div>
                  <div className="text-xl font-medium">{nameTopic}</div>
                </div>
              </div>
              <div className="h-full flex flex-row items-center gap-6 relative">
                <button
                  className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
                  onClick={() => router.push(`/admincategory/edit/${id}`)}
                  type="button">
                  แก้ไข
                </button>
              </div>
            </div>
            <div>
              <div className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100 gap-5">
                <div className="flex flex-col w-[1120px] py-10 border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 justify-center px-7">
                  <div className="w-full bg-white ">
                    <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
                      <label htmlFor="ชื่อบริการ">ชื่อหมวดหมู่</label>
                      <div className="border-gray-300 h-11 rounded-lg w-[433px] items-center flex text-black font-normal">
                        {fetchNameCatagory}
                      </div>
                    </div>
                  </div>

                  {/* กล่องล่าง */}
                  <div>
                    <div className="h-px w-full bg-gray-300 mb-10"></div>
                    <div className="flex flex-row gap-5 w-[400px]">
                      <div className="flex flex-col justify-between w-full gap-5 text-gray-500 font-medium">
                        <div>สร้างเมื่อ</div>
                        <div>แก้ไขล่าสุด</div>
                      </div>
                      <div className="flex flex-col justify-between w-full gap-5 ">
                        <div className="flex gap-2">
                          <div>
                            {new Date(createAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </div>
                          {new Date(createAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                        <div className="flex gap-2 ">
                          <div>
                            {new Date(updateAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </div>
                          {new Date(updateAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
