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
        <Dialog.Trigger />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>ข้อตกลงและเงื่อนไข</Dialog.Title>
            <Dialog.Description>
              อ่านข้อตกลงและเงื่อนไขก่อนยอมรับ
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body>
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
          </Dialog.Body>

          <Dialog.Footer>
            <Button onClick={closeModal} variant="outline" className="mr-2">
              ยกเลิก
            </Button>
            <Button onClick={closeModal}>ยอมรับ</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}
