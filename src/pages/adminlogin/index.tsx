import React from "react";
import { Navbar } from "@/components/navbar";
import homeservicelogo from "../../../public/image/homeservicelogo.svg";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "@/context/authContext";

export default function Login() {
  // เก็บค่าข้อมูลที่กรอก
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // เก็บค่าข้อมูลที่กรอกเพื่อแสดง error ว่ากรอกข้อมูลไม่ถูกต้อง
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  // เก็บค่าข้อมูลที่กรอกเพื่อแสดง error ว่าไม่ได้กรอกข้อมูล
  const [emailEmpty, setEmailEmpty] = useState<boolean>(false);
  const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false);

  // ควบคุมการแสดง popup email or password invalidate
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // ตรวจสอบการเปลี่ยนแปลงใน input email
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(false);
    setEmailEmpty(false);
  };

  // ตรวจสอบการเปลี่ยนแปลงใน input password
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(false);
    setPasswordEmpty(false);
  };

  const router = useRouter();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ใช้เพื่อกันไม่ให้ request ข้อมูลหากยังไม่ผ่าน cordition
    let isValid = true;

    // ตรวจสอบ email ที่กรอก
    if (!email) {
      setEmailEmpty(true);
      isValid = false;
    } else if (!email.includes("@") || !email.includes(".com")) {
      setEmailError(true);
      isValid = false;
    }

    // ตรวจสอบ password ที่กรอก
    if (!password) {
      setPasswordEmpty(true);
      isValid = false;
    } else if (password.length <= 11) {
      setPasswordError(true);
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      adminLogin(email, password);
      // นำทางไปที่หน้าเพจที่เราต้องการ
      router.push("/admincategory");
    } catch (error) {
      // ไม่พบข้อมูล email || password ในฐานข้อมูล
      console.error("Invalid email or password");
      console.log(error);
      setShowPopup(true);
    }
  };
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        {/* div login form */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-[35%] mt-16">
            <Image
              src={homeservicelogo}
              alt="Homeservice Logo"
              className="w-full"
            />
          </div>
          <div className="my-10 rounded-lg border bg-white border-gray-300 max-w-[614px]  w-screen py-7 px-20">
            <form onSubmit={handleSubmit}>
              {/* head title */}
              <h1 className="mb-7 text-center text-2xl text-[#001C59] font-medium">
                เข้าสู่ระบบ
              </h1>
              {/* space gap */}
              <div className="flex flex-col gap-5">
                {/* email form */}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row">
                    <h1>Email</h1>
                    {emailEmpty && (
                      <p className="text-red-500 text-sm">{`*`}</p>
                    )}
                  </div>
                  <input
                    type="text"
                    id="email"
                    placeholder="กรุณากรอกอีเมล"
                    onChange={handleEmailChange}
                    className={`w-full border px-4 py-2 rounded-lg 
                      ${
                        emailEmpty
                          ? "border-red-500"
                          : emailError
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                  />
                  <div className="h-3">
                    {emailError && (
                      <p className="text-red-500 text-sm">
                        อีเมลต้องมี @ และ .com
                      </p>
                    )}
                  </div>
                </div>
                {/* password form */}
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row">
                    <h1>Password</h1>
                    {passwordEmpty && <p className="text-red-500 text-sm">*</p>}
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="กรุณากรอกรหัสผ่าน"
                    onChange={handlePasswordChange}
                    className={`w-full border px-4 py-2 rounded-lg
                      ${
                        passwordEmpty
                          ? "border-red-500"
                          : passwordError
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                  />
                  <div className="h-3">
                    {passwordError && (
                      <p className="text-red-500 text-sm">
                        พาสเวิร์ดต้องมีอย่างน้อย 12 ตัว
                      </p>
                    )}
                  </div>
                </div>
                {/* button for login */}
                <button className="bg-defaultColor hover:bg-hoverColor text-white rounded-lg px-4 py-2 font-medium active:bg-pressedColor">
                  เข้าสู่ระบบ
                </button>
              </div>
              {/* Popup */}
              {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm mx-auto">
                    <p className="mb-4 text-center text-gray-800">
                      อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
                    </p>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="bg-defaultColor hover:bg-hoverColor text-white rounded-lg px-4 py-2 font-medium w-full">
                      ปิด
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
