import React from "react";

export default function HomeFooter() {
  return (
    <>
      {/* Footer Container */}
      <footer>
        {/* top footer section */}
        <div className="w-full h-[273px]">
          <div className="flex items-center">
            <img
              src="/image/footerhouse.svg"
              className="w-[39px] h-[39px]"
            ></img>
            <div className="text-[29px] text-blue-600 font-medium">
              HomeServices
            </div>
          </div>
          <div>
            <h2 className="text-[18px] font-medium text-gray-950">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h2>
            <p className="text-[14px] font-normal text-gray-800">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา
            </p>
            <p className="text-[14px] font-normal text-gray-800">
              กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="">
            <div className="flex items-center">
              <div>
                <img src="/image/phoneicon.svg" alt="phoneicon"></img>
              </div>
              <div className="text-[16px] font-normal text-gray-800">
                080-540-6357
              </div>
            </div>
            <div className="flex items-center">
              <div>
                <img src="/image/mailicon.svg" alt="mailicon"></img>
              </div>
              <div className="text-[16px] font-normal text-gray-800">
                contact@homeservices.co
              </div>
            </div>
          </div>
        </div>
        {/* bottom footer section */}
        <div>
          <div>
            <div>เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์</div>
            <div>นโยบายความเป็นส่วนตัว</div>
          </div>
          <div>copyright © 2021 HomeServices.com All rights reserved</div>
        </div>
      </footer>
    </>
  );
}
