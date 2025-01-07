// import libary
import { useEffect, useState } from "react";
import axios from "axios";
// import icon
import IconPicture from "@/components/ui/IconPicture";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
// import component
import { AddSubService } from "./adminserviceAddSubservice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AdminDeleteImagePopUp } from "@/components/admin/admin-delete-image-popup";

// ----------------------------------------------------------------------------------------

interface AdminServiceAddIndexProps {
  setInputSubservice: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  inputTitle: (value: string) => void;
  setInputCat: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  SetInputimage: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  showPopUpDeleteImg: boolean;
  setShowPopUpDeleteImg: (value: boolean) => void;
  titleEmpty: boolean;
  categoryEmpty: boolean;
  imageEmpty: boolean;
  subServiceEmpty: boolean;
  setTitleEmpty: (value: boolean) => void;
  setCategoryEmpty: (value: boolean) => void;
  setSubserviceEmpty: (value: boolean) => void;
  setImageEmpty: (value: boolean) => void;
}

export const AdminserviceAddService = ({
  // input for sent value
  setInputSubservice,
  inputTitle,
  setInputCat,
  SetInputimage,
  // alert popup for delete image
  showPopUpDeleteImg,
  setShowPopUpDeleteImg,
  // check empty for alert warning
  titleEmpty,
  setTitleEmpty,
  categoryEmpty,
  setCategoryEmpty,
  imageEmpty,
  setImageEmpty,
  subServiceEmpty,
  setSubserviceEmpty,
}: AdminServiceAddIndexProps) => {
  // State สำหรับเก็บข้อมูล Category ที่ดึงมาจาก API
  const [fetchDataCategories, setFetchDataCategories] = useState<any>([]);

  // State เพื่อจัดการข้อมูล subservice
  const [subservices, setSubservices] = useState<any[]>([
    { description: "", unit: "", pricePerUnit: 0 },
    { description: "", unit: "", pricePerUnit: 0 },
  ]);

  // State สำหรับเก็บ URL ของภาพที่ผู้ใช้เลือก
  const [preview, setPreview] = useState<string | null>(null);

  // State สำหรับเก็บ category_id ที่เลือกจาก Select
  const [category_id, setCategory_id] = useState<number>();

  // ส่งข้อมูล subservices ไปยังฟังก์ชัน setInputSubservice
  setInputSubservice(subservices);

  // ส่งข้อมูล category_id ไปยังฟังก์ชัน setInputCat
  setInputCat(category_id);

  // สำหรับแสดง string ของ select ก่อนใช้กับหลังใช้
  const [isOpenTrigger, setIsOpenTrigger] = useState(false);

  // ฟังก์ชันสำหรับเพิ่ม subservice ใหม่
  const addSubService = () => {
    // เรียก setSubservices เพื่ออัปเดตค่า subservices
    // การเพิ่ม subservice ใหม่เข้าไปในอาร์เรย์โดยการคัดลอกค่าเดิมทั้งหมดและเพิ่มอ็อบเจ็กต์ใหม่
    setSubservices((prevSubservices) => [
      ...prevSubservices, // คัดลอกค่าของ subservices ที่มีอยู่
      { description: "", unit: "", pricePerUnit: 0 }, // เพิ่ม subservice ใหม่ที่มีค่าเริ่มต้นเป็นค่าว่าง
    ]);
  };

  // ฟังก์ชันสำหรับลบ subservice ตาม index โดยที่ index > 1
  const deleteSubservice = (index: number) => {
    // ตรวจสอบว่า subservices ยังมีมากกว่าหนึ่งรายการอยู่หรือไม่
    if (subservices.length > 1) {
      // ใช้ฟังก์ชัน filter เพื่อกรอง subservice ที่ไม่ตรงกับ index ที่จะลบ
      const updatedSubservices = subservices.filter((_, idx) => idx !== index);
      // อัปเดตค่า subservices ด้วยค่าใหม่ที่กรองแล้ว
      setSubservices(updatedSubservices);
    }
  };

  // ฟังก์ชันสำหรับอัปเดตข้อมูลของ subservice ตาม index และฟิลด์ที่ต้องการ
  const updateSubservice = (
    index: number, // index ของ subservice ที่ต้องการอัปเดต
    field: string, // ชื่อฟิลด์ที่ต้องการอัปเดต เช่น "description", "unit", "pricePerUnit"
    value: string | number // ค่าใหม่ที่จะอัปเดตในฟิลด์ที่เลือก
  ) => {
    // ถ้าฟิลด์คือ "pricePerUnit"
    if (field === "pricePerUnit") {
      if (value === "" || value === "0") {
        value = 0; // แปลง "" หรือ "0" ให้เป็น 0
      } else if (typeof value === "number" && value < 0) {
        value = 0; // ป้องกันค่าที่ต่ำกว่า 0
      } else if (typeof value === "string") {
        const numberValue = parseFloat(value); // แปลง string เป็น number
        value = numberValue < 0 ? 0 : numberValue; // ถ้าค่าน้อยกว่า 0 ให้ตั้งเป็น 0
      }
    }

    // การอัปเดตข้อมูล subservices
    setSubservices((prevSubservices) => {
      // คัดลอกค่าเดิมของ subservices
      const updatedSubservices = [...prevSubservices];
      // อัปเดตฟิลด์ที่เลือกใน subservice ตาม index ที่ระบุ
      updatedSubservices[index] = {
        ...updatedSubservices[index], // คัดลอกข้อมูลเดิมของ subservice
        [field]: value, // อัปเดตฟิลด์ที่ระบุด้วยค่าใหม่
      };

      // ตรวจสอบว่า subservice ทุกตัวกรอกครบทั้ง 3 ฟิลด์หรือไม่
      const isSubserviceComplete = updatedSubservices.map(
        (subservice) =>
          subservice.description !== "" &&
          subservice.unit !== "" &&
          subservice.pricePerUnit !== 0
      );
      // console.log("isSubserviceComplete", isSubserviceComplete);

      const completeEmpty = isSubserviceComplete.includes(false);
      // console.log("completeEmpty", completeEmpty);
      if (completeEmpty === false) {
        setSubserviceEmpty(completeEmpty);
      }

      // setSubserviceEmpty(updatedEmptyState);

      return updatedSubservices;
    });
  };
  // console.log("check update update subservice", subservices);

  // ฟังก์ชันจัดการการกรอกชื่อบริการ
  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputTitle(event.target.value);
    setTitleEmpty(false);
  };

  // ฟังก์ชันสำหรับจัดการการอัปโหลดรูปภาพ
  const handleInputImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // ดึงไฟล์ที่ผู้ใช้เลือก
    console.log(event, "event for image");
    console.log(file, "file for image");
    if (file) {
      const previewURL = URL.createObjectURL(file); // การแปลง file เป็น url เพื่อแสดงในกล่อง
      // const previewURL = URL.revokeObjectURL(preview); // การลบ url เมื่อไม่ได้ใช้งาน ยังไม่ค่อยเข้าใจ
      console.log("previewURL", previewURL);
      setPreview(previewURL);
      SetInputimage(file);
    }
  };
  // ดึงข้อมูล subservice จาก API เมื่อ component ถูกโหลดครั้งแรก
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/admin/management/get-categories`);
      setFetchDataCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ฟังก์ชันสำหรับจัดการการเลือก category
  const handleCategorySelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(event.target.value);
    console.log("value for check inputCat", value);
    setCategory_id(value);
    setCategoryEmpty(false);
  };

  // ฟังก์ชันสำหรับลบรูปภาพ
  const handleDeleteImg = () => {
    setPreview(null);
    setShowPopUpDeleteImg(false);

    // เนื่องจากสถานะคงค้างข้างใน file ของ input image ทำให้ต้องมีการ set null อีกครั้ง
    SetInputimage(null);
    setImageEmpty(false);
  };

  // ใช้ useEffect เพื่อดึงข้อมูล category เมื่อ component ถูก mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      {/* พื้นหลัง */}
      <div className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
        {/* กล่องใหญ่ */}
        <div className="flex flex-col w-[1120px] border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 py-12 px-7 ">
          {/* กล่องบน */}
          {/* ชื่อบริการ */}
          <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium relative">
            <label htmlFor="ชื่อบริการ" className="">
              ชื่อบริการ
              <span className="text-red-600 text-lg absolute top-1">*</span>
            </label>
            <div className="flex flex-col ">
              <input
                type="text"
                onChange={handleInputTitle}
                className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5 text-black font-normal"
              />
              {titleEmpty && (
                <p className="text-red-500 text-sm absolute top-12">
                  กรุณากรอกชื่อบริการ
                </p>
              )}
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium relative">
            <label htmlFor="category">
              หมวดหมู่{" "}
              <span className="text-red-600 text-lg absolute top-1">*</span>
            </label>
            <div className="w-[433px]">
              <Select
                onValueChange={(value: string) => {
                  handleCategorySelect({
                    target: { value },
                  } as React.ChangeEvent<HTMLSelectElement>);
                  setIsOpenTrigger(true);
                }}
              >
                <SelectTrigger
                  className={`w-[433px] pl-5 h-[44px] text-base font-normal ${
                    isOpenTrigger ? "text-black" : "text-gray-600"
                  }`}
                >
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {fetchDataCategories.map(
                    (fetchDataCategories: any, index: any) => (
                      <SelectItem
                        key={fetchDataCategories.id.toString()}
                        value={fetchDataCategories.id.toString()}
                      >
                        {fetchDataCategories.category}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {categoryEmpty && (
                <p className="text-red-500 text-sm absolute top-12">
                  กรุณาเลือกหมวดหมู่
                </p>
              )}
            </div>
          </div>

          {/* Update Image */}
          {/* ข้อความ */}
          <div className="flex items-start justify-between w-[662px] text-gray-500 font-medium">
            <label htmlFor="ชื่อบริการ" className="">
              รูปภาพ<span className="text-red-600 text-lg">*</span>
            </label>
            {/* input for upload */}
            <div className="flex flex-col gap-2 w-[433px]">
              <div className="w-full flex items-center justify-center flex-col  border-2 border-dashed border-gray-300 rounded-lg ">
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
                          className="hidden"
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
                      onClick={() => setShowPopUpDeleteImg(true)}
                    >
                      ลบรูปภาพ
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-sm text-gray-600">
                        ขนาดภาพที่แนะนำ: 1440 x 225 PX
                      </p>
                    </div>
                    {imageEmpty && (
                      <p className="text-red-500 text-sm absolute top-0 bg-white w-full">
                        รูปภาพไม่ถูกต้อง
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* PopUp for warning delete image */}
          <AdminDeleteImagePopUp
            showPopUpDeleteImg={showPopUpDeleteImg}
            setShowPopUpDeleteImg={setShowPopUpDeleteImg}
            handleDeleteImg={handleDeleteImg}
            message="ยืนยันการลบรายการ ?"
            subMessage="ใช่หรือไม่"
            confirmationText="ลบรายการ"
            cancelAction="ยกเลิก"
          />

          {/* -----------------------------กล่องล่าง----------------------------- */}
          {/* subservice */}
          <div className="h-px w-full bg-gray-300"></div>
          <div>
            <div className="">
              <h1 className="text-gray-500 font-medium">รายการรับผิดชอบ</h1>
              {subservices.map((subservice, index) => (
                <AddSubService
                  key={index}
                  index={index}
                  subservice={subservice}
                  deleteSubservice={deleteSubservice}
                  updateSubservice={updateSubservice}
                  subServiceEmpty={subServiceEmpty}
                />
              ))}
            </div>

            <button
              type="button"
              className=" bg-white text-defaultColor text-base h-10  flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 mt-7 active:bg-pressedColor active:text-white "
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
    </>
  );
};
