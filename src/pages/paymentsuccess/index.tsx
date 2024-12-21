import { Navbar } from "@/components/navbar";

function PaymentSuccess() {
  return (
    <>
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <div className="lg:flex lg:justify-center">
          <div className="h-[475px] lg:h-[600px] lg:w-[542px] border border-gray-300 mx-4 my-8 bg-white rounded-md">
            {/* top div */}
            <div className="h-[118px] mx-4 flex flex-col justify-center items-center mt-8 lg:my-12 gap-4 lg:gap-6">
              <div className="">
                <img
                  src="/image/paymentsuccess.svg"
                  alt="checkmarkicon"
                  className="w-[64px] h-[64px]"
                ></img>
              </div>
              <p className="text-blue-950 font-medium text-[20px] lg:text-[32px]">
                ชำระเงินเรียบร้อย !
              </p>
            </div>
            {/* bottom div */}
            <div className="h-[201px] mx-4 my-6">
              <div className="flex justify-between lg:my-6">
                <p className="font-normal text-[14px] text-black">
                  9,000 - 18,000 BTU, แบบติดผนัง
                </p>
                <p className="font-normal text-[14px] text-gray-700">
                  2 รายการ
                </p>
              </div>
              {/* divider */}
              <div className="border-t border-gray-300 my-3 lg:my-6"></div>
              <div>
                <div className="flex justify-between my-2 lg:my-4">
                  <p className="text-[14px] text-gray-700 font-light">วันที่</p>
                  <p className="text-[14px] text-black font-normal">
                    23 เม.ย. 2022
                  </p>
                </div>
                <div className="flex justify-between my-2 lg:my-4">
                  <p className="text-[14px] text-gray-700 font-light">เวลา</p>
                  <p className="text-[14px] text-black font-normal">11.00 น.</p>
                </div>
                <div className="flex justify-between my-2 lg:my-4">
                  <p className="text-[14px] text-gray-700 font-light">
                    สถานที่
                  </p>
                  <p className="text-[14px] text-black font-normal text-right">
                    444/4 คอนโดสุภาลัย เสนานิคม <br />
                    จตุจักร กรุงเทพฯ
                  </p>
                </div>
                {/* divider */}
                <div className="border-t border-gray-300 my-3 lg:my-6"></div>
                <div className="flex justify-between">
                  <p className="text-[16px] text-gray-700 font-light">รวม</p>
                  <p className="text-[16px] text-black font-medium lg:font-semibold">
                    1,550.00 ฿
                  </p>
                </div>
              </div>
              <div>
                <button className="w-full h-[44px] my-8 bg-blue-600 text-white rounded-lg">
                  เช็ครายการซ่อม
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
