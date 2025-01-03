import Adminsidebar from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import axios from "axios";
import IconPicture from "@/components/ui/IconPicture";
import IconDrag from "@/components/ui/IconDragAddAdmin";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
import { stringify } from "querystring";
import IconWarning from "@/components/ui/Iconwarning";
import IconX from "@/components/ui/IconX";
import { Check } from "lucide-react";
import IconCheck from "@/components/ui/IconCheck";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Categories {
  id: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export default function AdminNavbar() {
  const [showPopUpSubmit, setShowPopUpSubmit] = useState<Boolean>(false);
  const [inputCategory, setInputCategory] = useState<string>();
  console.log("input category for check", inputCategory);
  // setInputCategory(inputCategory)

  const router = useRouter();

  const [getCategoriesData, setGetCategoriesData] = useState<Categories[]>([]);
  const [fetchNameCatagory, setFetchDataCategories] = useState<string>("");
  const [createAt, setCreateAt] = useState<string>(new Date().toISOString());
  const [updateAt, setUpdateAt] = useState<string>(new Date().toISOString());
  // setFetchDataCategories(getCategoriesData[0].category)

  // const categoryName = getCategoriesData[0].category;
  // console.log("categoryName",categoryName); // "บริการทั่วไป"

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();

  //   try {
  //     const newInputData = {
  //       category: inputCategory,
  //     };
  //     console.log("new input data for create check", newInputData);

  //     // await axios.post(`/api/admin/management/create`, newInputData);
  //     await axios.post(`/api/admincategorise/create`, newInputData, {
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     // router.push("/adminservice");
  //     // setShowPopup(true);
  //     console.log("newInputData2", newInputData);
  //     setShowPopUpSubmit(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const updatedCategoryData = {
        category: inputCategory, // ข้อมูลหมวดหมู่ที่ต้องการอัพเดต
      };
      console.log("new input data for update check", updatedCategoryData);

      // ใช้ axios.put เพื่ออัพเดตข้อมูล category ตาม id
      await axios.put(`/api/admincategorise/edit/${id}`, updatedCategoryData, {
        headers: { "Content-Type": "application/json" },
      });

      // ถ้าอัพเดตสำเร็จ
      router.push("/admincategory");
      console.log("Updated category data", updatedCategoryData);

      // ถ้าคุณต้องการให้ redirect ไปที่หน้าอื่น
      // router.push("/adminservice");
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  const handleInputCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCategory(event.target.value);
    setFetchDataCategories(event.target.value);
  };

  // const updateCategory = async (id: number, category: string) => {
  //   try {
  //     // ส่งคำขอ PUT ไปยัง API
  //     const response = await axios.put(`/api/admincategorise/edit/${id}`, {
  //       category: category, // ส่งข้อมูลใน body
  //     });

  //     console.log("Response:", response.data); // แสดงผลลัพธ์ที่ได้รับจาก API

  //   } catch (error) {
  //     console.error("Error updating category:", error);
  //   }
  // };

  //   const fetchService = async () => {
  //     try {
  //       const response = await axios.get(
  //         `/api/admin/management/selectedit/${id}`
  //       );
  //       console.log("test response fetching data", response.data);
  //       setDataParams(response.data);
  //       setServiceNameData(response.data.service_name);
  //       setNameTopic(response.data.service_name);
  //       setServiceCategoryData(response.data.categories.category);
  //       // setSubservices(response.data.sub_services);
  //       setSubservices(
  //         response.data.sub_services.map(
  //           (subService: {
  //             description: string;
  //             unit: string;
  //             unit_price: number;
  //           }) => ({
  //             ...subService,
  //             unit_price:
  //               subService.unit_price === 0 ? null : subService.unit_price,
  //           })
  //         )
  //       );
  //       console.log(
  //         "this test data response get sub_services",
  //         response.data.sub_services
  //       );
  //       setPreview(response.data.service_picture_url);
  //       setCreateAt(response.data.created_at);
  //       setUpdateAt(response.data.updated_at);
  //       setInputTitle(response.data.service_name);
  //       setInputCat(response.data.category_id);
  //       // console.log(
  //       //   "check refresh page for catrgories_id",
  //       //   response.data.categories_id
  //       // );
  //       setInputSubservice(response.data.sub_services);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

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

      // const data: Categories[] = response.data.data;
      // console.log("Response Data:", data);
      // data.forEach((item) =>
      //   console.log(
      //     "Type:", typeof item.id, "Type:", typeof id
      //   )
      // );

      // const filteredData = response.data.data.filter((item:Categories) => item.id === Number(id));

      // console.log("Filtered Data:", filteredData);
      // console.log("Params ID:", id, "Type:", typeof id);

      // setGetCategoriesData(filteredData);
      // if (filteredData.length > 0) {
      //   setInputCategory(filteredData[0].category); // ใช้ filteredData แทน getCategoriesData
      // }
      // setInputCategory(filteredData[0].category)
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
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement; // Cast ให้เป็น HTMLElement
          if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
            e.preventDefault(); // ป้องกันการกด Enter ยกเว้นใน <textarea>
          }
        }}
      >
        <div className="flex flex-row w-full">
          <div>
            <Adminsidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
              <div className="text-xl">เพิ่มหมวดหมู่</div>
              <div className="h-full flex flex-row items-center gap-6 relative">
                {/* <button
                  className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
                  onClick={() => router.push("/admincategory")}
                >
                  ยกเลิก
                </button> */}
                <button
                  className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
                  onClick={() => router.push(`/admincategory/edit/${id}`)}
                >
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
                      {/* <input
                        type="text"
                        onChange={handleInputCategory}
                        value={fetchNameCatagory}
                        className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5 text-black font-normal"
                      /> */}
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
                            {new Date(updateAt).toLocaleDateString("en-US", {
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
                        <div className="flex gap-2 ">
                          <div>
                            {new Date(createAt).toLocaleDateString("en-US", {
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
