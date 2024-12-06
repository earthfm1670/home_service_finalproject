import React from "react";
import { Phone, Mail } from "lucide-react";

const ServicesListBannerFooter: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full">
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

      <footer className="w-full h-[389px] flex flex-col items-center justify-center lg:h-[193px]">
        <div className="min-w-[375px] w-full h-[273px] flex flex-col sm:flex-row sm:items-center sm:flex-wrap px-4 py-6 gap-6 lg:h-[151px] lg:max-w-[1440px] mx-auto">
          <div className="min-w-[253px] flex h-11 items-center gap-2 lg:pl-36 lg:top-[46px] lg:max-w-64 lg:h-11 ">
            <img
              src="image/homeservicesmalllogo.png"
              alt="homeservicesmalllogo"
              className="size-10 opacity-90"
            />
            <h1 className="text-3xl font-medium text-blue-600">HomeServices</h1>
          </div>
          <div className="flex flex-col w-full gap-2 min-w-[343px] sm:w-64 h-[77px] lg:h-auto lg:pl-[199px]">
            <h1 className="text-lg font-medium text-gray-950  lg:w-56 lg:h-7">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h1>
            <p className="text-sm font-normal text-gray-800 lg:w-[480px] lg:h-[21px] ">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-[343px] h-14 lg:pl-[369px]">
            <span>
              <p className="text-base font-normal text-gray-800 flex gap-3">
                <Phone size={20} />
                080-540-63575
              </p>
            </span>
            <span>
              <p className="text-base font-normal text-gray-800 flex gap-3">
                <Mail size={20} />
                contact@homeservices.com
              </p>
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-100 lg:flex lg:justify-center">
          <div className="w-full h-[116px] flex flex-col sm:flex-row sm:items-center sm:flex-wrap p-4 gap-4 lg:h-[42px] lg:relative lg:max-w-[1440px]">
            <span className=" w-[343px] h-[50px] flex flex-col justify-between text-sm font-normal text-gray-700 lg:absolute lg:right-40 lg:top-[13px] lg:flex-row lg:w-96 lg:h-[21px]">
              <p>เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์</p>
              <p>นโยบายความเป็นส่วนตัว</p>
            </span>
            <p className=" w-[343px] text-xs font-normal text-gray-500 lg:absolute lg:left-40 lg:top-3 lg:w-[372px] lg:h-[18px]">
              copyright © 2021 HomeServices.com All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesListBannerFooter;
