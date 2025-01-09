import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSkeleton from "@/components/customer/profileSkeleton";
import { useRouter } from "next/router";

export default function CustomerProfile() {
  const { authState } = useAuth();

  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string>();

  // change to get user from supabase
  const user = authState.user?.user_metadata;
  const userId = authState.userId;
  const email = authState.userEmail;
  const fetchedUserName = user?.name;
  const fetchedPhoneNumber = user?.phone;
  const fetchUserAddress = user?.address;

  //--------State---------------------------------------------
  const [userName, setUserName] = useState<string>(fetchedUserName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    fetchedPhoneNumber || ""
  );
  const [userAddress, setUserAddress] = useState<string>(
    fetchUserAddress || ""
  );

  //-----Loading state--------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  //--------Get media---------------------------------------------

  const handleRedirect = () => {
    router.push(`/customerservice/${userId}/editprofile`);
  };
  //-------Get User-----------------------------------------
  const fetchUser = async () => {
    try {
      const respond = await axios.post("api/auth/getUser", {
        email,
      });
      const fetchedUser = respond.data.userInfo;
      setUserName(fetchedUser.name);
      setPhoneNumber(fetchedUser.phone_number);
      setUserAddress(fetchedUser.address);
      setProfileImage(fetchedUser.profile_picture_url);
      setIsLoading(false);
      console.log("test profile picture:", fetchedUser.profile_picture_url);
    } catch (err) {
      const error = err as Error;
      console.log("fetch user error.");
      console.log(error.message);
    }
  };
  //-------Use Effect--------------------------------------
  useEffect(() => {
    if (email) {
      fetchUser();
    }
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
              <h3 className="user-header font-semibold text-2xl mt-7">
                {userName} <span>| Profile </span>
              </h3>
              <div className="form flex flex-col items-center justify-center gap-6">
                <div className="picture-box flex flex-col lg:flex-row justify-center items-center gap-4">
                  <div className="empty-box rounded-full w-32 h-32 bg-white">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="void-image rounded-full w-32 h-32 bg-slate-700"></div>
                    )}
                  </div>
                </div>
                <div className="name-box flex flex-col justify-start">
                  <label htmlFor="name">Name</label>
                  <div className="name w-80 h-12 rounded-lg border p-3 bg-gray-300">
                    {userName}
                  </div>
                </div>
                <div className="email-box flex flex-col justify-start">
                  <label htmlFor="email">Email</label>
                  <div className="email w-80 h-12 rounded-lg border p-3 bg-gray-300">
                    {email}
                  </div>
                </div>
                <div className="phone-box flex flex-col justify-start">
                  <label htmlFor="phone">Phone number</label>
                  <div className="phone w-80 h-12 rounded-lg border p-3 bg-gray-300">
                    {phoneNumber}
                  </div>
                </div>
                <div className="address-box flex flex-col justify-start">
                  <label htmlFor="address">Address</label>
                  <div className="address w-80 min-h-12 rounded-lg border p-3 bg-gray-300">
                    {userAddress}
                  </div>
                </div>
                <button
                  onClick={handleRedirect}
                  className="submit-button text-white text-base font-medium py-2 px-6 w-56 h-10 rounded-lg bg-blue-600 mb-7 ">
                  Edit profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
