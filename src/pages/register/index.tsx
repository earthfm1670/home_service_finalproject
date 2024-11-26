import React from "react";
import { Navbar } from "@/components/navbar";

function Registration() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div>
          <div className="mx-2 my-5 border border-gray-300 rounded-lg bg-white">
            <form>
              <h2 className="text-[20px] text-center my-5">ลงทะเบียน</h2>
              <div className="flex flex-col mx-2 my-5">
                <label>ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="กรุณากรอกชื่อ นามสกุล"
                  required
                  className="border border-gray-300 rounded-md h-10"
                ></input>
              </div>
              <div className="flex flex-col mx-2 my-5">
                <label>เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                  required
                  className="border border-gray-300 rounded-md h-10"
                ></input>
              </div>
              <div className="flex flex-col mx-2 my-5">
                <label>อีเมล</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="กรุณากรอกอีเมล"
                  required
                  className="border border-gray-300 rounded-md h-10"
                ></input>
              </div>
              <div className="flex flex-col mx-2 my-5">
                <label>รหัสผ่าน</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  required
                  className="border border-gray-300 rounded-md h-10"
                ></input>
              </div>
              <div className="flex flex-row items-baseline mx-2 my-5">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="scale-125"
                />
                <label
                  htmlFor="terms"
                  className="ml-5 text-sm text-gray-600 w-4/5"
                >
                  ยอมรับ{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-400">
                    ข้อตกลงและเงื่อนไข
                  </a>{" "}
                  และ{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-400">
                    นโยบายความเป็นส่วนตัว
                  </a>
                  .
                </label>
              </div>
              <div className="mx-3">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800"
                >
                  ลงทะเบียน
                </button>
              </div>
              <div className="relative w-full flex items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 border-t border-gray-300"></div>
                <span className="relative bg-white px-4 text-gray-500">
                  หรือลงชื่อเข้าใช้ผ่าน
                </span>
              </div>
              <div className="mx-3">
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-blue-600 border border-blue-600 font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800"
                >
                  เข้าสู่ระบบด้วย Facebook
                </button>
              </div>
              <div>
                <a className="text-blue-600 underline">กลับไปหน้าเข้าสู่ระบบ</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
