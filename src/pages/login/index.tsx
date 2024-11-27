import React from "react";
import { Navbar } from "@/components/navbar";
import facebooklogo from "../../../public/image/facebooklogo.svg";

export default function Login() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        {/* div login form */}
        <div className="flex items-center justify-center">
          <div className="my-10 rounded-lg border bg-white border-gray-300 max-w-[614px] w-[343px] lg:w-screen px-4 py-7">
            <form>
              {/* head title */}
              <h1 className="mb-7 text-center text-2xl text-[#001C59] font-medium">
                เข้าสู่ระบบ
              </h1>
              {/* space gap */}
              <div className="flex flex-col gap-5">
                {/* email form */}
                <div className="flex flex-col gap-1">
                  <h1>อีเมล</h1>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="กรุณากรอกอีเมล"
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </div>
                {/* password form */}
                <div className="flex flex-col gap-1">
                  <h1>รหัสผ่าน</h1>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="กรุณากรอกรหัสผ่าน"
                    required
                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  />
                </div>
                {/* button for login */}
                <button className="bg-defaultColor hover:bg-hoverColor text-white rounded-lg px-4 py-2 font-medium active:bg-pressedColor">
                  เข้าสู่ระบบ
                </button>
                {/* div text for warning */}
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 h-[1.25px] bg-gray-300"></div>
                  <span className=" text-gray-500 text-sm">ข้อความของคุณ</span>
                  <div className="flex-1 h-[1.25px] bg-gray-300"></div>
                </div>
                {/* button for login with facebook */}
                <button className="border border-defaultColor hover:bg-hoverColor text-defaultColor rounded-lg px-4 py-2 font-medium hover:text-white active:bg-pressedColor flex items-center justify-center gap-3">
                  <img src="/image/facebooklogo.svg" className="w-6"></img>
                  เข้าสู่ระบบด้วย Facebook
                </button>
                <h1 className="text-center text-gray-500">
                  ยังไม่มีบัญชีผู้ใช้ HomeService?{" "}
                  <a
                    href="#"
                    className="text-defaultColor font-medium underline hover:text-hoverColor"
                  >
                    ลงทะเบียน
                  </a>
                </h1>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
