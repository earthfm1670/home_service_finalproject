import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function HomeFooter() {
  const router = useRouter();
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  const handleTermsClose = (): void => {
    setIsTermsOpen(false);
  };

  const handlePrivacyClose = (): void => {
    setIsPrivacyOpen(false);
  };

  const redirectToHome = (): void => {
    router.push("/");
  };

  return (
    <>
      {/* Footer Container */}
      <footer>
        {/* top footer section */}
        <div className="w-full h-[273px] lg:px-36 lg:py-4 lg:h-[151px] lg:flex lg:flex-row lg:items-start">
          <div
            className="flex items-center m-4 my-6 lg:my-6"
            onClick={redirectToHome}
          >
            <div className="flex gap-2 cursor-pointer">
              <img
                src="/image/footerhouse.svg"
                className="w-[39px] h-[39px]"
              ></img>
              <div className="text-[29px] text-blue-600 font-medium">
                HomeServices
              </div>
            </div>
          </div>
          <div className="my-6 lg:mx-14">
            <h2 className="text-[18px] font-medium text-gray-950 mx-4 my-2">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h2>
            <p className="text-[14px] font-normal text-gray-800 mx-4 lg:hidden">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา
            </p>
            <p className="text-[14px] font-normal text-gray-800 mx-4 lg:hidden">
              กรุงเทพมหานคร 10260
            </p>
            <p className="text-[14px] font-normal text-gray-800 mx-4 hidden lg:block">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="lg:my-6">
            <div className="flex items-center lg:pt-2">
              <div className="w-[20px] h-[20px] mr-2 mx-4 my-2">
                <img
                  src="/image/phoneicon.svg"
                  alt="phoneicon"
                  className="w-full h-full"
                ></img>
              </div>
              <div className="text-[16px] font-normal text-gray-800">
                080-540-6357
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-[20px] h-[20px] mr-2 mx-4">
                <img
                  src="/image/mailicon.svg"
                  alt="mailicon"
                  className="w-full h-full"
                ></img>
              </div>
              <div className="text-[16px] font-normal text-gray-800">
                contact@homeservices.co
              </div>
            </div>
          </div>
        </div>
        {/* bottom footer section */}
        <div className="w-full h-[116px] bg-gray-100 lg:h-[42px] lg:flex">
          <div className="mx-4 py-2 lg:hidden">
            <div className="text-[14px] text-gray-700 font-normal my-2">
              เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
            </div>
            <div className="text-[14px] text-gray-700 font-normal my-2">
              นโยบายความเป็นส่วนตัว
            </div>
          </div>
          <div className="text-[12px] text-gray-500 font-normal mx-4 lg:hidden">
            copyright © 2021 HomeServices.com All rights reserved
          </div>
          {/* footer bottom for desktop */}
          <div className="lg:w-full lg:flex lg:items-center lg:justify-around">
            <div className="text-[12px] text-gray-500 font-normal mx-4 hidden lg:block">
              copyright © 2021 HomeServices.com All rights reserved
            </div>

            <div className="flex gap-8">
              <div
                className="text-[14px] text-gray-700 font-normal my-2 hidden lg:block lg:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTermsOpen(true);
                }}
              >
                เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์
              </div>
              <div
                className="text-[14px] text-gray-700 font-normal my-2 hidden lg:block lg:cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPrivacyOpen(true);
                }}
              >
                นโยบายความเป็นส่วนตัว
              </div>
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
                ข้อตกลงนี้ควบคุมการใช้งานเว็บไซต์
                และการบริการที่เกี่ยวข้องทั้งหมด
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
                เป็นทรัพย์สินทางปัญญาของเรา
                และได้รับการคุ้มครองโดยกฎหมายลิขสิทธิ์
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
                หากคุณมีคำถามหรือข้อสงสัยเกี่ยวกับข้อตกลงนี้
                กรุณาติดต่อเราได้ที่:
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
                เมื่อคุณใช้บริการของเรา เราจะเก็บรวบรวมข้อมูลบางประเภทจากคุณ
                เช่น ชื่อ-นามสกุล, ที่อยู่, เบอร์โทรศัพท์, อีเมล,
                ข้อมูลการชำระเงิน และข้อมูลที่คุณให้มาเมื่อคุณลงทะเบียนใช้งาน
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

              <h3 className="mt-6 font-semibold">
                6. การเข้าถึงและแก้ไขข้อมูล
              </h3>
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
      </footer>
    </>
  );
}
