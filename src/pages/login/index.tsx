import React from "react";
import { Navbar } from "@/components/navbar";
import facebooklogo from "../../../public/image/facebooklogo.svg";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    // ตรวจสอบข้อมูลที่กรอก
    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่าน")
      return
    }
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        // ใช้เพื่อขอให้ server ส่งข้อมูล token เข้ามาหลังจาก login
        headers: { "Content-Type": "application/json","Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        // ใช้เพื่อหลังจากที่ขอ login success จะทำการส่ง token กลับมาไว้ใน storage 
        localStorage.setItem("token", data.access_token);
        // นำทางไปที่หน้าเพจที่เราต้องการ
        router.push("/");
      } else {
        const errorData = await response.text();
        alert(`Login ไม่สำเร็จ: ${errorData || "Unknow error"}`);
        return;
      }
    } catch (error: unknown) {
      console.error("Error:", error);

      // ตรวจสอบว่า error เป็น object และมี property 'message'
      if (error instanceof Error) {
        alert(`Something went wrong: ${error.message}`);
      } else {
        alert(`Something went wrong: ${JSON.stringify(error)}`);
      }
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        {/* div login form */}
        <div className="flex items-center justify-center">
          <div className="my-10 mx-2 rounded-lg border bg-white border-gray-300 max-w-[614px] w-[343px] lg:w-screen px-4 py-7">
            <form onSubmit={handleLogin}>
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
                    onChange={handleEmailChange}
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
                    onChange={handlePasswordChange}
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
                  <Image
                    src={facebooklogo}
                    alt="Facebook Logo"
                    width={24}
                    height={24}
                  />
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
