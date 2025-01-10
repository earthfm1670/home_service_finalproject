// import libary
import React, { useState, FormEvent } from "react";
import axios from "axios";
// import component
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminserviceAddService } from "@/components/adminservice/add/adminserviceAddService";
import { AdminServiceAddNavbar } from "@/components/adminservice/add/adminserviceAddNavbar";
import { AdminSubmitPopUp } from "@/components/admin/admin-submit-popup";

// create interface for subservice
interface SubService {
  description: string;
  unit: string;
  pricePerUnit: number;
}

export default function AdminserviceAddIndex() {
  // array of object form subservice
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([]);
  console.log("inputSubservice", inputSubservice);
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
  const [subServiceEmpty, setSubserviceEmpty] = useState<boolean>(false);
  // console.log("check subserviceEmpty for sent waring empty", subserviceEmpty);
  const [imageEmpty, setImageEmpty] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    // console.log("check value subservice", inputSubservice);

    const newErrors = inputSubservice.map((value: SubService) => {
      return (
        value.description !== "" && // ตรวจสอบว่าค่าว่าง
        value.unit !== "" && // ตรวจสอบว่าค่าว่าง
        value.pricePerUnit !== 0 // ตรวจสอบว่าราคาเป็น 0
      );
    });
    // console.log("check newError boolean", newErrors);

    function booleanSubservice(newErrors: boolean[]): boolean {
      // ตรวจสอบว่า newErrors มีค่า false หรือไม่
      return newErrors.includes(false);
    }
    // function ที่จะส่งค่าเป็น true เพื่อใช้งาน warning ได้มีแค่ booleanSubservice เท่านั้น
    // console.log("booleanSubservice", booleanSubservice(newErrors));
    // อัปเดต state ด้วยค่าที่ได้จาก booleanSubservice
    setSubserviceEmpty(booleanSubservice(newErrors)); // ตั้งค่าผลลัพธ์เป็น boolean

    // ใช้ผลลัพธ์ในการตรวจสอบ isValid
    if (booleanSubservice(newErrors)) {
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
        }}>
        <div className="flex flex-row w-full">
          <div>
            {/* sidebar for show navigate */}
            <AdminSidebar />
          </div>
          <div className="flex flex-col w-full">
            {/* navbar for admin page */}
            <AdminServiceAddNavbar />
            {/* adminservice index */}
            <AdminserviceAddService
              setInputSubservice={setInputSubservice}
              inputTitle={setInputTitle}
              setInputCat={setInputCat}
              SetInputimage={setInputImage}
              setShowPopUpDeleteImg={setShowPopUpDeleteImg}
              showPopUpDeleteImg={showPopUpDeleteImg}
              // แสดงข้อความแจ้งเตือน ช่องกรอกข้อมูลว่าง
              titleEmpty={titleEmpty}
              categoryEmpty={categoryEmpty}
              imageEmpty={imageEmpty}
              subServiceEmpty={subServiceEmpty}
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
