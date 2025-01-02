import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import profileSkeleton from "@/components/customer/profileSkeleton";
import axios from "axios";

interface UserInfo {
  userId: null | string;
  userName: null | string;
  userPhone: null | string;
}
export default function CustomerProfile() {
  const { authState } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const user = authState.user?.user_metadata;
  const userId = authState.userId;
  const email = authState.userEmail; // change to get user from supabase
  //-------------------------------------------------------------------
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: null,
    userName: null,
    userPhone: null,
  });
  const fetchUser = async () => {
    try {
      const respond = await axios.post("api/auth/getUser", {
        email,
      });
      console.log(respond);
      const userInfo = respond.data.userInfo;
      setUserInfo({
        userId: userInfo.user_id,
        userName: userInfo.name,
        userPhone: userInfo.phone_number,
      });
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      console.log("fetch user error.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [email]);

  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        ข้อมูลผู้ใช้งาน
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:relative lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar userId={userId} />
        </div>
        <div className="small-banner flex lg:hidden justify-center items-center border rounded-lg mx-4 my-4 bg-blue-600 font-medium text-3xl text-white py-6">
          ข้อมูลผู้ใช้งาน
        </div>
        {isLoading ? (
          profileSkeleton()
        ) : (
          <div className="content bg-gray-300 h-96 flex flex-col justify-start w-full lg:ml-72">
            <li>User ID : {userInfo.userId || ""} </li>
            <li>User Name : {userInfo.userName || ""} </li>
            <li>User Email : {email || ""} </li>
            <li>User Phone : {userInfo.userPhone || ""}</li>
            <li>User Role : {user?.role || ""} </li>
          </div>
        )}
      </div>
      <HomeFooter />
    </>
  );
}
