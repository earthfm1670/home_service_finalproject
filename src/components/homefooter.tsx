import React from "react";

export default function HomeFooter() {
  return (
    <>
      {/* Footer Container */}
      <footer>
        {/* top footer section */}
        <div className="w-full h-[273px] lg:px-44 lg:py-4 lg:h-[151px] lg:flex lg:flex-row lg:items-start">
          <div className="flex items-center m-4 my-6 lg:my-6">
            <img
              src="/image/footerhouse.svg"
              className="w-[39px] h-[39px]"
            ></img>
            <div className="text-[29px] text-blue-600 font-medium">
              HomeServices
            </div>
          </div>
          <div className="my-6 lg:mx-8">
            <h2 className="text-[18px] font-medium text-gray-950 mx-4 my-2">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h2>
            <p className="text-[14px] font-normal text-gray-800 mx-4 lg:hidden">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา
            </p>
            <p className="text-[14px] font-normal text-gray-800 mx-4 lg:hidden">
              กรุงเทพมหานคร 10260
            </p>
            <p className="text-[14px] font-normal text-gray-800 mx-4 hidden lg:block">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="lg:my-6">
            <div className="flex items-center lg:pt-2">
              <div className="w-[20px] h-[20px] mr-2 mx-4 my-2">
                <img
                  src="/image/phoneicon.svg"
                  alt="phoneicon"
                  className="w-full h-full"
                ></img>
              </div>
              <div className="text-[16px] font-normal text-gray-800">
                080-540-6357
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-[20px] h-[20px] mr-2 mx-4">
                <img
                  src="/image/mailicon.svg"
                  alt="mailicon"
                  className="w-full h-full"
                ></img>
              </div>
              <div className="text-[16px] font-normal text-gray-800">
                contact@homeservices.co
              </div>
            </div>
          </div>
        </div>
        {/* bottom footer section */}
        <div className="w-full h-[116px] bg-gray-100 lg:h-[42px] lg:flex">
          <div className="mx-4 py-2 lg:hidden">
            <div className="text-[14px] text-gray-700 font-normal my-2">
              เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
            </div>
            <div className="text-[14px] text-gray-700 font-normal my-2">
              นโยบายความเป็นส่วนตัว
            </div>
          </div>
          <div className="text-[12px] text-gray-500 font-normal mx-4 lg:hidden">
            copyright © 2021 HomeServices.com All rights reserved
          </div>
          {/* footer bottom for desktop */}
          <div className="lg:w-full lg:flex lg:items-center lg:justify-around">
            <div className="text-[12px] text-gray-500 font-normal mx-4 hidden lg:block">
              copyright © 2021 HomeServices.com All rights reserved
            </div>

            <div className="flex gap-8">
              <div className="text-[14px] text-gray-700 font-normal my-2 hidden lg:block">
                เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
              </div>
              <div className="text-[14px] text-gray-700 font-normal my-2 hidden lg:block">
                นโยบายความเป็นส่วนตัว
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
