import Adminsidebar from "@/components/admin/adminsidebar";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import axios from "axios";
import IconPicture from "@/components/ui/IconPicture";
import IconDrag from "@/components/ui/IconDragAddAdmin";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
import { stringify } from "querystring";

interface SubService {
  description: string;
  unit: string;
  pricePerUnit: number;
}

export default function AdminNavbar() {
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([
    { description: "", unit: "", pricePerUnit: 0 },
  ]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputCat, setInputCat] = useState("");
  const [inputImage, setInputImage] = useState<File>();
  const [URLimage, setURLimage] = useState<String>();
  const [showPopup, setShowPopup] = useState<boolean>(false);

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

    const formData = new FormData();
    formData.append("title", inputTitle);
    formData.append("category_id", inputCat);
    if (inputImage) {
      formData.append("image", inputImage);
    }
    formData.append("subservices", JSON.stringify(inputSubservice));
  
    // // วนลูปเพื่อแสดงข้อมูลใน FormData
    // console.log("FormData contents:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

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
      router.push("/adminservice");
      // setShowPopup(true);
      console.log("fromdata2", formData);
      // console.log("newInputData", newInputData);
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  // const refresh=() {
  //   await axios.
  // }
  //   },[])

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row w-full">
          <div>
            <Adminsidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
              <div className="text-xl">เพิ่มบริการ</div>
              <div className="h-full flex flex-row items-center gap-6 relative">
                <button
                  className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
                  onClick={() => router.push("/adminservice")}
                >
                  ยกเลิก
                </button>
                <button
                  className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
                  type="submit"
                >
                  สร้าง
                </button>
              </div>
            </div>
            <AdminserviceIndex
              input={setInputSubservice}
              inputtitle={setInputTitle}
              inputcat={setInputCat}
              SetInputimage={setInputImage}
              setURLimage={setURLimage}
            />
          </div>
        </div>
      </form>
    </>
  );
}

// ----------------------------------------------------------------------------------------------

export const AdminserviceIndex = ({
  input,
  inputtitle,
  inputcat,
  SetInputimage,
  setURLimage
}: any) => {
  const router = useRouter();

  // ดึงข้อมูลจาก Context
  // สร้าง state เพื่อมารับข้อมูล service

  // สร้าง state มาส่งข้อมูล
  const [title, setTitle] = useState<string>("");
  const [category_id, setCategory_id] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [subService, setSubService] = useState<string>("");

  // State เพื่อจัดการข้อมูล subservice
  const [subservices, setSubservices] = useState<any[]>([
    { description: "", unit: "", pricePerUnit: 0 },
    { description: "", unit: "", pricePerUnit: 0 },
  ]);

  input(subservices);

  const addSubService = () => {
    setSubservices((prevSubservices) => [
      ...prevSubservices,
      { description: "", unit: "", pricePerUnit: 0 },
    ]);
  };

  const deleteSubservice = (index: number) => {
    // ลบรายการตาม index
    const updatedSubservices = subservices.filter((_, idx) => idx !== index);
    setSubservices(updatedSubservices);
  };

  const updateSubservice = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setSubservices((prevSubservices) => {
      const updatedSubservices = [...prevSubservices];
      updatedSubservices[index] = {
        ...updatedSubservices[index],
        [field]: value,
      };
      return updatedSubservices;
    });
  };

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputtitle(event.target.value);
  };

  inputcat(category_id);

  const [preview, setPreview] = useState<String | null>(null); // เก็บ URL ชั่วคราวของรูปภาพ

  const handleInputImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // ดึงไฟล์ที่ผู้ใช้เลือก
    console.log(event, "event for image");
    if (file) {
      const previewURL = URL.createObjectURL(file); // การแปลง file เป็น url เพื่อแสดงในกล่อง
      // const previewURL = URL.revokeObjectURL(preview); // การลบ url เมื่อไม่ได้ใช้งาน ยังไม่ค่อยเข้าใจ
      console.log("previewURL", previewURL);
      setPreview(previewURL);
      SetInputimage(file);
    }
  };

  // const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   const previewURL = URL.createObjectURL(file)
  //   setPreview(previewURL)
  //   if (!file) {
  //     alert("No file selected.");
  //     return;
  //   }
  //   if (!file.type.startsWith("image/")) {
  //     alert("Please upload a valid image file.");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const response = await axios.post("/api/admin/management/create/", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     setURLimage(response.data.urls[0]);
  //   } catch (err) {
  //     console.log("Error uploading image:", err);
  //   }
  // };

  const handleDeleteImg = () => {
    setPreview(null);
  };

  return (
    <>
      <div className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
        <div className="flex flex-col w-[1120px] border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 py-12 px-7">
          {/* กล่องบน */}
          {/* ชื่อบริการ */}
          <div className="w-full bg-white ">
            <div className="flex items-center justify-between w-[662px]">
              <label htmlFor="ชื่อบริการ">ชื่อบริการ</label>
              <input
                type="text"
                onChange={handleInputTitle}
                className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5"
              />
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div className="flex items-center justify-between w-[662px]">
            <label htmlFor="category">หมวดหมู่</label>
            <div className="relative w-[433px]">
              <select
                id="category"
                className="border border-gray-300 h-11 rounded-lg w-full px-5  appearance-none" // ลบลูกศรเดิมและเพิ่ม padding ขวา
                value={category_id}
                onChange={(e) => setCategory_id(e.target.value)}
              >
                <option value="">เลือกหมวดหมู่</option>
                <option value="2">บริการทั่วไป</option>
                <option value="3">บริการห้องครัว</option>
                <option value="4">บริการห้องน้ำ</option>
                {/* <option value="bathroom_service">บริการห้องน้ำ</option> */}
              </select>
              {/* ลูกศร */}
              <span className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                &#9662;
              </span>
            </div>
          </div>

          <div className=" flex flex-col gap-12">
            {/* Update Image */}
            {/* ข้อความ */}
            <div className="flex items-start justify-between w-[662px]">
              <label htmlFor="ชื่อบริการ" className="">
                รูปภาพ
              </label>
              {/* input for upload */}
              <div className="flex flex-col gap-2 w-[433px]">
                <div className="w-full flex items-center justify-center flex-col  border-2 border-dashed border-gray-300 rounded-lg">
                  <div>
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div>
                        <div className="w-full h-full flex items-center justify-center flex-col gap-3 p-4">
                          <IconPicture />
                          {/* div for first line in box drop img */}
                          <div className="flex flex-row gap-2">
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer text-blue-500 hover:text-blue-700"
                            >
                              อัพโหลดภาพ
                            </label>
                            <p className="text-gray-600 text-center ">หรือ</p>
                            <p className="text-gray-600 text-center ">
                              ลากและวางที่นี้
                            </p>
                          </div>
                          {/* div for second line in box drop img*/}
                          <div className="flex flex-row gap-2 text-sm -mt-2  text-gray-600">
                            <p>PNG,</p>
                            <p>JPG</p>
                            <p>ขนาดไม่เกิน</p>
                            <p className="text-gray-600 text-center ">5MB</p>
                          </div>
                        </div>
                        <div>
                          <input
                            type="file"
                            id="file-upload"
                            accept="image/png, image/jpeg"
                            onChange={handleInputImg}
                            // onChange={handleImageUpload}
                            className="hidden"
                            // ดักจับการเปลี่ยนแปลงของไฟล์
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  {preview ? (
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-sm text-gray-600">
                        ขนาดภาพที่แนะนำ: 1440 x 225 PX
                      </p>
                      <p
                        className="cursor-pointer text-blue-500 hover:text-blue-700 underline"
                        onClick={handleDeleteImg}
                      >
                        ลบรูปภาพ
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-sm text-gray-600">
                        ขนาดภาพที่แนะนำ: 1440 x 225 PX
                      </p>
                      <p></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-gray-300"></div>
            {/* กล่องล่าง */}
            <div>
              <div className="">
                <h1>รายการรับผิดชอบ</h1>
                {subservices.map((subservice, index) => (
                  <AddSubService
                    key={index}
                    index={index}
                    subservice={subservice}
                    deleteSubservice={deleteSubservice}
                    updateSubservice={updateSubservice}
                  />
                ))}
              </div>
              <div className="">
                <button
                  type="button"
                  className=" bg-white text-defaultColor text-base h-10  flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 mt-7"
                  onClick={addSubService}
                >
                  เพิ่มรายการ
                  <span>
                    <IconPlusDefaultColor />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --------------------------------------------------------------------------

export function AddSubService({
  index,
  subservice,
  deleteSubservice,
  updateSubservice,
}: {
  index: number;
  subservice: {
    description: string;
    unit: string;
    pricePerUnit: number;
  };
  deleteSubservice: (index: number) => void;
  updateSubservice: (
    index: number,
    field: "description" | "unit" | "pricePerUnit",
    value: string | number
  ) => void;
}) {
  return (
    <>
      {/* sub service */}
      <div className="flex flex-row justify-between">
        <div className="mt-14">
          <IconDrag />
        </div>

        <div className="flex flex-col py-6">
          <label htmlFor={`subserviceName-${index}`}>ชื่อบริการ</label>
          <input
            type="text"
            id={`subserviceName-${index}`}
            value={subservice.description}
            onChange={(e) =>
              updateSubservice(index, "description", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[422px] pl-5"
          />
        </div>
        <div className="flex flex-col py-6">
          <label htmlFor={`subservicePrice-${index}`}>
            ค่าบริการ / 1 หน่วย
          </label>
          <input
            type="number"
            id={`subservicePrice-${index}`}
            // value={subservice.pricePerUnit}
            onChange={(e) =>
              updateSubservice(index, "pricePerUnit", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <div className="flex flex-col py-6">
          <label htmlFor={`subserviceUnit-${index}`}>หน่วยการบริการ</label>
          <input
            type="text"
            id={`subserviceUnit-${index}`}
            value={subservice.unit}
            onChange={(e) => updateSubservice(index, "unit", e.target.value)}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <h1
          className="mt-14 active:text-[#FF6347] cursor-pointer"
          onClick={() => deleteSubservice(index)}
        >
          ลบรายการ
        </h1>
      </div>
    </>
  );
}
