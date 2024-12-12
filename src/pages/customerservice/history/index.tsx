import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
export default function customerHistory() {
  return (
    <>
      <Navbar />
      <div className="banner flex flex-row justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        ประวัติการซ่อม
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:relative lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center w-fit lg:fixed lg:top-44">
          <UserSidebar />
        </div>
        <div
          className="content bg-green-400 h-[5000px] 
        flex justify-center w-full lg:ml-72"></div>
      </div>
      <HomeFooter />
    </>
  );
}
