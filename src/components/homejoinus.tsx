import React from "react";

export default function HomeJoinUs() {
  return (
    <>
      {/* overall container */}
      <div className="w-full h-[731] lg:h-[378px] bg-blue-600 relative lg:flex">
        {/* banner */}
        <div className="w-full h-[278px] lg:w-[509px] lg:h-[378px]">
          <img
            src="/image/joinusbanner.svg"
            alt="handyman"
            className="w-full h-full"
          ></img>
        </div>
        {/* container for text */}
        <div className="mx-6 my-8 lg:mx-24 lg:my-12">
          <h2 className="text-[32px] text-white font-medium lg:text-[40px] lg:font-semibold lg:w-[402px]">
            มาร่วมเป็นพนักงานซ่อมกับ HomeServices
          </h2>
          <div className="my-6">
            <p className="text-[16px] text-white font-medium lg:text-[20px] lg:font-normal">
              เข้ารับการฝึกอบรมที่ได้มาตรฐาน ฟรี!
            </p>
            <p className="text-[16px] text-white font-medium lg:text-[20px] lg:font-normal">
              และยังได้รับค่าตอบแทนที่มากขึ้นกว่าเดิม
            </p>
          </div>
          <div className="text-[20px] text-white font-medium lg:text-[32px]">
            ติดต่อมาที่อีเมล: job@homeservices.co
          </div>
        </div>
        <img
          src="/image/joinushouse.svg"
          alt="house"
          className="absolute bottom-0 right-0 lg:w-[375px] lg:h-[375px]"
        ></img>
      </div>
    </>
  );
}
