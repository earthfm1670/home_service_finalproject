import React from "react";

export default function HomeFooter() {
  return (
    <>
      {/* Footer Container */}
      <footer>
        {/* top footer section */}
        <div className="w-full h-[273px]">
          <div>Logo</div>
          <div>
            <h2>บริษัท โฮมเซอร์วิสเซส จำกัด</h2>
            <p>452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา</p>
            <p>กรุงเทพมหานคร 10260</p>
          </div>
          <div>
            <div>080-540-6357</div>
            <div>contact@homeservices.co</div>
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
