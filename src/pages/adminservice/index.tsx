import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useState } from "react";

import { useRouter } from "next/router";

import { AdminServiceIndexNavbar } from "@/components/adminservice/page/adminServiceIndexNavbar";
import { AdminserviceIndexServiceList } from "@/components/adminservice/page/adminServiceIndexServiceList";

export default function AdminService() {
  // useState hook ใช้เก็บค่าของการค้นหาบริการ
  const [search, setSearch] = useState("");

  // ฟังก์ชันจัดการการเปลี่ยนแปลงค่าจาก input search และส่งค่าลงไปให้ admin index
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  // console.log("check state for search sent to endpoint query",search);

  // ใช้ router จาก Next.js เพื่อเปลี่ยนหน้า
  const router = useRouter();

  return (
    <>
      <div className="flex flex-row w-full">
        <div>
          {/*  navebar import เพื่อใช้สำหรับหน้า admin index */}
          <AdminSidebar />
        </div>
        <div className="w-full flex flex-col">
          {/* navbar for admin index */}

          <AdminServiceIndexNavbar handleInputChange={handleInputChange} />
          {/* แสดงข้อมูลที่ได้จาก data base */}
          <AdminserviceIndexServiceList search={search} />
        </div>
      </div>
    </>
  );
}

//---------------------------------------------------------------------------------------
