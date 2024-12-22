import { Navbar } from "@/components/navbar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function PaymentSuccess() {
  const router = useRouter();
  const {
    selectedServices,
    date,
    time,
    address,
    district,
    subDistrict,
    province,
    totalAmountAfterDiscount,
  } = router.query;
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (selectedServices) {
      try {
        const parsedServices = JSON.parse(selectedServices as string);
        console.log("Parsed Services:", parsedServices.selections);
        setServices(parsedServices.selections || []);
      } catch (error) {
        console.error("Failed to parse selected services:", error);
      }
    }
  }, [selectedServices]);

  console.log("Services State:", services);

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("th-TH", options).format(dateObj);
  };

  const formattedDate = date ? formatDate(date as string) : "Not available";
  const formattedTime = time || "Not available";
  const formattedAddress = `${
    address || "Not available"
  }, ${subDistrict}, ${district}, ${province}`;

  return (
    <>
      <div className="min-h-screen bg-[#F3F4F6]">
        <Navbar />
        <div className="lg:flex lg:justify-center">
          <div className=" lg:h-[600px] lg:w-[542px] border border-gray-300 mx-4 my-8 bg-white rounded-md">
            {/* top div */}
            <div className="h-[118px] mx-4 flex flex-col justify-center items-center mt-8 lg:my-12 gap-4 lg:gap-6">
              <div>
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
            <div className="flex-grow mx-4 my-6">
              {services.length > 0 ? (
                <div className="flex justify-between lg:my-6 border-b border-gray-300 pb-2 mb-2">
                  <p className="font-normal text-[14px] text-black">
                    {services.map((service) => service.description).join(", ")}
                  </p>
                  <p className="font-normal text-[14px] text-gray-700 flex-shrink-0 text-right">
                    {services.reduce(
                      (total, service) => total + service.quantity,
                      0
                    )}{" "}
                    รายการ
                  </p>
                </div>
              ) : (
                <p>No services selected.</p>
              )}
              {/* <div className="flex justify-between lg:my-6">
                <p className="font-normal text-[14px] text-black">servicename</p>
                <p className="font-normal text-[14px] text-gray-700">
                  2 รายการ
                </p>
              </div> */}
              {/* divider */}
              {/* <div className="border-t border-gray-300 my-3 lg:my-6"></div> */}
              <div>
                <div className="flex justify-between my-2 lg:my-4">
                  <p className="text-[14px] text-gray-700 font-light">วันที่</p>
                  <p className="text-[14px] text-black font-normal">
                    {formattedDate || "Not available"}
                  </p>
                </div>
                <div className="flex justify-between my-2 lg:my-4">
                  <p className="text-[14px] text-gray-700 font-light">เวลา</p>
                  <p className="text-[14px] text-black font-normal">
                    {formattedTime + " น." || "Not available"}
                  </p>
                </div>
                <div className="flex justify-between my-2 lg:my-4">
                  <p className="text-[14px] text-gray-700 font-light flex-shrink-0">
                    สถานที่
                  </p>
                  <p className="text-[14px] text-black font-normal text-right">
                    {formattedAddress || "Not available"}
                  </p>
                </div>
                {/* divider */}
                <div className="border-t border-gray-300 my-3 lg:my-6"></div>
                <div className="flex justify-between">
                  <p className="text-[16px] text-gray-700 font-light">รวม</p>
                  <p className="text-[16px] text-black font-medium lg:font-semibold">
                    {totalAmountAfterDiscount + " ฿" || "0.00 ฿"}
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
