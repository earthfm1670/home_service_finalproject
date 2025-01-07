import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSkeleton from "@/components/customer/profileSkeleton";
import { useRouter } from "next/router";

//FIXME address on user meta data / database table
//FIXME handle on change on input
//FIXME handle image upload
//FIXME handle previwe image
//FIXME check onSubmit and onClick
interface UserInfo {
  userId: null | string;
  userName: null | string;
  userPhone: null | string;
  userAddress: null | string;
}
export default function CustomerProfile() {
  const { authState } = useAuth();

  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: null,
    userName: null,
    userPhone: null,
    userAddress: null,
  });
  const user = authState.user?.user_metadata;
  const userId = authState.userId;
  const email = authState.userEmail; // change to get user from supabase
  const fetchImage = null;

  //--------Form Input---------------------------------------------
  const [profileImage, setProfileImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>(
    fetchImage || "/image/footerhouse.svg"
  );
  //-----Loading state--------------------------------------------------------------
  const [isLoading, setIsLoading] = useState(true);
  //-----Fetch user------------------------------------------------------------
  const fetchUser = async () => {
    console.log("check authState");
    console.log(authState);
    console.log("check email");
    console.log(email);
    try {
      const respond = await axios.post("api/auth/getUser", {
        email,
      });
      const fetchedUser = respond.data.userInfo;
      setUserInfo({
        userId: fetchedUser.user_id,
        userName: fetchedUser.name,
        userPhone: fetchedUser.phone_number,
        userAddress: fetchedUser.address,
      });
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      console.log("fetch user error.");
      console.log(error);
    }
  };
  //-----Image Preview-----------------------------------------------------------------
  // const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   //Upload picture to webpage
  //   const file = e.target.files?.[0];
  //   //สำหรับ display รูปก่อนอัพ
  //   if (file) {
  //     const previewURL = URL.createObjectURL(file);
  //     console.log("previewURL", previewURL);
  //     setPreviewImage(previewURL);
  //     setProfileImage(file);
  //   }
  // };
  const handleRedirect = () => {
    router.push(`/customerservice/${userId}/editprofile`);
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
              <div className="form flex flex-col items-center justify-center gap-6">
                <div className="picture-box flex flex-col lg:flex-row justify-center items-center gap-4">
                  <div className="empty-box rounded-full w-32 h-32 bg-white">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="void-image rounded-full w-32 h-32 bg-slate-700"></div>
                    )}
                  </div>
                </div>
                <div className="name-box flex flex-col justify-start">
                  <label htmlFor="name">Name</label>
                  <div className="name w-80 h-12 rounded-lg border p-3 bg-gray-300">
                    {userInfo.userName}
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
                    {userInfo.userPhone}
                  </div>
                </div>
                <div className="address-box flex flex-col justify-start">
                  <label htmlFor="address">Address</label>
                  <div className="address w-80 h-12 rounded-lg border p-3 bg-gray-300">
                    {userInfo.userAddress}
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
