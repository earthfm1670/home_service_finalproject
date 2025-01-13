import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AdminServiceEditNavbar } from "@/components/adminservice/edit/adminserviceEditNavbar";
import { AdminserviceEditService } from "@/components/adminservice/edit/adminserviceEditService";
import { AdminSubmitPopUp } from "@/components/admin/admin-submit-popup";
import React from "react";

interface SubService {
  description: string;
  unit: string;
  unit_price: number;
}

export default function AdminEdit() {
  // this is data input subservice for recive value form service index to request
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([]);
  // console.log("inputSubservice", inputSubservice);

  // title service name for sent request
  const [inputTitle, setInputTitle] = useState<string>("");

  // category id for sent request
  const [inputCat, setInputCat] = useState<number | undefined>();
  // console.log("this test for receive value inputCat", inputCat);

  // file image to form.append for sent request
  const [inputImage, setInputImage] = useState<File>();
  console.log("check image when update", inputImage);

  // at the navbar for show name of service
  const [nameTopic, setNameTopic] = useState<string>("loading");

  // const [showPopUpSubmit, setShowPopUpSubmit] = useState<boolean>(false);
  const [showPopUpDeleteImg, setShowPopUpDeleteImg] = useState<boolean>(false);

  // popup alert for submit
  const [showPopUpSubmit, setShowPopUpSubmit] = React.useState(false);

  // เพิ่ม state สำหรับเก็บข้อความแจ้งเตือน
  const [titleEmpty, setTitleEmpty] = useState<boolean>(false);
  // const [categoryEmpty, setCategoryEmpty] = useState<boolean>(false);
  const [subServiceEmpty, setSubserviceEmpty] = useState<boolean>(false);
  // console.log("check subserviceEmpty for sent waring empty", subserviceEmpty);
  const [imageEmpty, setImageEmpty] = useState<boolean>(false);

  const [oldImageURL, setOldImageURL] = useState<string | null>(null);
  // console.log("oldImageURL", oldImageURL);

  //ใช้สำหรับรับค่า id จาก endpoint params
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("--------1--------");

    // ตั้งค่า isValid เป็น true ก่อนการตรวจสอบ
    let isValid = true;

    console.log("IsValid after checks:", isValid);
    console.log("--------1.1--------");
    // ตรวจสอบ title
    if (!inputTitle) {
      setTitleEmpty(true);
      isValid = false;
    }

    // ตรวจสอบ subservices
    // console.log("check value subservice", inputSubservice);
    console.log("IsValid after checks:", isValid);
    console.log("--------1.2--------");
    const newErrors = inputSubservice.map((value: SubService) => {
      return (
        value.description !== "" && // ตรวจสอบว่าค่าว่าง
        value.unit !== "" && // ตรวจสอบว่าค่าว่าง
        value.unit_price !== 0 // ตรวจสอบว่าราคาเป็น 0
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
    console.log("IsValid after checks:", isValid);
    console.log("--------1.3--------");
    // ตรวจสอบ image
    if (!inputImage) {
      setImageEmpty(true);
      isValid = false;
      // check value image when submit
      console.log("inputImage for valid value", inputImage);
    }

    console.log("IsValid after checks:", isValid);
    console.log("--------1.4--------");
    // ถ้าข้อมูลไม่ครบถ้วน จะไม่ทำการส่งข้อมูล
    if (isValid === false) {
      return;
    }

    console.log("--------2--------");
    const formData = new FormData();
    const serviceId = id;

    if (serviceId) {
      formData.append("service_id", serviceId.toString());
    }
    formData.append("title", inputTitle);
    if (inputCat) {
      formData.append("category_id", inputCat.toString());
    }
    if (inputImage) {
      formData.append("image", inputImage);
    }
    if (oldImageURL) {
      formData.append("oldImageURL", oldImageURL);
    }
    // subservice is array of object must turn to be json to sent
    formData.append("subservices", JSON.stringify(inputSubservice));

    // Commented out API call
    try {
      await axios.put(`/api/admin/management/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowPopUpSubmit(true);
      // console.log("fromdata2", formData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement; // Cast ให้เป็น HTMLElement
          if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
            e.preventDefault(); // ป้องกันการกด Enter ยกเว้นใน <textarea>
          }
        }}
      >
        <div className="flex flex-row w-full">
          {/* admin sidebar */}
          <div>
            <AdminSidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <AdminServiceEditNavbar nameTopic={nameTopic} />
            {/* admin index */}
            <AdminserviceEditService
              setInputSubservice={setInputSubservice}
              setInputTitle={setInputTitle}
              setInputCat={setInputCat}
              SetInputimage={setInputImage}
              setNameTopic={setNameTopic}
              setShowPopUpDeleteImg={setShowPopUpDeleteImg}
              showPopUpDeleteImg={showPopUpDeleteImg}
              inputTitle={inputTitle}
              // แสดงข้อความแจ้งเตือน ช่องกรอกข้อมูลว่าง
              titleEmpty={titleEmpty}
              imageEmpty={imageEmpty}
              subServiceEmpty={subServiceEmpty}
              setTitleEmpty={setTitleEmpty}
              setImageEmpty={setImageEmpty}
              setSubserviceEmpty={setSubserviceEmpty}
              // ตรสจสอบ image แรกจากการ get
              setOldImageURL={setOldImageURL}
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
