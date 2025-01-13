// components/TermsModal.tsx
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      {/* Trigger Button */}
      <Button onClick={openModal} className="text-blue-600">
        ดูข้อตกลงและเงื่อนไข
      </Button>

      {/* Dialog for Terms and Agreement */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="fixed inset-0 bg-white p-4">
          <h2 className="text-lg font-semibold">ข้อตกลงและเงื่อนไข</h2>
          <p>
            อ่านข้อตกลงและเงื่อนไขก่อนยอมรับ
          </p>
          <div className="space-y-4">
            <p>
              โปรดอ่านข้อตกลงและเงื่อนไขของการใช้งานเว็บไซต์นี้ก่อน
              การใช้บริการ
            </p>
            <p>
              ข้อกำหนดและเงื่อนไขที่ท่านยอมรับเมื่อเข้าถึงเว็บไซต์นี้
              รวมถึงข้อกำหนดเกี่ยวกับความเป็นส่วนตัว, ข้อกำหนดการใช้งาน,
              และเงื่อนไขต่างๆ ของเว็บไซต์
            </p>
            <p>หากท่านไม่ยอมรับข้อตกลงเหล่านี้กรุณาหยุดการใช้บริการ</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={closeModal} variant="outline" className="mr-2">
              ยกเลิก
            </Button>
            <Button onClick={closeModal}>ยอมรับ</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
