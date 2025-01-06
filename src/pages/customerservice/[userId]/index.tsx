import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import profileSkeleton from "@/components/customer/profileSkeleton";
import TestProfile from "@/components/customer/testProfile";
import ProfileSkeleton from "@/components/customer/profileSkeleton";

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
  const userRole = user?.role;
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

  const handleFileUpload = () => {
    //Upload picture to webpage
  };

  const handleEditProfile = () => {
    //Send form data to edit profile api
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
        <div className="content flex flex-col items-center w-full lg:ml-72 py-8">
          {isLoading ? (
            ProfileSkeleton()
          ) : (
            <div className="profile-body rounded-lg bg-white h-11/12 w-11/12 flex flex-col justify-center items-center gap-6">
              <h3 className="user-header font-semibold text-2xl">
                {userInfo.userName} <span>| Profile </span>
              </h3>
              <form
                action=""
                className="form flex flex-col items-center justify-center gap-6">
                <div className="picture-box flex flex-col lg:flex-row justify-center items-center gap-4">
                  <div className="empty-box rounded-full w-32 h-32 bg-slate-700"></div>
                  <button className="detail-button text-blue-600 border border-blue-600 text-base font-medium py-2 px-6 w-56 h-10 rounded-lg bg-white">
                    Upload profile picture
                  </button>
                </div>
                <div className="name-box flex flex-col justify-start">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    value={userInfo.userName}
                    className="name w-80 h-12 rounded-lg border p-3"
                  />
                </div>
                <div className="email-box flex flex-col justify-start">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={email}
                    className="email w-80 h-12 rounded-lg border p-3 disabled:"
                  />
                </div>
                <div className="phone-box flex flex-col justify-start">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    type="phone"
                    value={userInfo.userPhone}
                    className="phone w-80 h-12 rounded-lg border p-3"
                  />
                </div>
                <div className="address-box flex flex-col justify-start">
                  <label htmlFor="address">Address</label>
                  <input
                    type="address"
                    className="address w-80 h-12 rounded-lg border p-3"
                  />
                </div>
                <button
                  type="submit"
                  className="submit-button text-white text-base font-medium py-2 px-6 w-56 h-10 rounded-lg bg-blue-600 mb-7 ">
                  Save
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
