import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileSkeleton from "@/components/customer/profileSkeleton";
import { useRouter } from "next/router";

//FIXME address on user meta data / database table
interface UserInfo {
  userId: null | string;
  userName: null | string;
  userPhone: null | string;
  profileImage: null | string;
}
export default function CustomerProfile() {
  const { authState } = useAuth();

  const router = useRouter();
  const user = authState.user?.user_metadata;
  const userId = authState.userId;
  const email = authState.userEmail; // change to get user from supabase
  const fetchedUserName = user?.name;
  const fetchedPhoneNumber = user?.phone;
  const fetchUserAddress = user?.address;
  const fetchImage = null;

  //--------Form Input---------------------------------------------
  const [userName, setUserName] = useState<string>(fetchedUserName || "");
  const [phoneNumber, setPhoneNumber] = useState<string>(
    fetchedPhoneNumber || ""
  );
  const [userAddress, setUserAddress] = useState<string>(
    fetchUserAddress || ""
  );
  const [uploadImage, setUploadImage] = useState<Blob>();
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
      setUserName(fetchedUser.name);
      setPhoneNumber(fetchedUser.phone_number);
      setUserAddress(fetchedUser.address);
      setPreviewImage(fetchedUser.profile_picture_url);
      setIsLoading(false);
    } catch (err) {
      const error = err as Error;
      console.log("fetch user error.");
      console.log(error.message);
    }
  };
  //-----Image Preview-----------------------------------------------------------------
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Upload picture to webpage
    const inputImage = (e.target as HTMLInputElement).files?.[0];
    //สำหรับ display รูปก่อนอัพ
    if (inputImage) {
      const previewURL = URL.createObjectURL(inputImage);
      console.log("previewURL", previewURL);
      //set preview
      setPreviewImage(previewURL);
      //actual upload
      setUploadImage(inputImage);
    }
  };
  //------Stage change handle--------------------------------------------------------------------------------------------
  const handleInputName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const handleInputPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  const handleInputAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value);
  };
  const handleRedirect = () => {
    router.push(`/customerservice/${userId}`);
  };
  //------Form Submission-----------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //Send form data to edit profile api
    e.preventDefault();
    const fd = new FormData();
    fd.append("userName", userName);
    fd.append("phoneNumber", phoneNumber);
    fd.append("address", userAddress);
    if (uploadImage) {
      fd.append("image", uploadImage);
    }
    console.log("formData----------");
    console.log(Array.from(fd));
    for (const i of fd) {
      console.log(i);
    }
    try {
      const result = await axios.put(`/api/customer/editprofile/${userId}`, fd);
      console.log(result);
    } catch (e) {
      const error = e as Error;
      console.log("send request fail");
      console.log(error.message);
    }
    //----------WORK------------------

    // const formDataObject: { [key: string]: string | File } = {};
    // for (const [key, value] of formData.entries()) {
    //   formDataObject[key] = value;
    // }

    //await axios.put(`/api/someThing`, formData, { headers: { "Content-Type": "multipart/form-data" }, });
  };

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
              <h3 className="user-header font-semibold text-2xl">
                {userName} <span>| Edit Profile </span>
              </h3>
              <form
                action=""
                onSubmit={handleSubmit}
                className="form flex flex-col items-center justify-center gap-6">
                <div className="picture-box flex flex-col lg:flex-row justify-center items-center gap-4">
                  <div className="empty-box rounded-full w-32 h-32 bg-white">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="void-image rounded-full w-32 h-32 bg-slate-700"></div>
                    )}
                  </div>
                  <label
                    htmlFor="image-file"
                    className="detail-button text-blue-600 border border-blue-600 text-base font-medium py-2 px-6 w-56 h-10 rounded-lg bg-white cursor-pointer">
                    Upload profile picture
                  </label>
                  <input
                    type="file"
                    id="image-file"
                    name="image-file"
                    onChange={handleImagePreview}
                    className="hidden"
                  />
                </div>

                <div className="name-box flex flex-col justify-start">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="userName"
                    onChange={handleInputName}
                    value={userName}
                    className="name w-80 h-12 rounded-lg border p-3"
                  />
                </div>
                <div className="email-box flex flex-col justify-start">
                  <label htmlFor="email">Email</label>
                  <div className="email w-80 h-12 rounded-lg border p-3">
                    {email}
                  </div>
                </div>
                <div className="phone-box flex flex-col justify-start">
                  <label htmlFor="phone">Phone number</label>
                  <input
                    type="phone"
                    name="phoneNumber"
                    onChange={handleInputPhone}
                    value={phoneNumber}
                    className="phone w-80 h-12 rounded-lg border p-3"
                  />
                </div>
                <div className="address-box flex flex-col justify-start">
                  <label htmlFor="address">Address</label>
                  <input
                    type="address"
                    name="userAddress"
                    onChange={handleInputAddress}
                    value={userAddress}
                    className="address w-80 h-12 rounded-lg border p-3"
                  />
                </div>
                <div className="buttons-collection flex justify-center items-center gap-8">
                  <button
                    type="submit"
                    className="submit-button text-white text-base font-medium py-2 px-6 w-36 h-10 rounded-lg bg-blue-600 mb-7 ">
                    Save
                  </button>
                </div>
              </form>
              <button
                onClick={handleRedirect}
                className="back-button text-blue-600 border border-blue-600 text-base font-medium py-2 px-6 w-36 h-10 rounded-lg bg-white mb-7">
                Back
              </button>
            </div>
          )}
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
