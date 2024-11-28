import React from "react";

export default function HomeJoinUs() {
  return (
    <>
      {/* overall container */}
      <div className="w-full h-[731] bg-blue-600 relative">
        {/* banner */}
        <div className="w-full h-[278px]">
          <img src="/image/joinusbanner.svg" alt="handyman"></img>
        </div>
        {/* container for text */}
        <div className="mx-6 my-8">
          <h2 className="text-[32px] text-white font-medium">
            มาร่วมเป็นพนักงานซ่อมกับ HomeServices
          </h2>
          <p className="text-[16px] text-white font-medium">
            เข้ารับการฝึกอบรมที่ได้มาตรฐาน ฟรี!
          </p>
          <p className="text-[16px] text-white font-medium">
            และยังได้รับค่าตอบแทนที่มากขึ้นกว่าเดิม
          </p>
          <div className="text-[20px] text-white font-medium">
            ติดต่อมาที่อีเมล: job@homeservices.co
          </div>
        </div>
        <img
          src="/image/joinushouse.svg"
          alt="house"
          className="absolute bottom-0 right-0"
        ></img>
      </div>
    </>
  );
}
