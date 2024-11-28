import React from "react";

export default function HomeFooter() {
  return (
    <>
      {/* Footer Container */}
      <footer>
        {/* top footer section */}
        <div className="w-full h-[273px]">
          <div className="flex items-center m-4">
            <img
              src="/image/footerhouse.svg"
              className="w-[39px] h-[39px]"
            ></img>
            <div className="text-[29px] text-blue-600 font-medium">
              HomeServices
            </div>
          </div>
          <div className="my-4">
            <h2 className="text-[18px] font-medium text-gray-950 mx-4 my-2">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h2>
            <p className="text-[14px] font-normal text-gray-800 mx-4">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา
            </p>
            <p className="text-[14px] font-normal text-gray-800 mx-4">
              กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="">
            <div className="flex items-center">
              <div className="w-[20px] h-[20px] mr-2 mx-4">
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
        <div className="w-full h-[116px] bg-gray-100">
          <div className="mx-4 py-2">
            <div className="text-[14px] text-gray-700 font-normal my-2">
              เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
            </div>
            <div className="text-[14px] text-gray-700 font-normal my-2">
              นโยบายความเป็นส่วนตัว
            </div>
          </div>
          <div className="text-[12px] text-gray-500 font-normal mx-4">
            copyright © 2021 HomeServices.com All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
}
