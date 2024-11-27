import React from "react";

export default function HomeService() {
  return (
    <div className="h-[1316px]">
      <h2 className="my-6 text-[20px] font-medium text-center">
        บริการยอดฮิตของเรา
      </h2>
      {/* div for service box */}
      <div className="my-6 border h-[350px] mx-3 rounded-lg">
        <div className="h-[200px]">
          <img
            src="/image/service1.svg"
            alt="cleaningservice"
            className="w-full h-full rounded-t-md"
          ></img>
        </div>
        <div className="my-1 px-4 py-4">
          <div className="mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal bg-blue-100">
            บริการทั่วไป
          </div>
          <div className="text-[18px] font-medium text-gray-950">
            ทำความสะอาดทั่วไป
          </div>

          <div className="text-[14px] text-gray-700 flex gap-2 items-center">
            <img
              src="/image/pricetag.svg"
              alt="pricetaglogo"
              className="w-[16px] h-[16px]"
            ></img>
            ค่าบริการประมาณ 500.00 - 1,000.00 ฿
          </div>
          <div className="my-3">
            <a className="text-[16px] font-semibold text-blue-600 underline">
              เลือกบริการ
            </a>
          </div>
        </div>
      </div>
      {/* end of service box div */}
      {/* start of service2 */}
      <div className="my-6 border h-[350px] mx-3 rounded-lg">
        <div className="h-[200px]">
          <img
            src="/image/service2.svg"
            alt="cleaningservice"
            className="w-full h-full rounded-t-md"
          ></img>
        </div>
        <div className="my-1 px-4 py-4">
          <div className="mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal bg-blue-100">
            บริการทั่วไป
          </div>
          <div className="text-[18px] font-medium text-gray-950">
            ทำความสะอาดทั่วไป
          </div>

          <div className="text-[14px] text-gray-700 flex gap-2 items-center">
            <img
              src="/image/pricetag.svg"
              alt="pricetaglogo"
              className="w-[16px] h-[16px]"
            ></img>
            ค่าบริการประมาณ 500.00 - 1,000.00 ฿
          </div>
          <div className="my-3">
            <a className="text-[16px] font-semibold text-blue-600 underline">
              เลือกบริการ
            </a>
          </div>
        </div>
      </div>
      {/* end of service2 */}
      {/* start of service3 */}
      <div className="my-6 border h-[350px] mx-3 rounded-lg">
        <div className="h-[200px]">
          <img
            src="/image/service3.svg"
            alt="cleaningservice"
            className="w-full h-full rounded-t-md"
          ></img>
        </div>
        <div className="my-1 px-4 py-4">
          <div className="mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal bg-blue-100">
            บริการทั่วไป
          </div>
          <div className="text-[18px] font-medium text-gray-950">
            ทำความสะอาดทั่วไป
          </div>

          <div className="text-[14px] text-gray-700 flex gap-2 items-center">
            <img
              src="/image/pricetag.svg"
              alt="pricetaglogo"
              className="w-[16px] h-[16px]"
            ></img>
            ค่าบริการประมาณ 500.00 - 1,000.00 ฿
          </div>
          <div className="my-3">
            <a className="text-[16px] font-semibold text-blue-600 underline">
              เลือกบริการ
            </a>
          </div>
        </div>
      </div>
      {/* end of service3 */}
      <button>ดูบริการทั้งหมด</button>
    </div>
  );
}
