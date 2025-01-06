import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import IconPicture from "@/components/ui/IconPicture";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminserviceEditSubService } from "./adminserviceEditSubservice";
import { AdminDeletePopUp } from "@/components/admin/admin-delete-popup";

interface AdminServiceAddIndexProps {
  setInputSubservice: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  inputTitle: string;
  setInputTitle: (value: string) => void;
  setInputCat: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  SetInputimage: (value: any) => void; // ควรระบุ type ที่ชัดเจนกว่านี้ ถ้าทราบ
  showPopUpDeleteImg: boolean;
  setShowPopUpDeleteImg: (value: boolean) => void;
  titleEmpty: boolean;
  imageEmpty: boolean;
  subServiceEmpty: boolean;
  setTitleEmpty: (value: boolean) => void;
  setSubserviceEmpty: (value: boolean) => void;
  setImageEmpty: (value: boolean) => void;
  setNameTopic: (value: string) => void;
}

export const AdminserviceEditService = ({
  setInputSubservice,
  setInputTitle,
  setInputCat,
  SetInputimage,
  setNameTopic,
  setShowPopUpDeleteImg,
  showPopUpDeleteImg,
  inputTitle,
  titleEmpty,
  setTitleEmpty,
  imageEmpty,
  setImageEmpty,
  subServiceEmpty,
  setSubserviceEmpty,
}: AdminServiceAddIndexProps) => {
  const router = useRouter();
  const { id } = router.query;

  // state for store subservice
  const [fetchSubservices, setFetchSubservices] = useState<any[]>([]);
  // console.log("fetchSubservices",fetchSubservices)

  // store all of data categories for show
  const [fetchDataCategories, setFetchDataCategories] = useState<any>([]);

  // for recive data response to show data detail before sent request
  const [serviceCategoryData, setServiceCategoryData] = useState<String>();
  const [createAt, setCreateAt] = useState<string>(new Date().toISOString());
  const [updateAt, setUpdateAt] = useState<string>(new Date().toISOString());

  // add new row for subservice
  const addSubService = () => {
    setFetchSubservices((prevSubservices) => [
      ...prevSubservices,
      { description: "", unit: "", unit_price: null },
    ]);
  };

  // function for filter idx that not match with index
  const deleteSubservice = (index: number) => {
    const updatedSubservices = fetchSubservices.filter(
      (_, idx) => idx !== index
    );
    setFetchSubservices(updatedSubservices);
  };

  // ค่าที่ได้รับการเปลี่ยนแปลงส่งเข้าไปเก็บข้องใน setSubservices
  const updateSubservice = (
    index: number, // index ของ subservice ที่ต้องการอัปเดต
    field: string, // ชื่อฟิลด์ที่ต้องการอัปเดต เช่น "description", "unit", "pricePerUnit"
    value: string | number // ค่าใหม่ที่จะอัปเดตในฟิลด์ที่เลือก
  ) => {
    // ถ้าฟิลด์คือ "pricePerUnit"
    if (field === "unit_price") {
      if (value === "" || value === "0") {
        value = ""; // แปลง "" หรือ "0" ให้เป็น ""
      } else if (typeof value === "number" && value < 0) {
        value = ""; // ป้องกันค่าที่ต่ำกว่า 0
      } else if (typeof value === "string") {
        const numberValue = parseFloat(value); // แปลง string เป็น number
        value = numberValue < 0 ? "" : numberValue; // ถ้าค่าน้อยกว่า 0 ให้ตั้งเป็น ""
      }
    }

    // การอัปเดตข้อมูล subservices
    setFetchSubservices((prevSubservices) => {
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
          subservice.unit_price !== 0 &&
          subservice.unit_price !== ""
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
  // แปลงข้อมูลที่ได้รับมาจาก subservice ก่อนที่จะส่งให้ setInputSubservice โดยที่ unit_price ห้ามเป็น null
  useEffect(() => {
    const updatedSubservices = fetchSubservices.map((subService) => ({
      ...subService,
      unit_price: subService.unit_price === "" ? "0" : subService.unit_price,
    }));
    // console.log("updata subservice", updatedSubservices);
    setInputSubservice(updatedSubservices);
  }, [fetchSubservices]);

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setServiceNameData(event.target.value);
    setInputTitle(event.target.value);
    setTitleEmpty(false);
  };

  const handleCategorySelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = Number(event.target.value);
    console.log("value for check inputCat", value);
    setInputCat(value);
  };

  const [preview, setPreview] = useState<string | null>(null);

  const handleInputImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(event, "event for image");
    if (file) {
      const previewURL = URL.createObjectURL(file);
      console.log("previewURL", previewURL);
      setPreview(previewURL);
      SetInputimage(file);
    }
  };

  const handleDeleteImg = async () => {
    setPreview(null);
    setShowPopUpDeleteImg(false);

    // เนื่องจากสถานะคงค้างข้างใน file ของ input image ทำให้ต้องมีการ set null อีกครั้ง
    SetInputimage(null);
    setImageEmpty(false);
  };

  const fetchService = async () => {
    try {
      const response = await axios.get(
        `/api/admin/management/selectedit/${id}`
      );
      console.log("test response fetching data", response.data);

      setNameTopic(response.data.service_name);
      setServiceCategoryData(response.data.categories.category);
      // setSubservices(response.data.sub_services);
      setFetchSubservices(
        response.data.sub_services.map(
          (subService: {
            description: string;
            unit: string;
            unit_price: number;
          }) => ({
            ...subService,
            unit_price:
              subService.unit_price === 0 ? "" : subService.unit_price,
          })
        )
      );
      console.log(
        "this test data response get sub_services",
        response.data.sub_services
      );
      setPreview(response.data.service_picture_url);
      setCreateAt(response.data.created_at);
      setUpdateAt(response.data.updated_at);
      setInputTitle(response.data.service_name);
      setInputCat(response.data.category_id);
      SetInputimage(response.data.service_picture_url);
      // console.log(
      //   "check refresh page for catrgories_id",
      //   response.data.categories_id
      // );
      setInputSubservice(response.data.sub_services);
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    if (id) {
      fetchCategories();
      fetchService();
    }
  }, [id]);

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px] bg-gray-100">
        <div className="flex flex-col w-[1120px] border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 py-12 px-7">
          {/* กล่องบน */}
          {/* ชื่อบริการ */}
          <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium relative">
            <label htmlFor="ชื่อบริการ">
              ชื่อบริการ
              <span className="text-red-600 text-lg absolute top-1">*</span>
            </label>
            <div>
              <input
                type="text"
                onChange={handleInputTitle}
                value={inputTitle.toString()}
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
          <div className="flex items-center justify-between w-[662px]  text-gray-500 font-medium relative">
            <label htmlFor="category">
              หมวดหมู่{" "}
              <span className="text-red-600 text-lg absolute top-1">*</span>
            </label>
            <Select
              onValueChange={(value: string) => {
                handleCategorySelect({
                  target: { value },
                } as React.ChangeEvent<HTMLSelectElement>);
              }}
            >
              <SelectTrigger className="w-[433px] pl-5 text-base font-normal h-[44px] text-black">
                <SelectValue placeholder={serviceCategoryData} />
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
          </div>

          <div className="flex flex-col gap-12">
            {/* Update Image */}
            <div className="flex items-start justify-between w-[662px] text-gray-500 font-medium ">
              <div className="relative">
                <label htmlFor="ชื่อบริการ" className="">
                  รูปภาพ
                  <span className="text-red-600 text-lg absolute -top-1">
                    *
                  </span>
                </label>
              </div>
              <div className="flex flex-col gap-2 w-[433px]">
                <div className="w-full flex items-center justify-center flex-col border-2 border-dashed border-gray-300 rounded-lg">
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
                          <div className="flex flex-row gap-2 text-sm -mt-2 text-gray-600">
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
            <div className="h-px w-full bg-gray-300"></div>
            {/* กล่องกลาง */}
            <div>
              <div className="">
                <h1 className="text-gray-500 font-medium">รายการบริการย่อย</h1>
                {fetchSubservices.map((subservice, index) => (
                  <AdminserviceEditSubService
                    key={index}
                    index={index}
                    subservice={subservice}
                    deleteSubservice={deleteSubservice}
                    updateSubservice={updateSubservice}
                    subServiceEmpty={subServiceEmpty}
                  />
                ))}
              </div>
              <div className="">
                <button
                  type="button"
                  className="bg-white text-defaultColor text-base h-10 flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 mt-7"
                  onClick={addSubService}
                >
                  เพิ่มรายการ
                  <span>
                    <IconPlusDefaultColor />
                  </span>
                </button>
              </div>
            </div>
            {/* กล่องล่าง */}
            <div className="h-px w-full bg-gray-300"></div>
            <div className="flex flex-row gap-5 w-[400px]">
              <div className="flex flex-col justify-between w-full gap-5 text-gray-500 font-medium">
                <div>สร้างเมื่อ</div>
                <div>แก้ไขล่าสุด</div>
              </div>
              <div className="flex flex-col justify-between w-full gap-5 ">
                <div className="flex gap-2">
                  <div>
                    {new Date(createAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  {new Date(createAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
                <div className="flex gap-2 ">
                  <div>
                    {new Date(updateAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </div>
                  {new Date(updateAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Popup for delete image */}
      <AdminDeletePopUp
        showPopUpDeleteImg={showPopUpDeleteImg}
        setShowPopUpDeleteImg={setShowPopUpDeleteImg}
        handleDeleteImg={handleDeleteImg}
        message="ยืนยันการลบรายการ ?"
        subMessage="ใช่หรือไม่"
        confirmationText="ลบรายการ"
        cancelAction="ยกเลิก"
      />
    </>
  );
};

// {showPopUpDeleteImg && (
//   <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
//       <div className="w-full">
//         <div
//           className="w-full flex justify-end "
//           onClick={() => setShowPopUpDeleteImg(false)}
//         >
//           <IconX />
//         </div>
//         <div className="flex justify-center">
//           <IconWarning />
//         </div>
//       </div>
//       <h1 className="font-medium text-xl ">ยืนยันการลบรายการ ?</h1>
//       <h1 className="text-center text-gray-500">
//         {/* คุณต้องการลบรายการ ‘{serviceName}’ <br /> */}
//         ใช่หรือไม่
//       </h1>
//       <div className="flex flex-row gap-3">
//         <button
//           className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
//           onClick={handleDeleteImg}
//         >
//           ลบรายการ
//         </button>
//         <button
//           className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
//           onClick={() => setShowPopUpDeleteImg(false)}
//         >
//           ยกเลิก
//         </button>
//       </div>
//     </div>
//   </div>
// )}
