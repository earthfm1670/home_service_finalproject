// import libary
import React, { useState } from "react";
import axios from "axios";
// import component
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminserviceAddIndex } from "@/components/adminservice/add/adminserviceAddIndex";
import { AdminServiceAddNavbar } from "@/components/adminservice/add/adminserviceAddNavbar";
import { AdminSubmitPopUp } from "@/components/admin/admin-submit-popup";

// create interface for subservice
interface SubService {
  description: string;
  unit: string;
  pricePerUnit: number;
}

export default function AdminNavbar() {
  // array of object form subservice
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([]);
  // name service
  const [inputTitle, setInputTitle] = useState<string>("");
  // select category
  const [inputCat, setInputCat] = useState<number>();
  // input to show image
  const [inputImage, setInputImage] = useState<File | null>(null);

  // popup alert for submit
  const [showPopUpSubmit, setShowPopUpSubmit] = React.useState(false);
  // popup alert for delete image
  const [showPopUpDeleteImg, setShowPopUpDeleteImg] = useState<boolean>(false);
  // console.log("inputImage", inputImage);

  // เพิ่ม state สำหรับเก็บข้อความแจ้งเตือน
  const [titleEmpty, setTitleEmpty] = useState<boolean>(false);
  const [categoryEmpty, setCategoryEmpty] = useState<boolean>(false);
  const [subserviceEmpty, setSubserviceEmpty] = useState<boolean[]>([]);
  const [imageEmpty, setImageEmpty] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ตั้งค่า isValid เป็น true ก่อนการตรวจสอบ
    let isValid = true;

    // ตรวจสอบ title
    if (!inputTitle) {
      setTitleEmpty(true);
      isValid = false;
    }

    // ตรวจสอบ category
    if (!inputCat) {
      setCategoryEmpty(true);
      isValid = false;
    }

    // ตรวจสอบ subservices
    console.log("check value subservice", inputSubservice);

    const newErrors = inputSubservice.map((value: any) => {
      return (
        value.description === "" || // ตรวจสอบว่าค่าว่าง
        value.unit === "" || // ตรวจสอบว่าค่าว่าง
        value.pricePerUnit === 0 // ตรวจสอบว่าราคาเป็น 0
      );
    });

    setSubserviceEmpty(newErrors); // อัปเดต state subserviceEmpty ด้วย array ของข้อผิดพลาด

    if (newErrors.includes(true)) {
      // ตรวจสอบว่ามีข้อผิดพลาดในรายการใดหรือไม่
      isValid = false;
    }

    // ตรวจสอบ image
    if (!inputImage) {
      setImageEmpty(true);
      isValid = false;
      // check value image when submit
      // console.log("inputImage for valid value", inputImage);
    }

    // ถ้าข้อมูลไม่ครบถ้วน จะไม่ทำการส่งข้อมูล
    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append("title", inputTitle);
    formData.append("category_id", inputCat?.toString() || "");
    if (inputImage) {
      formData.append("image", inputImage);
    }
    formData.append("subservices", JSON.stringify(inputSubservice));

    // การแสดงข้อมูลข้างใน formdata ได้นั้นต้องใช้วิธีการ loop
    console.log("FormData contents:");
    let formDataObject: { [key: string]: any } = []; // สร้าง object เปล่าเพื่อเก็บข้อมูล

    for (let [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }
    // แสดงข้อมูลทั้งหมดในรูปแบบ object
    console.log(formDataObject);

    try {
      await axios.post(`/api/admin/management/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("fromdata2", formData);
      setShowPopUpSubmit(true);

      // console.log("newInputData", newInputData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          // Cast ให้เป็น HTMLElement
          const target = e.target as HTMLElement;
          if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
            // ป้องกันการกด Enter ยกเว้นใน <textarea>
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-row w-full">
          <div>
            {/* sidebar for show navigate */}
            <AdminSidebar />
          </div>
          <div className="flex flex-col w-full">
            {/* navbar for admin page */}
            <AdminServiceAddNavbar />
            {/* adminservice index */}
            <AdminserviceAddIndex
              setInputSubservice={setInputSubservice}
              inputtitle={setInputTitle}
              setInputCat={setInputCat}
              SetInputimage={setInputImage}
              setShowPopUpDeleteImg={setShowPopUpDeleteImg}
              showPopUpDeleteImg={showPopUpDeleteImg}
              // แสดงข้อความแจ้งเตือน ช่องกรอกข้อมูลว่าง
              titleEmpty={titleEmpty}
              categoryEmpty={categoryEmpty}
              imageEmpty={imageEmpty}
              subserviceEmpty={subserviceEmpty}
              setTitleEmpty={setTitleEmpty}
              setCategoryEmpty={setCategoryEmpty}
              setImageEmpty={setImageEmpty}
              setSubserviceEmpty={setSubserviceEmpty}
            />
          </div>
        </div>
      </form>
      {/* Show popup when the submit button is clicked */}
      <AdminSubmitPopUp
        setShowPopUpSubmit={setShowPopUpSubmit}
        showPopUpSubmit={showPopUpSubmit}
        message="สร้างรายการสำเร็จ"
        subMessage="กรุณากดยืนยันเพื่อกลับสู่หน้าหลัก ?"
        confirmationText="ยืนยัน"
        redirectPath="/adminservice"
      />
    </>
  );
}
