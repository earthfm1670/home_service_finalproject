import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="h-[704px] bg-blue-100">
        <div className="h-[345px] w-full">
          <h1 className="w-full text-[40px] text-blue-700">
            เรื่องบ้าน...ให้เราช่วยดูแลคุณ
          </h1>
          <h2 className="w-full text-[20px] text-black">
            "สะดวก ราคาคุ้มค่า เชื่อถือได้"
          </h2>
          <p className="w-full text-[18px] text-gray-700">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์
          </p>
          <p className="w-full text-[18px] text-gray-700">ทำความสะอาดบ้าน</p>
          <p className="w-full text-[18px] text-gray-700">
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
          <button className="w-1/2 py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800">
            เช็คราคาบริการ
          </button>
        </div>
      </div>
    </>
  );
}
