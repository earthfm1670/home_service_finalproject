import React from "react";

export default function HomeService() {
  return (
    <div className="h-[1316px]">
      <h2 className="text-[20px] font-medium text-center">
        บริการยอดฮิตของเรา
      </h2>
      {/* div for service box */}
      <div className="border h-[350px] mx-3 rounded-lg">
        <div className="h-[200px]">
          <img
            src="/image/service1.svg"
            alt="cleaningservice"
            className="w-full h-full rounded-t-md"
          ></img>
        </div>
        <div className="px-4 py-4">
          <div className="border w-[79px] h-[26px] text-[12px] flex justify-center items-center">
            บริการทั่วไป
          </div>
          <div>ทำความสะอาดทั่วไป</div>
          <div>ค่าบริการประมาณ 500.00 - 1,000.00 THB</div>
          <div>
            <a>เลือกบริการ</a>
          </div>
        </div>
      </div>
      {/* end of service box div */}
      <div>
        <div>Div for img2</div>
        <div>
          <div>บริการทั่วไป</div>
          <div>ทำความสะอาดทั่วไป</div>
          <div>ค่าบริการประมาณ 500.00 - 1,000.00 THB</div>
          <div>
            <a>เลือกบริการ</a>
          </div>
        </div>
      </div>
      <div>
        <div>Div for img3</div>
        <div>
          <div>บริการทั่วไป</div>
          <div>ทำความสะอาดทั่วไป</div>
          <div>ค่าบริการประมาณ 500.00 - 1,000.00 THB</div>
          <div>
            <a>เลือกบริการ</a>
          </div>
        </div>
      </div>
    </div>
  );
}
