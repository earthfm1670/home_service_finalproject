import React from "react";
import { Tag } from "lucide-react";
import { useServices } from "./ServicesContext";

const ServicesListRendering: React.FC = () => {
  const { servicesData } = useServices(); // ดึงข้อมูลจาก Context

  return (
    <div className="flex flex-col items-center">
      <section className="w-[375px] h-auto mt-6 bg-slate-200 lg:w-[1440px]">
        <div className="w-[349px] grid grid-cols-1 gap-6 justify-self-center mt-6 lg:w-[1121px] lg:grid-cols-3 lg:grid-rows-3 lg:content-around lg:gap-[37px]">
          {servicesData.map((service, index) => (
            <article
              key={index}
              className="w-[349px] h-[365px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.nameimage}
                className="w-full h-[200px] hover:scale-105"
              />
              <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
                <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                  {service.category}
                </p>
                <h1 className="text-lg font-medium text-gray-950 lg:text-xl">
                  {service.subCategory}
                </h1>
                <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                  <Tag size={16} color="#7f7676" />
                  ค่าบริการประมาณ {service.Price} ฿
                </h2>
                <button className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105">
                  เลือกบริการ
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ServicesListRendering;
