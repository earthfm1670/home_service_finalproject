import { useRouter } from "next/router";
import React from "react";
import { useServices } from "./ServicesContext";

const categoryBgClassMap: Record<string, string> = {
  บริการทั่วไป: "text-blue-800 bg-blue-100",
  บริการห้องครัว: "text-purple-900 bg-purple-100",
  บริการห้องน้ำ: "text-green-900 bg-green-100",
};

export default function HomeService() {
  const router = useRouter();
  const { servicesData } = useServices();

  const redirectToServiceDetail = (service_id: number): void => {
    router.push(`/servicedetail/${service_id}`);
  };

  const redirectToServiceList = (): void => {
    router.push("/servicelist");
  };

  //limit to 3 services for homepage
  const displayedServices = servicesData.slice(0, 3);

  return (
    <div className="h-[1316px] lg:h-[790px]">
      <h2 className="py-8 lg:pt-20 lg:py-12 text-[20px] font-medium text-center text-blue-950 lg:text-[32px]">
        บริการยอดฮิตของเรา
      </h2>
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-center">
        {/* div for service box */}
        {displayedServices.map((service, index) => {
          const colorCategoryClass =
            categoryBgClassMap[service.category] || " ";

          return (
            <div
              key={index}
              className="border h-[350px] mx-4 rounded-lg lg:h-[365px] lg:w-[349px]"
              onClick={() => redirectToServiceDetail(service.service_id)}
            >
              <div className="h-[200px]">
                <img
                  src={service.service_picture_url}
                  alt={service.service_name}
                  className="w-full h-full rounded-t-md object-cover cursor-pointer"
                ></img>
              </div>
              <div className="my-1 px-4 py-4">
                <div
                  className={`mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal ${colorCategoryClass}`}
                >
                  {service.category}
                </div>
                <div className="text-[18px] lg:text-[20px] font-medium text-gray-950">
                  {service.service_name}
                </div>

                <div className="text-[14px] text-gray-700 flex gap-2 items-center font-normal">
                  {/* <Tag size={16} color="#7f7676" /> */}
                  <img
                    src="/image/pricetag.svg"
                    alt="pricetaglogo"
                    className="w-[16px] h-[16px]"
                  ></img>
                  {service.service_pricing}
                </div>
                <div
                  className="my-3"
                  onClick={() => redirectToServiceDetail(service.service_id)}
                >
                  <a className="text-[16px] font-semibold text-blue-600 underline cursor-pointer">
                    เลือกบริการ
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* <div
          className="border h-[350px] mx-4 rounded-lg lg:h-[365px] lg:w-[349px]"
          onClick={redirectToServiceDetail}
        >
          <div className="h-[200px]">
            <img
              src="/image/service1.svg"
              alt="cleaningservice"
              className="w-full h-full rounded-t-md object-cover"
            ></img>
          </div>
          <div className="my-1 px-4 py-4">
            <div className="mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal bg-blue-100">
              บริการทั่วไป
            </div>
            <div className="text-[18px] lg:text-[20px] font-medium text-gray-950">
              ทำความสะอาดทั่วไป
            </div>

            <div className="text-[14px] text-gray-700 flex gap-2 items-center font-normal">
              <img
                src="/image/pricetag.svg"
                alt="pricetaglogo"
                className="w-[16px] h-[16px]"
              ></img>
              ค่าบริการประมาณ 500.00 - 1,000.00 ฿
            </div>
            <div className="my-3" onClick={redirectToServiceDetail}>
              <a className="text-[16px] font-semibold text-blue-600 underline">
                เลือกบริการ
              </a>
            </div>
          </div>
        </div> */}
        {/* end of service box div */}

        {/* start of service2 */}
        {/* <div
          className="border h-[350px] mx-4 rounded-lg lg:h-[365px] lg:w-[349px]"
          onClick={redirectToServiceDetail}
        >
          <div className="h-[200px]">
            <img
              src="/image/service2.svg"
              alt="cleaningservice"
              className="w-full h-full rounded-t-md object-cover"
            ></img>
          </div>
          <div className="my-1 px-4 py-4">
            <div className="mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal bg-blue-100">
              บริการทั่วไป
            </div>
            <div className="text-[18px] lg:text-[20px] font-medium text-gray-950">
              ทำความสะอาดทั่วไป
            </div>

            <div className="text-[14px] text-gray-700 flex gap-2 items-center font-normal">
              <img
                src="/image/pricetag.svg"
                alt="pricetaglogo"
                className="w-[16px] h-[16px]"
              ></img>
              ค่าบริการประมาณ 500.00 - 1,000.00 ฿
            </div>
            <div className="my-3" onClick={redirectToServiceDetail}>
              <a className="text-[16px] font-semibold text-blue-600 underline">
                เลือกบริการ
              </a>
            </div>
          </div>
        </div> */}
        {/* end of service2 */}
        {/* start of service3 */}
        {/* <div
          className="border h-[350px] mx-4 rounded-lg lg:h-[365px] lg:w-[349px]"
          onClick={redirectToServiceDetail}
        >
          <div className="h-[200px]">
            <img
              src="/image/service3.svg"
              alt="cleaningservice"
              className="w-full h-full rounded-t-md object-cover"
            ></img>
          </div>
          <div className="my-1 px-4 py-4">
            <div className="mb-1 border w-[79px] h-[26px] text-[12px] flex justify-center items-center rounded-lg text-blue-800 font-normal bg-blue-100">
              บริการทั่วไป
            </div>
            <div className="text-[18px] lg:text-[20px] font-medium text-gray-950">
              ทำความสะอาดทั่วไป
            </div>

            <div className="text-[14px] text-gray-700 flex gap-2 items-center font-normal">
              <img
                src="/image/pricetag.svg"
                alt="pricetaglogo"
                className="w-[16px] h-[16px]"
              ></img>
              ค่าบริการประมาณ 500.00 ฿
            </div>
            <div className="my-3" onClick={redirectToServiceDetail}>
              <a className="text-[16px] font-semibold text-blue-600 underline">
                เลือกบริการ
              </a>
            </div>
          </div>
        </div> */}
      </div>
      {/* end of service3 */}
      <div className="flex justify-center">
        <button
          className="my-6 lg:my-16 w-[155px] h-[44px] bg-blue-600 rounded-lg text-[16px] font-medium text-white hover:bg-blue-500"
          onClick={redirectToServiceList}
        >
          ดูบริการทั้งหมด
        </button>
      </div>
    </div>
  );
}
