import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="h-[704px] bg-blue-100 relative">
        <div className="h-[345px] mx-4 py-12">
          <h1 className="w-full text-[40px] text-blue-700 font-semibold leading-tight">
            เรื่องบ้าน...ให้เราช่วยดูแลคุณ
          </h1>
          <h2 className="w-full my-6 text-[20px] text-black font-medium">
            "สะดวก ราคาคุ้มค่า เชื่อถือได้"
          </h2>
          <p className="mt-8 w-full text-[18px] text-gray-700 font-medium">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์
          </p>
          <p className="w-full text-[18px] text-gray-700 font-medium">
            ทำความสะอาดบ้าน
          </p>
          <p className="w-full text-[18px] text-gray-700 font-medium">
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
          <button className="mt-8 w-1/2 min-w-[191px] py-3 px-6 bg-blue-600 text-white text-[20px] font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800">
            เช็คราคาบริการ
          </button>

          <div className="absolute bottom-0 right-0">
            <img src="image/worker.svg" alt="worker"></img>
          </div>
        </div>
      </div>
    </>
  );
}
