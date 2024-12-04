import Adminsidebar from "@/components/adminsidebar";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import { ServicesProvider } from "@/components/ServicesContext";
import AdminNavbar from "@/components/adminnavbar";

const Adminservice: React.FC = () => {
  // ดึงข้อมูลจาก Context
  // สร้าง state เพื่อมารับข้อมูล service
  const { getServicesData, servicesData } = useServices();

  // เรียกข้อมูลเมื่อเกิดการ refresh window
  useEffect(() => {
    getServicesData();
    console.log(servicesData); // ตรวจสอบข้อมูลใน servicesData
  }, []);

  // style text category
  const categoryBgClassMap: Record<string, string> = {
    บริการทั่วไป: "text-blue-800 bg-blue-100 inline-block px-2 py-1",
    บริการห้องครัว: "text-purple-900 bg-purple-100 inline-block px-2 py-1",
    บริการห้องน้ำ: "text-green-900 bg-green-100 inline-block px-2 py-1",
  };

  return (
    <>
      <div className="">
        <div className="flex flex-row w-full">
          {/* sidebar admin */}
          <Adminsidebar />
          {/* work space for admin page */}
          <div className="w-full flex flex-col">
            <AdminNavbar />
            {/* list detail for admin page */}
            <div className="min-h-screen w-full flex justify-center items-start py-10 min-w-[1200px]  bg-gray-100">
              <div className="flex w-[1120px] border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-gray-500">
                  <thead>
                    <tr className="h-10 bg-gray-200 text-gray-500">
                      <th className="w-[55px]"></th>
                      <th className="w-[58px] text-center font-normal">
                        ลำดับ
                      </th>
                      <th className="w-[226px] text-start pl-6 font-normal">
                        ชื่อบริการ
                      </th>
                      <th className="w-[226px] text-start pl-6 font-normal">
                        หมวดหมู่
                      </th>
                      <th className="w-[209px] text-start pl-6 font-normal">
                        สร้างเมื่อ
                      </th>
                      <th className="w-[226px] text-start pl-6 font-normal">
                        แก้ไขล่าสุด
                      </th>
                      <th className="w-[120px] text-center font-normal">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicesData.map((service, index) => (
                      <tr
                        key={index}
                        className="border-t bg-white h-20 text-black"
                      >
                        <td className="px-auto text-center active:bg-gray-600">
                          <IconDrag />
                        </td>
                        <td className="px-auto  text-center">{index + 1}</td>
                        <td className="px-6">{service.service_name}</td>
                        <td className={`px-6`}>
                          <div
                            className={` rounded-md py-1 ${
                              categoryBgClassMap[service.category]
                            }`}
                          >
                            {service.category}
                          </div>
                        </td>
                        <td className="px-6 ">{service.created_at}</td>
                        <td className="px-6 ">{service.update_at}</td>
                        <td className="flex flex-row items-center justify-between px-6 py-7 ">
                          <IconTrash />
                          <IconEdit />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ServicesProvider>
      <Adminservice />
    </ServicesProvider>
  );
};

export default App;

function IconDrag() {
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M31.5 33V33.01V33ZM31.5 40V40.01V40ZM31.5 47V47.01V47ZM31.5 34C31.2348 34 30.9804 33.8946 30.7929 33.7071C30.6054 33.5196 30.5 33.2652 30.5 33C30.5 32.7348 30.6054 32.4804 30.7929 32.2929C30.9804 32.1054 31.2348 32 31.5 32C31.7652 32 32.0196 32.1054 32.2071 32.2929C32.3946 32.4804 32.5 32.7348 32.5 33C32.5 33.2652 32.3946 33.5196 32.2071 33.7071C32.0196 33.8946 31.7652 34 31.5 34ZM31.5 41C31.2348 41 30.9804 40.8946 30.7929 40.7071C30.6054 40.5196 30.5 40.2652 30.5 40C30.5 39.7348 30.6054 39.4804 30.7929 39.2929C30.9804 39.1054 31.2348 39 31.5 39C31.7652 39 32.0196 39.1054 32.2071 39.2929C32.3946 39.4804 32.5 39.7348 32.5 40C32.5 40.2652 32.3946 40.5196 32.2071 40.7071C32.0196 40.8946 31.7652 41 31.5 41ZM31.5 48C31.2348 48 30.9804 47.8946 30.7929 47.7071C30.6054 47.5196 30.5 47.2652 30.5 47C30.5 46.7348 30.6054 46.4804 30.7929 46.2929C30.9804 46.1054 31.2348 46 31.5 46C31.7652 46 32.0196 46.1054 32.2071 46.2929C32.3946 46.4804 32.5 46.7348 32.5 47C32.5 47.2652 32.3946 47.5196 32.2071 47.7071C32.0196 47.8946 31.7652 48 31.5 48Z"
        stroke={active ? "#9AA1B0" : "#CCD0D7"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function IconTrash() {
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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <path
        d="M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM10 11V17V11ZM14 11V17V11ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
        stroke={active ? "#FF6347" : "#9AA1B0"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function IconEdit() {
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
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <path
        d="M8 3.99992H3C2.46957 3.99992 1.96086 4.21063 1.58579 4.5857C1.21071 4.96078 1 5.46948 1 5.99992V16.9999C1 17.5304 1.21071 18.0391 1.58579 18.4141C1.96086 18.7892 2.46957 18.9999 3 18.9999H14C14.5304 18.9999 15.0391 18.7892 15.4142 18.4141C15.7893 18.0391 16 17.5304 16 16.9999V11.9999M14.586 2.58592C14.7705 2.3949 14.9912 2.24253 15.2352 2.13772C15.4792 2.0329 15.7416 1.97772 16.0072 1.97542C16.2728 1.97311 16.5361 2.02371 16.7819 2.12427C17.0277 2.22484 17.251 2.37334 17.4388 2.56113C17.6266 2.74891 17.7751 2.97222 17.8756 3.21801C17.9762 3.4638 18.0268 3.72716 18.0245 3.99272C18.0222 4.25828 17.967 4.52072 17.8622 4.76473C17.7574 5.00874 17.605 5.22942 17.414 5.41392L8.828 13.9999H6V11.1719L14.586 2.58592Z"
        stroke={active ? "#0E3FB0" : "#336DF2"}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
