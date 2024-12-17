import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import { useAuth } from "@/context/authContext";
export default function CustomerProfile() {
  // const { authState } = useAuth();
  // const user = authState.user?.user_metadata;
  // if (!user) {
  //   console.log("No User");
  //   console.log(authState);
  //   console.log(authState.user?.user_metadata);
  //   console.log(user);
  // }
  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        ข้อมูลผู้ใช้งาน
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:relative lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar />
        </div>
        <div className="small-banner flex lg:hidden justify-center items-center border rounded-lg mx-4 my-4 bg-blue-600 font-medium text-3xl text-white py-6">
          ข้อมูลผู้ใช้งาน
        </div>
        <div className="content bg-gray-300 h-96 flex flex-col justify-start w-full lg:ml-72">
          {/* <li>User ID : </li>
          <li>User Name : {user.name} </li>
          <li>User Email : {user.email} </li>
          <li>User Phone : {user.phone}</li>
          <li>User Role : {user.role} </li> */}
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
