import { useRouter } from "next/router";
import React from "react";

export default function HomeHero() {
  const router = useRouter();

  const redirectToServiceList = (): void => {
    router.push("/servicelist");
  };
  return (
    <>
      <div className="h-[704px] bg-blue-100 relative lg:h-[540px]">
        <div className="h-[345px] mx-4 py-12 lg:mx-32 lg:py-20">
          <h1 className="w-full text-[40px] text-blue-700 font-semibold leading-tight lg:text-[64px] lg:font-bold">
            เรื่องบ้าน...ให้เราช่วยดูแลคุณ
          </h1>
          <h2 className="w-full my-4 text-[20px] text-black font-medium lg:text-[42px] lg:mb-12">
            "สะดวก ราคาคุ้มค่า เชื่อถือได้"
          </h2>
          <p className="mt-8 w-full text-[18px] text-gray-700 font-medium lg:hidden">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์
          </p>
          <p className="w-full text-[18px] text-gray-700 font-medium lg:hidden">
            ทำความสะอาดบ้าน
          </p>
          <p className="w-full text-[18px] text-gray-700 font-medium hidden lg:block lg:text-[24px]">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน
          </p>
          <p className="w-full text-[18px] text-gray-700 font-medium lg:text-[24px]">
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
          <button
            className="mt-8 w-[191px] py-3 px-6 bg-blue-600 text-white text-[20px] font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800"
            onClick={redirectToServiceList}
          >
            เช็คราคาบริการ
          </button>

          <div className="absolute bottom-0 right-0">
            <img
              src="image/worker.svg"
              alt="worker"
              className="xl:w-full xl:h-[500px] xl:pr-48"
            ></img>
          </div>
        </div>
      </div>
    </>
  );
}
