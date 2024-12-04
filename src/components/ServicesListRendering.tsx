import React from "react";
import { Tag } from "lucide-react";
import { useServices } from "./ServicesContext";

const categoryBgClassMap: Record<string, string> = {
  บริการทั่วไป: "text-blue-800 bg-blue-100",
  บริการห้องครัว: "text-purple-900 bg-purple-100",
  บริการห้องน้ำ: "text-green-900 bg-green-100",
};

const ServicesListRendering: React.FC = () => {
  const { servicesData } = useServices(); // ดึงข้อมูลจาก Context

  return (
    <div className="flex flex-col items-center">
      <section className="min-w-[375px] w-full h-auto mt-6 pb-14 bg-slate-200 lg:w-[1440px]">
        <div className="w-[349px] grid grid-cols-1 gap-6 justify-self-center mt-6 lg:w-[1121px] lg:grid-cols-3 lg:grid-rows-3 lg:content-around lg:gap-[37px]">
          {servicesData.map((service, index) => {
            const colorCategoryClass =
              categoryBgClassMap[service.category] || " "; // ใช้ค่า default ถ้า category ไม่มีใน map
            return (
              <article
                key={index}
                className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden"
              >
                <img
                  src={service.service_picture_url}
                  alt={service.service_name}
                  className="w-full h-[200px] hover:scale-10 transition hover:scale-105 duration-700"
                />
                <div className="flex flex-col items-start justify-between p-4 gap-2 w-full h-[165px]">
                  <p
                    className={`w-fit h-fit px-3 py-1 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 ${colorCategoryClass}`}
                  >
                    {service.category}
                  </p>
                  <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                    {service.service_name}
                  </h1>
                  <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                    <Tag size={16} color="#7f7676" />
                    {service.service_pricing}
                  </h2>
                  <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                    เลือกบริการ
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ServicesListRendering;
