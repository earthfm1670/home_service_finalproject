import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import OrderCard from "@/components/customer/orderCard";
export default function customerProfile() {
  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        รายการคำสั่งซ่อม
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:relative lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar />
        </div>
        <div className="small-banner flex lg:hidden justify-center items-center border rounded-lg mx-4 my-4 bg-blue-600 font-medium text-3xl text-white py-6">
          รายการคำสั่งซ่อม
        </div>
        <div className="content flex justify-center w-full lg:ml-72 min-h-96 mt-1">
          <OrderCard />
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
