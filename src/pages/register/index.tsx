import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter } from "next/router";

function Registration() {
  const router = useRouter();

  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleTermsClose = (): void => {
    setIsTermsOpen(false);
  };

  const handlePrivacyClose = (): void => {
    setIsPrivacyOpen(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      agreementAccepted: checked,
    }));
    setIsChecked(checked);
  };

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    agreementAccepted: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    agreementAccepted: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    // Validate Name (only allow alphabetic characters, spaces, and dashes)
    if (!formData.name.match(/^[A-Za-z\s-]*$/)) {
      newErrors.name = "กรุณากรอกตัวอักษรภาษาอังกฤษ, เว้นวรรค หรือ - เท่านั้น";
    }

    // Validate Phone (must match a Thai phone number pattern)
    if (!formData.phoneNumber.match(/^0\d{9}$/)) {
      newErrors.phoneNumber =
        "กรุณากรอกเบอร์โทรศัพท์ที่เริ่มต้นด้วย 0 และมี 10 หลัก";
    }

    // Validate Email (basic email format)
    if (
      !formData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      newErrors.email = "กรุณากรอกอีเมลที่ถูกต้อง เช่น example@domain.com";
    }

    // Validate Password (must be at least 13 characters)
    if (formData.password.length < 13) {
      newErrors.password = "รหัสผ่านต้องมีมากกว่า 12 ตัวอักษร";
    }

    // Validate Terms (checkbox must be checked)
    // if (!formData.agreementAccepted) {
    //   newErrors.agreementAccepted = "กรุณายอมรับข้อตกลงและเงื่อนไข";
    // }

    setErrors(newErrors);

    // Return whether the form is valid (i.e., no errors)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Registration successful:", response.data);
        alert("ลงทะเบียนสำเร็จ!");
        router.push("/login");
      } catch (error: any) {
        console.error(
          "Registration failed:",
          error.response?.data || error.message
        );
        alert("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองอีกครั้ง");
      }
    } else {
      console.log("Form has errors");
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex justify-center">
          <div className="mx-4 my-10 border border-gray-300 justify-center rounded-lg bg-white lg:w-[614px] lg:mx-auto">
            <form onSubmit={handleSubmit}>
              <h2 className="text-[20px] text-center my-5">ลงทะเบียน</h2>
              <div className="flex flex-col mx-2 my-5 lg:w-3/4 lg:mx-auto">
                <label>
                  ชื่อ - นามสกุล<span className="text-[#C82438]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="กรุณากรอกชื่อ นามสกุล"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md h-10 pl-3"
                  // pattern="^[A-Za-z\s-]*$"
                  // title="กรุณากรอกตัวอักษรภาษาอังกฤษ, เว้นวรรค หรือ - เท่านั้น"
                ></input>
                {errors.name && (
                  <div className="text-[#C82438] text-sm mt-1">
                    {errors.name}
                  </div>
                )}
              </div>
              <div className="flex flex-col mx-2 my-5 lg:w-3/4 lg:mx-auto">
                <label>
                  เบอร์โทรศัพท์<span className="text-[#C82438]">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md h-10 pl-3"
                  // pattern="^0\d{9}$"
                  // title="กรุณากรอกเบอร์โทรศัพท์ที่เริ่มต้นด้วย 0 และมี 10 หลัก"
                ></input>
                {errors.phoneNumber && (
                  <div className="text-[#C82438] text-sm mt-1">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
              <div className="flex flex-col mx-2 my-5 lg:w-3/4 lg:mx-auto">
                <label>
                  อีเมล<span className="text-[#C82438]">*</span>
                </label>
                <input
                  // type="email"
                  id="email"
                  name="email"
                  placeholder="กรุณากรอกอีเมล"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md h-10 pl-3"
                  // pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  // title="กรุณากรอกอีเมลที่ถูกต้อง เช่น example@domain.com"
                ></input>
                {errors.email && (
                  <div className="text-[#C82438] text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="flex flex-col mx-2 my-5 lg:w-3/4 lg:mx-auto">
                <label>
                  รหัสผ่าน<span className="text-[#C82438]">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md h-10 pl-3"
                  // minLength={13}
                  // title="รหัสผ่านต้องมีมากกว่า 12 ตัวอักษร"
                ></input>
                {errors.password && (
                  <div className="text-[#C82438] text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>
              <div className="flex flex-row items-baseline mx-2 my-5 lg:w-3/4 lg:mx-auto">
                <input
                  type="checkbox"
                  id="agreementAccepted"
                  name="agreementAccepted"
                  required
                  checked={formData.agreementAccepted}
                  onChange={handleCheckboxChange}
                  className={`w-5 h-5 translate-y-1 ${
                    formData.agreementAccepted ? "opacity-100" : "opacity-40"
                  }`}
                />
                <label
                  htmlFor="agreementAccepted"
                  className="ml-4 text-[16px] text-gray-600 w-5/6"
                >
                  ยอมรับ{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-400 underline font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsOpen(true);
                    }}
                  >
                    ข้อตกลงและเงื่อนไข
                  </a>{" "}
                  และ{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-400 underline font-bold"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPrivacyOpen(true);
                    }}
                  >
                    นโยบายความเป็นส่วนตัว
                  </a>
                  .
                </label>
                {errors.agreementAccepted && (
                  <div className="text[#C82438] text-sm mt-1">
                    {errors.agreementAccepted}
                  </div>
                )}
              </div>
              <div className="mx-3 lg:w-3/4 lg:mx-auto">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800"
                >
                  ลงทะเบียน
                </button>
              </div>

              <div className="my-5 relative w-full flex items-center justify-center lg:w-3/4 lg:mx-auto">
                <div className="absolute inset-x-0 top-1/2 border-t border-gray-300"></div>
                <span className="relative bg-white px-4 text-gray-500">
                  หรือลงชื่อเข้าใช้ผ่าน
                </span>
              </div>
              <div className="mx-3 lg:w-3/4 lg:mx-auto">
                <button
                  type="submit"
                  className="w-full flex gap-4 justify-center py-3 px-6 text-blue-600 border border-blue-600 font-semibold rounded-md hover:bg-blue-500 focus:bg-blue-800"
                >
                  <img src="/image/facebooklogo.svg"></img>
                  เข้าสู่ระบบด้วย Facebook
                </button>
              </div>
              <div
                className="my-5 text-center"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <a className="text-blue-600 underline">กลับไปหน้าเข้าสู่ระบบ</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Popup dialog for terms and agreement */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ข้อตกลงและเงื่อนไข</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <h2 className="font-semibold text-xl">
              ข้อตกลงและเงื่อนไขการใช้งาน
            </h2>

            <p className="mt-4">
              ยินดีต้อนรับสู่เว็บไซต์ของเรา! ก่อนที่คุณจะใช้บริการเว็บไซต์นี้
              กรุณาอ่านข้อตกลงและเงื่อนไขนี้อย่างละเอียด
              ข้อตกลงนี้ควบคุมการใช้งานเว็บไซต์ และการบริการที่เกี่ยวข้องทั้งหมด
              หากคุณไม่เห็นด้วยกับข้อตกลงเหล่านี้
              กรุณาหลีกเลี่ยงการใช้เว็บไซต์ของเรา
            </p>

            <h3 className="mt-6 font-semibold">1. การใช้งานเว็บไซต์</h3>
            <p>
              เว็บไซต์นี้ให้บริการเพื่อให้ข้อมูล
              และเครื่องมือแก่ผู้ใช้ในการทำธุรกรรมต่าง ๆ ในบางกรณี
              คุณอาจต้องลงทะเบียนเพื่อใช้บริการบางอย่าง
              และคุณรับผิดชอบในการรักษาความปลอดภัยของบัญชีผู้ใช้ของคุณ
              รวมถึงรหัสผ่านที่ใช้ในการเข้าสู่ระบบ
            </p>

            <h3 className="mt-6 font-semibold">2. ข้อจำกัดความรับผิดชอบ</h3>
            <p>
              เว็บไซต์ของเราไม่สามารถรับประกันได้ว่าเว็บไซต์จะทำงานได้ตลอดเวลา
              หรือปราศจากข้อผิดพลาด
              เราไม่รับผิดชอบต่อความเสียหายหรือความสูญเสียใด ๆ
              ที่เกิดจากการใช้บริการเว็บไซต์นี้
            </p>

            <h3 className="mt-6 font-semibold">
              3. ข้อมูลส่วนบุคคลและความเป็นส่วนตัว
            </h3>
            <p>
              เราเคารพในความเป็นส่วนตัวของผู้ใช้งาน
              และจะจัดการกับข้อมูลส่วนบุคคลของคุณตามนโยบายความเป็นส่วนตัว
              โปรดตรวจสอบนโยบายความเป็นส่วนตัวของเราเพื่อเรียนรู้เกี่ยวกับวิธีการที่เรารวบรวม
              ใช้ และเก็บรักษาข้อมูลของคุณ
            </p>

            <h3 className="mt-6 font-semibold">
              4. ลิขสิทธิ์และทรัพย์สินทางปัญญา
            </h3>
            <p>
              เนื้อหาทั้งหมดบนเว็บไซต์ รวมถึงข้อความ รูปภาพ โลโก้ และกราฟิก
              เป็นทรัพย์สินทางปัญญาของเรา และได้รับการคุ้มครองโดยกฎหมายลิขสิทธิ์
              คุณไม่สามารถใช้เนื้อหาดังกล่าวเพื่อการค้า หรือกระทำการใด ๆ
              ที่ละเมิดลิขสิทธิ์โดยไม่ได้รับอนุญาต
            </p>

            <h3 className="mt-6 font-semibold">5. การเปลี่ยนแปลงข้อตกลง</h3>
            <p>
              เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงหรือปรับปรุงข้อตกลงนี้ได้ทุกเวลา
              โดยจะมีการประกาศการเปลี่ยนแปลงในหน้านี้
              ข้อตกลงที่แก้ไขแล้วจะมีผลบังคับใช้ทันทีที่เราโพสต์บนเว็บไซต์
            </p>

            <h3 className="mt-6 font-semibold">6. กฎหมายที่ใช้บังคับ</h3>
            <p>
              ข้อตกลงและเงื่อนไขนี้จะอยู่ภายใต้กฎหมายของประเทศไทย
              และคุณยินยอมให้ศาลที่มีเขตอำนาจในประเทศไทยเป็นศาลที่มีอำนาจในการพิจารณาคดีเกี่ยวกับข้อพิพาทที่เกิดขึ้นจากการใช้งานเว็บไซต์นี้
            </p>

            <h3 className="mt-6 font-semibold">7. การติดต่อ</h3>
            <p>
              หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับข้อตกลงนี้ กรุณาติดต่อเราได้ที่:
            </p>
            <p>Email: support@techup.com</p>
            <p>Phone: (+66)12-345-6789</p>
          </DialogDescription>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="py-2 px-4 bg-gray-200 rounded-md"
              onClick={handleTermsClose}
            >
              ปิด
            </button>
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded-md"
              onClick={handleTermsClose}
            >
              ยอมรับ
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup dialog for privacy policy */}
      <Dialog open={isPrivacyOpen} onOpenChange={setIsPrivacyOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ข้อตกลงและเงื่อนไข</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <h2 className="font-semibold text-xl">นโยบายความเป็นส่วนตัว</h2>

            <p className="mt-4">
              เราให้ความสำคัญกับการรักษาความเป็นส่วนตัวของผู้ใช้บริการของเรา
              โปรดอ่านนโยบายความเป็นส่วนตัวนี้อย่างละเอียดเพื่อทำความเข้าใจว่าเรา
              รวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณอย่างไร
            </p>

            <h3 className="mt-6 font-semibold">1. ข้อมูลที่เราเก็บรวบรวม</h3>
            <p>
              เมื่อคุณใช้บริการของเรา เราจะเก็บรวบรวมข้อมูลบางประเภทจากคุณ เช่น
              ชื่อ-นามสกุล, ที่อยู่, เบอร์โทรศัพท์, อีเมล, ข้อมูลการชำระเงิน
              และข้อมูลที่คุณให้มาเมื่อคุณลงทะเบียนใช้งาน
            </p>

            <h3 className="mt-6 font-semibold">2. วิธีการใช้ข้อมูล</h3>
            <p>
              เราใช้ข้อมูลที่เราเก็บรวบรวมเพื่อ:
              <ul className="list-inside list-disc">
                <li>ให้บริการแก่ผู้ใช้และปรับปรุงประสบการณ์การใช้งาน</li>
                <li>ส่งข้อมูลและการแจ้งเตือนที่เกี่ยวข้องกับการใช้งาน</li>
                <li>วิเคราะห์และปรับปรุงการให้บริการและผลิตภัณฑ์ของเรา</li>
                <li>รักษาความปลอดภัยในการใช้งานเว็บไซต์</li>
              </ul>
            </p>

            <h3 className="mt-6 font-semibold">
              3. การแชร์ข้อมูลกับบุคคลภายนอก
            </h3>
            <p>
              เราจะไม่ขายหรือเปิดเผยข้อมูลส่วนบุคคลของคุณให้กับบุคคลภายนอก
              ยกเว้นในกรณีที่จำเป็นเพื่อ:
              <ul className="list-inside list-disc">
                <li>ปฏิบัติตามกฎหมายหรือคำสั่งของหน่วยงานที่เกี่ยวข้อง</li>
                <li>ป้องกันหรือปกป้องสิทธิ์และทรัพย์สินของเรา</li>
                <li>
                  การให้บริการหรือการสนับสนุนทางเทคนิคจากบุคคลที่สามที่ได้รับอนุญาต
                </li>
              </ul>
            </p>

            <h3 className="mt-6 font-semibold">4. ความปลอดภัยของข้อมูล</h3>
            <p>
              เรามีมาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของคุณจากการเข้าถึงโดยไม่ได้รับอนุญาต
              การใช้งานที่ไม่เหมาะสม หรือการสูญหาย
              แต่เราไม่สามารถรับประกันความปลอดภัยทั้งหมดในกรณีที่เกิดภัยคุกคามที่ไม่สามารถคาดเดาได้
            </p>

            <h3 className="mt-6 font-semibold">5. ข้อความเกี่ยวกับคุกกี้</h3>
            <p>
              เว็บไซต์ของเรามีการใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณเมื่อเยี่ยมชมเว็บไซต์
              คุกกี้ช่วยให้เราสามารถบันทึกข้อมูลที่เกี่ยวข้องกับการใช้งานของคุณ
              และปรับแต่งการใช้งานให้เหมาะสม
              หากคุณไม่ต้องการให้มีการใช้งานคุกกี้
              คุณสามารถตั้งค่าในเบราว์เซอร์ของคุณเพื่อปิดการใช้งานคุกกี้ได้
            </p>

            <h3 className="mt-6 font-semibold">6. การเข้าถึงและแก้ไขข้อมูล</h3>
            <p>
              คุณมีสิทธิ์ในการเข้าถึงข้อมูลส่วนบุคคลของคุณที่เราเก็บรวบรวม
              รวมถึงสิทธิ์ในการขอให้แก้ไขหรืออัปเดตข้อมูลหากมีข้อผิดพลาด
              คุณสามารถติดต่อเราผ่านทางอีเมลหรือโทรศัพท์ที่ให้ไว้ด้านล่าง
            </p>

            <h3 className="mt-6 font-semibold">
              7. การเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
            </h3>
            <p>
              เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้ได้ตลอดเวลา
              การเปลี่ยนแปลงจะมีผลทันทีที่โพสต์บนเว็บไซต์ของเรา
              คุณควรตรวจสอบนโยบายนี้เป็นระยะเพื่อรับทราบข้อมูลล่าสุด
            </p>

            <h3 className="mt-6 font-semibold">8. การติดต่อ</h3>
            <p>
              หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้
              คุณสามารถติดต่อเราได้ที่:
            </p>
            <p>Email: support@techup.com</p>
            <p>Phone: (+66)12-345-6789</p>
          </DialogDescription>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              className="py-2 px-4 bg-gray-200 rounded-md"
              onClick={handlePrivacyClose}
            >
              ปิด
            </button>
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded-md"
              onClick={handlePrivacyClose}
            >
              ยอมรับ
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Registration;
