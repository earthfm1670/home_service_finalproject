// import libary
import { useEffect, useState } from "react";
import axios from "axios";
// import component
import { AddSubService } from "./adminserviceAddSubservice";
// import icon
import IconPicture from "@/components/ui/IconPicture";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
import IconWarning from "@/components/ui/Iconwarning";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconX from "@/components/ui/IconX";

// ----------------------------------------------------------------------------------------

interface AdminServiceAddIndexProps {
  setInputSubservice: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  inputtitle: (value: string) => void;
  setInputCat: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  SetInputimage: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  showPopUpDeleteImg: boolean;
  setShowPopUpDeleteImg: (value: boolean) => void;
  titleEmpty: boolean;
  categoryEmpty: boolean;
  imageEmpty: boolean;
  subserviceEmpty: boolean[];
  setTitleEmpty: (value: boolean) => void;
  setCategoryEmpty: (value: boolean) => void;
  setSubserviceEmpty: (value: boolean[]) => void;
}

export const AdminserviceAddIndex = ({
  setInputSubservice,
  inputtitle,
  setInputCat,
  SetInputimage,
  showPopUpDeleteImg,
  setShowPopUpDeleteImg,
  titleEmpty,
  categoryEmpty,
  imageEmpty,
  subserviceEmpty,
  setTitleEmpty,
  setCategoryEmpty,
  setSubserviceEmpty,
}: AdminServiceAddIndexProps) => {
  // State สำหรับเก็บ category_id ที่เลือกจาก Select
  const [category_id, setCategory_id] = useState<number>();

  // State สำหรับเก็บข้อมูล Category ที่ดึงมาจาก API
  const [fetchDataCategories, setFetchDataCategories] = useState<any>([]);

  // State เพื่อจัดการข้อมูล subservice
  const [subservices, setSubservices] = useState<any[]>([
    { description: "", unit: "", pricePerUnit: 0 },
    { description: "", unit: "", pricePerUnit: 0 },
  ]);

  // ส่งข้อมูล subservices ไปยังฟังก์ชัน setInputSubservice
  setInputSubservice(subservices);

  // ฟังก์ชันสำหรับเพิ่ม subservice ใหม่
  const addSubService = () => {
    setSubservices((prevSubservices) => [
      ...prevSubservices,
      { description: "", unit: "", pricePerUnit: 0 },
    ]);
  };

  // ฟังก์ชันสำหรับลบ subservice ตาม index โดยที่ index > 1
  const deleteSubservice = (index: number) => {
    // ลบรายการตาม index
    if (subservices.length > 1) {
      const updatedSubservices = subservices.filter((_, idx) => idx !== index);
      setSubservices(updatedSubservices);
    }
  };

  // ฟังก์ชันสำหรับอัปเดตข้อมูลของ subservice ตาม index และฟิลด์ที่ต้องการ
  const updateSubservice = (
    index: number,
    field: string,
    value: string | number
  ) => {
    // การอัปเดตข้อมูล subservices
    // prevSubservices คือค่าปัจจุบันของ subservices ก่อนการอัปเดต
    setSubservices((prevSubservices) => {
      const updatedSubservices = [...prevSubservices];
      updatedSubservices[index] = {
        ...updatedSubservices[index],
        [field]: value,
      };
      return updatedSubservices;
    });
  };

  // ฟังก์ชันจัดการการกรอกชื่อบริการ
  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    inputtitle(event.target.value);
    setTitleEmpty(false);
  };

  // ส่งข้อมูล category_id ไปยังฟังก์ชัน setInputCat
  setInputCat(category_id);

  // State สำหรับเก็บ URL ของภาพที่ผู้ใช้เลือก
  const [preview, setPreview] = useState<string | null>(null);

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

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/admin/management/get-categories`);
      setFetchDataCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategorySelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(event.target.value);
    console.log("value for check inputCat", value);
    setCategory_id(value);
    setCategoryEmpty(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteImg = () => {
    setPreview(null);
    setShowPopUpDeleteImg(false);
  };

  const [isOpen, setIsOpen] = useState(false);

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
                  setIsOpen(true);
                }}
              >
                <SelectTrigger
                  className={`w-[433px] pl-5 h-[44px] text-base font-normal ${
                    isOpen ? "text-black" : "text-gray-600"
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

          {/* กล่องล่าง */}
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
                  subserviceEmpty={subserviceEmpty}
                  setSubserviceEmpty={setSubserviceEmpty}
                />
              ))}
            </div>
            <div className="">
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
      </div>

      {/* Popup for delete image */}
      {showPopUpDeleteImg && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
            <div className="w-full">
              <div
                className="w-full flex justify-end "
                onClick={() => setShowPopUpDeleteImg(false)}
              >
                <IconX />
              </div>
              <div className="flex justify-center">
                <IconWarning />
              </div>
            </div>
            <h1 className="font-medium text-xl">ยืนยันการลบรายการ ?</h1>
            <h1 className="text-center text-gray-500">
              {/* คุณต้องการลบรายการ ‘{serviceName}’ <br /> */}
              ใช่หรือไม่
            </h1>
            <div className="flex flex-row gap-3 my-1">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={handleDeleteImg}
              >
                ลบรายการ
              </button>
              <button
                className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
                onClick={() => setShowPopUpDeleteImg(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
