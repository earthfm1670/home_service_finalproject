import { Navbar } from "@/components/navbar";

function PaymentSuccess() {
  return (
    <>
      <Navbar />
      <div className="h-[475px] border border-black mx-4 my-8">
        {/* top div */}
        <div className="border border-black h-[118px] mx-4 flex flex-col justify-center items-center mt-8 gap-4">
          <div className="">
            <img
              src="/image/paymentsuccess.svg"
              alt="checkmarkicon"
              className="w-[64px] h-[64px]"
            ></img>
          </div>
          <p className="text-blue-950 font-medium text-[20px]">
            ชำระเงินเรียบร้อย !
          </p>
        </div>
        {/* bottom div */}
        <div className="border border-black h-[201px] mx-4 my-6">
          <div className="flex justify-between">
            <p className="font-normal text-[14px] text-black">
              9,000 - 18,000 BTU, แบบติดผนัง
            </p>
            <p className="font-normal text-[14px] text-gray-700">2 รายการ</p>
          </div>
          {/* divider */}
          <div className="border-t border-gray-300 my-3"></div>
          <div>
            <div className="flex justify-between my-2">
              <p className="text-[14px] text-gray-700 font-normal">วันที่</p>
              <p className="text-[14px] text-black font-normal">
                23 เม.ย. 2022
              </p>
            </div>
            <div className="flex justify-between my-2">
              <p className="text-[14px] text-gray-700 font-normal">เวลา</p>
              <p className="text-[14px] text-black font-normal">11.00 น.</p>
            </div>
            <div className="flex justify-between my-2">
              <p className="text-[14px] text-gray-700 font-normal">สถานที่</p>
              <p className="text-[14px] text-black font-normal text-right">
                444/4 คอนโดสุภาลัย เสนานิคม <br />
                จตุจักร กรุงเทพฯ
              </p>
            </div>
            {/* divider */}
            <div className="border-t border-gray-300 my-3"></div>
            <div className="flex justify-between">
              <p className="text-[16px] text-gray-700 font-normal">รวม</p>
              <p className="text-[16px] text-black font-medium">1,550.00 ฿</p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
