import Adminsidebar from "@/components/adminsidebar";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import { ServicesProvider } from "@/components/ServicesContext";


 const Adminservice: React.FC = () => {
  // ดึงข้อมูลจาก Context
  // สร้าง state เพื่อมารับข้อมูล service
  const { getServicesData, servicesData } = useServices()


  // เรียกข้อมูลเมื่อเกิดการ refresh window
  useEffect(() => {
    getServicesData();
  }, []);

  return (
    <>
        <div className=" min-h-screen bg-gray-100">
          <div className="flex flex-row ">
            {/* sidebar admin */}
            <Adminsidebar />
            {/* work space for admin page */}
            <div className="w-full flex flex-col">
              {/* list detail for admin page */}
              <div className="h-full w-full flex justify-center items-start py-10 min-w-[1200px]">
                <div className="flex w-[1120px] border border-gray-300 rounded-lg">
                  <table className="h-10 flex items-center text-gray-500 ">
                    <thead>
                      <tr>
                        <th className="min-w-[56px] "></th>
                        <th className="min-w-[58px] text-center font-medium">
                          ลำดับ
                        </th>
                        <th className="min-w-[226px] text-start pl-6 font-medium">
                          ชื่อบริการ
                        </th>
                        <th className="min-w-[226px] text-start pl-6 font-medium">
                          หมวดหมู่
                        </th>
                        <th className="min-w-[209px] text-start pl-6 font-medium">
                          สร้างเมื่อ
                        </th>
                        <th className="min-w-[226px] text-start pl-6 font-medium">
                          แก้ไขล่าสุด
                        </th>
                        <th className="min-w-[120px] text-center font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicesData.map((service, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{service.service_name}</td>
                          <td>{service.category}</td>
                          <td>{service.created_at}</td>
                          <td>{service.update_at}</td>
                          <td></td>
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
}


const App: React.FC = () => {
  return (
    <ServicesProvider>
      <Adminservice />
    </ServicesProvider>
  )
}

export default App