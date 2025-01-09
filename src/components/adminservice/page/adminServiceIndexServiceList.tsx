import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
// import { IconEditBlue } from "@/components/ui/IconEditBlue";
// import { IconEditDeepBlue } from "@/components/ui/IconEditDeepBlue";
// import IconTrash from "@/components/ui/IconTrash";
// import IconTrashRed from "@/components/ui/IconTrashRed";
// import { AdminDeleteServicePopUpIndex } from "@/components/admin/admin-delete-service-popup-index";
import IconX from "@/components/ui/IconX";
import IconWarning from "@/components/ui/Iconwarning";

export const AdminserviceIndexServiceList = ({
  search,
}: {
  search: string | null;
}) => {
  // ประกาศตัวแปรเพื่อมารับข้อมูลจาก Service
  interface Service {
    id: string;
    service_id: number;
    service_name: string;
    category: string;
    category_id: any;
    created_at: string;
    updated_at: string;
  }

  // ใช้ router จาก Next.js เพื่อเปลี่ยนหน้า
  const router = useRouter();

  // สร้าง state เพื่อมารับข้อมูล service
  const [serviceList, setServicesList] = useState<Service[]>([]);
  // console.log("check data form database for show service && category",serviceList);

  // asynchronous function for get data
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `/api/admin/getdataAdmin?search=${search}`
      );
      setServicesList(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // เรียกข้อมูลเมื่อเกิดการ refresh window
  useEffect(() => {
    fetchUser();
  }, [search]);

  // mapping for style with category
  const categoryBgClassMap: Record<string, string> = {
    บริการทั่วไป: "text-blue-800 bg-blue-100 inline-block px-2 py-1",
    บริการห้องครัว: "text-purple-900 bg-purple-100 inline-block px-2 py-1",
    บริการห้องน้ำ: "text-green-900 bg-green-100 inline-block px-2 py-1",
  };
  return (
    <>
      <div className="w-full flex flex-col">
        {/* กล่องใหญ่สุดสำหรับพื้นหลังเพื่อวางเนื้อหาแนวตั้งข้างใน */}
        <div className="min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
          {/* กล่องสำหรับวางเนื้อหา */}
          <div className="flex w-[1120px] border border-gray-300 rounded-lg overflow-x-auto">
            {/* create table for handle content */}
            <table className="w-full text-gray-500">
              {/* for head of table */}
              <thead>
                <tr className="h-10 bg-gray-200 text-gray-500">
                  <th className="w-[55px]"></th>
                  <th className="w-[58px] text-center font-normal text-sm">
                    ลำดับ
                  </th>
                  <th className="max-w-[226px] text-start pl-6 font-normal text-sm">
                    ชื่อบริการ
                  </th>
                  <th className="w-[201px] text-start pl-6 font-normal text-sm">
                    หมวดหมู่
                  </th>
                  <th className="w-[230px] text-start pl-6 font-normal text-sm">
                    สร้างเมื่อ
                  </th>
                  <th className="w-[230px] text-start pl-6 font-normal text-sm">
                    แก้ไขล่าสุด
                  </th>
                  <th className="w-[120px] text-center font-normal text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              {/* for content rendering list form data */}
              {/* .sort((a, b) => a.service_id - b.service_id) */}
              <tbody>
                {Array.isArray(serviceList) && serviceList.length > 0 ? (
                  serviceList.map((service: Service, index) => (
                    <tr
                      key={service.service_id}
                      className="border-t bg-white h-20 text-black"
                    >
                      <td className="px-auto text-center active:bg-gray-600">
                        <IconDrag />
                      </td>
                      <td className="px-auto  text-center">{index + 1}</td>
                      <td
                        className={`px-6 cursor-pointer`}
                        onClick={() =>
                          router.push(
                            `/adminservice/detail/${service.service_id}`
                          )
                        }
                      >
                        {service.service_name}
                      </td>
                      <td className="px-6">
                        {/* {service.category} */}
                        <div
                          className={`rounded-md py-1 ${
                            categoryBgClassMap[service.category] ||
                            "default-class"
                          }`}
                        >
                          {service.category}
                        </div>
                      </td>
                      <td className="px-6">
                        {new Date(service.created_at).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}{" "}
                        {new Date(service.created_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </td>
                      <td className="px-6">
                        {new Date(service.updated_at).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}{" "}
                        {new Date(service.updated_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </td>

                      <td className="flex flex-row items-center justify-between px-6 py-7 ">
                        <button type="button">
                          <IconTrash
                            id={service.service_id}
                            setServicesList={setServicesList}
                            index={index}
                            serviceName={service.service_name}
                          />
                        </button>

                        <IconEdit id={service.service_id} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="w-full py-10 flex justify-center items-center text-3xl gap-3">
                        <div>Loading</div>
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-gray-800"></div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

//---------------------------------------------------------------------------------------

export function IconDrag() {
  // change color icon when active
  const [active, setActive] = useState<boolean>(false);

  // เปลี่ยนสถานะเป็น active เมื่อกดค้าง
  const handleMouseDown = () => {
    setActive(true);
  };

  // เปลี่ยนสถานะกลับเป็นไม่ active เมื่อปล่อยปุ่ม
  const handleMouseUp = () => {
    setActive(false);
  };

  return (
    <svg
      className="cursor-pointer"
      width="56"
      height="80"
      viewBox="0 0 56 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <path
        d="M24.5 33V33.01V33ZM24.5 40V40.01V40ZM24.5 47V47.01V47ZM24.5 34C24.2348 34 23.9804 33.8946 23.7929 33.7071C23.6054 33.5196 23.5 33.2652 23.5 33C23.5 32.7348 23.6054 32.4804 23.7929 32.2929C23.9804 32.1054 24.2348 32 24.5 32C24.7652 32 25.0196 32.1054 25.2071 32.2929C25.3946 32.4804 25.5 32.7348 25.5 33C25.5 33.2652 25.3946 33.5196 25.2071 33.7071C25.0196 33.8946 24.7652 34 24.5 34ZM24.5 41C24.2348 41 23.9804 40.8946 23.7929 40.7071C23.6054 40.5196 23.5 40.2652 23.5 40C23.5 39.7348 23.6054 39.4804 23.7929 39.2929C23.9804 39.1054 24.2348 39 24.5 39C24.7652 39 25.0196 39.1054 25.2071 39.2929C25.3946 39.4804 25.5 39.7348 25.5 40C25.5 40.2652 25.3946 40.5196 25.2071 40.7071C25.0196 40.8946 24.7652 41 24.5 41ZM24.5 48C24.2348 48 23.9804 47.8946 23.7929 47.7071C23.6054 47.5196 23.5 47.2652 23.5 47C23.5 46.7348 23.6054 46.4804 23.7929 46.2929C23.9804 46.1054 24.2348 46 24.5 46C24.7652 46 25.0196 46.1054 25.2071 46.2929C25.3946 46.4804 25.5 46.7348 25.5 47C25.5 47.2652 25.3946 47.5196 25.2071 47.7071C25.0196 47.8946 24.7652 48 24.5 48Z"
        stroke={active ? "#9AA1B0" : "#CCD0D7"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.5 33V33.01V33ZM31.5 40V40.01V40ZM31.5 47V47.01V47ZM31.5 34C31.2348 34 30.9804 33.8946 30.7929 33.7071C30.6054 33.5196 30.5 33.2652 30.5 33C30.5 32.7348 30.6054 32.4804 30.7929 32.2929C30.9804 32.1054 31.2348 32 31.5 32C31.7652 32 32.0196 32.1054 32.2071 32.2929C32.3946 32.4804 32.5 32.7348 32.5 33C32.5 33.2652 32.3946 33.5196 32.2071 33.7071C32.0196 33.8946 31.7652 34 31.5 34ZM31.5 41C31.2348 41 30.9804 40.8946 30.7929 40.7071C30.6054 40.5196 30.5 40.2652 30.5 40C30.5 39.7348 30.6054 39.4804 30.7929 39.2929C30.9804 39.1054 31.2348 39 31.5 39C31.7652 39 32.0196 39.1054 32.2071 39.2929C32.3946 39.4804 32.5 39.7348 32.5 40C32.5 40.2652 32.3946 40.5196 32.2071 40.7071C32.0196 40.8946 31.7652 41 31.5 41ZM31.5 48C31.2348 48 30.9804 47.8946 30.7929 47.7071C30.6054 47.5196 30.5 47.2652 30.5 47C30.5 46.7348 30.6054 46.4804 30.7929 46.2929C30.9804 46.1054 31.2348 46 31.5 46C31.7652 46 32.0196 46.1054 32.2071 46.2929C32.3946 46.4804 32.5 46.7348 32.5 47C32.5 47.2652 32.3946 47.5196 32.2071 47.7071C32.0196 47.8946 31.7652 48 31.5 48Z"
        stroke={active ? "#9AA1B0" : "#CCD0D7"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTrash({ id, setServicesList, index, serviceName }: any) {
  interface Service {
    service_id: number;
  }

  type TableState = Service[];

  const [showPopup, setShowPopup] = useState<boolean>(false);
  // console.log(updateTable, "3");

  const [active, setActive] = useState<boolean>(false);

  const handleMouseDown = () => {
    setActive(true);
  };

  const handleMouseUp = () => {
    setActive(false);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const response = await axios.delete(
        `/api/admin/management/deleteServices/${serviceId}`
      );

      if (response.status === 201) {
        console.log(`Service with ID ${serviceId} has been deleted.`);

        // อัปเดตตารางโดยการกรองข้อมูลที่ไม่ถูกลบออก
        setServicesList(
          (prevTable: TableState) =>
            prevTable.filter((_, idx: number) => idx !== index)
          // ใช้ index เพื่อกรองเฉพาะ service ที่ไม่ถูกลบ
        );
      } else {
        console.log("Failed to delete the service:", response.data.message);
      }

      console.log();
    } catch (error) {
      console.log("Error deleting the service:", error);
    }
  };

  return (
    <>
      <svg
        className="cursor-pointer"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={() => setShowPopup(true)}
      >
        <path
          d="M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM10 11V17V11ZM14 11V17V11ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
          stroke={active ? "#FF6347" : "#9AA1B0"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
            <div className="w-full">
              <div
                className="w-full flex justify-end cursor-pointer"
                onClick={() => setShowPopup(false)}
              >
                <IconX />
              </div>
              <div className="flex justify-center">
                <IconWarning />
              </div>
            </div>
            <h1 className="font-medium text-xl ">ยืนยันการลบรายการ ?</h1>
            <h1 className="text-center text-gray-500">
              คุณต้องการลบรายการ {serviceName} <br />
              ใช่หรือไม่
            </h1>
            <div className="flex flex-row gap-3">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={() => handleDelete(id)}
              >
                ลบรายการ
              </button>
              <button
                className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
                onClick={() => setShowPopup(false)}
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

function IconEdit(id: any) {
  // console.log(id)

  // change color icon when active
  const [active, setActive] = useState<boolean>(false);

  // เปลี่ยนสถานะเป็น active เมื่อกดค้าง
  const handleMouseDown = () => {
    setActive(true);
  };

  // เปลี่ยนสถานะกลับเป็นไม่ active เมื่อปล่อยปุ่ม
  const handleMouseUp = () => {
    setActive(false);
  };

  const router = useRouter();

  return (
    <svg
      className="cursor-pointer"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={() => router.push(`/adminservice/edit/${id.id}`)}
    >
      <path
        d="M8 3.99992H3C2.46957 3.99992 1.96086 4.21063 1.58579 4.5857C1.21071 4.96078 1 5.46948 1 5.99992V16.9999C1 17.5304 1.21071 18.0391 1.58579 18.4141C1.96086 18.7892 2.46957 18.9999 3 18.9999H14C14.5304 18.9999 15.0391 18.7892 15.4142 18.4141C15.7893 18.0391 16 17.5304 16 16.9999V11.9999M14.586 2.58592C14.7705 2.3949 14.9912 2.24253 15.2352 2.13772C15.4792 2.0329 15.7416 1.97772 16.0072 1.97542C16.2728 1.97311 16.5361 2.02371 16.7819 2.12427C17.0277 2.22484 17.251 2.37334 17.4388 2.56113C17.6266 2.74891 17.7751 2.97222 17.8756 3.21801C17.9762 3.4638 18.0268 3.72716 18.0245 3.99272C18.0222 4.25828 17.967 4.52072 17.8622 4.76473C17.7574 5.00874 17.605 5.22942 17.414 5.41392L8.828 13.9999H6V11.1719L14.586 2.58592Z"
        stroke={active ? "#0E3FB0" : "#336DF2"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
