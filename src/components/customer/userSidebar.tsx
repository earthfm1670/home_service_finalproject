//TODO ลบสี
//TODO เพิ่ม icon
//TODO แก้ margin header
export default function UserSidebar() {
  return (
    <>
      <div className="sidebar-body bg-white flex flex-col justify-start items-start pl-4 pr-9 w-11/12 lg:w-64 lg:h-64 border rounded-lg">
        <div className="header-box border-b w-full mx-4">
          <h3 className="sidebar-heade font-normal text-xl text-gray-700 p-6">
            บัญชีผู้ใช้
          </h3>
        </div>
        <div className="sidebar-buttons mx-6 my-4 flex flex-row justify-between lg:flex-col">
          <button className="bg-red-200 font-normal text-base text-gray-950 py-3 w-32 lg:w-44  text-start">
            ข้อมูลผู้ใช้งาน
          </button>
          <button className="bg-yellow-200 font-normal text-base text-gray-950 py-3 w-32 lg:w-44  text-start">
            รายการคำสั่งซ่อม
          </button>
          <button className="bg-green-200 font-normal text-base text-gray-950 py-3 w-32 lg:w-44  text-start">
            ประวัติการซ่อม
          </button>
        </div>
      </div>
    </>
  );
}
