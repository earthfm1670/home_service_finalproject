import { useRouter } from "next/router";
import { useServices } from "./ServicesContext";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

const categoryBgClassMap: Record<string, string> = {
  บริการทั่วไป: "text-blue-800 bg-blue-100",
  บริการห้องครัว: "text-purple-900 bg-purple-100",
  บริการห้องน้ำ: "text-green-900 bg-green-100",
};

const ServicesListRendering: React.FC = () => {
  const { servicesData, getServicesData } = useServices(); // รับ - ส่ง ข้อมูลจาก Context
  const [serviceID, setServiceID] = useState<Number>(0);
  const router = useRouter();
  const limitRender = 9;

  const dataRender = servicesData.slice(0, limitRender);
  // console.log(servicesData);

  // ส่ง category ที่คลิกไปที่ context เพื่อ requet category ตามที่คลิกเลือกมาแสดง
  const selectCategory = (value: string) => {
    getServicesData(value);
  };

  useEffect(() => {
    if (serviceID) {
      redirectToServiceDetail();
    }
  }, [serviceID]);

  const redirectToServiceDetail = (): void => {
    router.push(`servicedetail/${serviceID}`);
  };

  return (
    <div className="flex flex-col items-center ">
      {dataRender.length > 0 ? (
        <section className="min-w-[375px] w-full h-auto pb-14 lg:pt-8 bg-gray-100 lg:max-w-[1440px] mx-auto flex justify-center">
          <div className="w-full grid grid-cols-1 gap-6 justify-self-center mt-6 sm:grid-cols-2 lg:max-w-[1121px] lg:grid-cols-3 lg:justify-self-center lg:gap-12">
            {dataRender.map((service, index) => {
              const colorCategoryClass =
                categoryBgClassMap[service.category] || " "; // ใช้ค่า default ถ้า category ไม่มีใน map
              return (
                <article
                  key={index}
                  className="w-[349px] h-[365px] flex flex-col items-center mx-auto bg-white border border-gray-300 rounded-lg overflow-hidden"
                >
                  <img
                    src={service.service_picture_url}
                    alt={service.service_name}
                    className="w-full h-[200px] cursor-pointer transition hover:scale-105 duration-700"
                    onClick={() => {
                      setServiceID(service.service_id);
                    }}
                  />
                  <div className="flex flex-col items-start justify-between p-4 gap-2 w-full h-[165px]">
                    <p
                      className={`w-fit h-fit px-3 py-1 flex items-center justify-center rounded-lg text-xs font-normal cursor-pointer text-blue-800 ${colorCategoryClass}`}
                      onClick={() => {
                        selectCategory(service.category);
                      }}
                    >
                      {service.category}
                    </p>
                    <h1
                      className="text-lg font-medium text-gray-950 lg:text-xl cursor-pointer hover:shadow-md transition duration-500"
                      onClick={() => {
                        setServiceID(service.service_id);
                      }}
                    >
                      {service.service_name}
                    </h1>
                    <h2 className="flex gap-2 text-sm font-normal text-gray-700">
                      <img
                        src="/image/pricetag.svg"
                        alt="pricetaglogo"
                        className="w-[16px] h-[16px]"
                      ></img>
                      {service.service_pricing}
                    </h2>
                    <button
                      className="text-base font-semibold underline underline-offset-1 text-blue-600 hover:scale-105 "
                      onClick={() => {
                        setServiceID(service.service_id);
                      }}
                    >
                      เลือกบริการ
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <div className="flex justify-center items-center text-center py-8 lg:py-12 px-4">
          <span className="flex flex-col items-center gap-6">
            <Search size={70} className=" text-[#cfcac7]" />
            <h3 className="text-gray-700 font-semibold text-lg lg:text-xl">
              Sorry, we couldn't find any services matching your search.
            </h3>
          </span>
        </div>
      )}
      <section className="w-full h-[458px] flex justify-center relative px-6 py-12 overflow-hidden bg-blue-600 lg:items-center lg:h-[284px]">
        <h1 className="min-w-[327px] w-full h-[243px] sm:px-10 text-lg font-medium text-center text-[#FFFFFF] lg:justify-center lg:px-0 lg:flex lg:max-w-[810px] lg:max-h-[120px] ">
          <p className="lg:hidden">
            เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ
            <br className="sm:hidden"></br> 1 แบบครบวงจร
            <br></br>
            โดยทีมช่างมืออาชีพมากกว่า 100 ทีม<br className="sm:hidden"></br>
            สามารถตอบโจทย์ด้านการบริการเรื่องบ้าน<br className="sm:hidden"></br>
            ของคุณ และสร้าง
            <br className="sm:hidden"></br>
            ความสะดวกสบายในการติดต่อกับทีมช่าง<br className="sm:hidden"></br>
            ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.<br className="sm:hidden"></br>
            มั่นใจ ช่างไม่ทิ้งงาน<br className="sm:hidden"></br>
            พร้อมรับประกันคุณภาพงาน
          </p>
          <p className="hidden lg:block lg:pt-0 lg:text-xl">
            เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร
            โดยทีมช่างมืออาชีพมากกว่า 100 ทีม <br></br>
            สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง<br></br>
            ความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.
            <br></br>
            มั่นใจ ช่างไม่ทิ้งงาน พร้อมรับประกันคุณภาพงาน
          </p>
        </h1>

        <img
          src="image/homeservicelogo.png"
          alt="homeservicelogo"
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-[250px] h-[250px] opacity-20 lg:w-[416px] lg:h-[416px] lg:left-[1370px] lg:top-[-29px]"
        />
      </section>
    </div>
  );
};

export default ServicesListRendering;
