import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="h-[704px] bg-blue-100">
        <div>
          <h1>เรื่องบ้าน...ให้เราช่วยดูแลคุณ</h1>
          <h2>"สะดวก ราคาคุ้มค่า เชื่อถือได้"</h2>
          <p>ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์</p>
          <p>ทำความสะอาดบ้าน</p>
          <p>โดยพนักงานแม่บ้าน และช่างมืออาชีพ</p>
          <button>เช็คราคาบริการ</button>
        </div>
      </div>
    </>
  );
}
