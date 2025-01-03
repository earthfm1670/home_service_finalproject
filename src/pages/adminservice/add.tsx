// import libary
import React, { useState } from "react";
import axios from "axios";
import IconPicture from "@/components/ui/IconPicture";
import IconDrag from "@/components/ui/IconDragAddAdmin";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
import { stringify } from "querystring";
import IconWarning from "@/components/ui/Iconwarning";
import IconX from "@/components/ui/IconX";
import { Check } from "lucide-react";
import IconCheck from "@/components/ui/IconCheck";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [inputImage, setInputImage] = useState<File>();
  const [URLimage, setURLimage] = useState<String>();
  const [showPopUpSubmit, setShowPopUpSubmit] = useState<Boolean>(false);
  const [showPopUpDeleteImg, setShowPopUpDeleteImg] = useState<Boolean>(false);

  // console.log("inputImage", inputImage);

  // const file = new Blob([yourData], { type: "image/jpeg" });

  const router = useRouter();

  //   <option value="general_service">บริการทั่วไป</option>
  //   <option value="kitchen_service">บริการห้องครัว</option>
  //   <option value="bathroom_service">บริการห้องน้ำ</option>

  //   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setInput(event.target.value);
  //   };

  // const convertFileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     if (!file) {
  //       reject(new Error("File is null or undefined"));
  //       return;
  //     }
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if (e.key === "Enter") {
    //   e.preventDefault(); // ปิดการทำงานของ Enter
    //   return;
    // }

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

    console.log(formDataObject); // แสดงข้อมูลทั้งหมดในรูปแบบ object

    // let base64Image = null;

    // if (inputImage instanceof File) {
    //   try {
    //     base64Image = await convertFileToBase64(inputImage);
    //     // console.log(base64Image)
    //   } catch (error) {
    //     console.error("Error converting file to Base64:", error);
    //     alert("เกิดข้อผิดพลาดในการแปลงไฟล์รูปภาพ");
    //     return;
    //   }
    // } else {
    //   console.error("inputImage is not a valid File");
    // }

    // console.log("create new category");
    // let category_id = 0;

    // if (inputCat === "general_service") {
    //   category_id = 2;
    // } else if (inputCat === "kitchen_service") {
    //   category_id = 3;
    // } else if (inputCat === "bathroom_service") {
    //   category_id = 4;
    // }
    try {
      // const newInputData = {
      //   title: inputTitle,
      //   category_id: inputCat,
      //   image: inputImage,
      //   subServices: inputSubservice,
      // };

      // await axios.post(`/api/admin/management/create`, newInputData);
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
