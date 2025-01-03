import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import axios from "axios";
import IconPicture from "@/components/ui/IconPicture";
import IconDrag from "@/components/ui/IconDragAddAdmin";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
import { stringify } from "querystring";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconWarning from "@/components/ui/Iconwarning";
import IconX from "@/components/ui/IconX";
import Image from "next/image";

interface SubService {
  description: string;
  unit: string;
  unit_price: number;
}

export default function AdminNavbar() {
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([]);
  console.log(
    "check subservice id and value of subservice when refresh window",
    inputSubservice
  );
  const modifyInputSubservice = () => {
    const updatedSubservices = inputSubservice.map((subservice) => ({
      ...subservice,
      unit_price: subservice.unit_price ?? 0, // กำหนดค่า unit_price เป็น 0 ถ้าเป็น null
    }));
    setInputSubservice(updatedSubservices);
  };
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputCat, setInputCat] = useState<number | undefined>();
  // console.log("this test for receive value inputCat", inputCat);
  const [inputImage, setInputImage] = useState<File>();
  // console.log("check image when update", inputImage);
  const [nameTopic, setNameTopic] = useState<String>("loading");
  const [URLimage, setURLimage] = useState<String>();
  // const [changeImage,setChangeImage] = useState<Boolean>(false)
  const [showPopUpSubmit, setShowPopUpSubmit] = useState<Boolean>(false);
  const [showPopUpDeleteImg, setShowPopUpDeleteImg] = useState<Boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    // formData.append("service_id", id: Number)

    const serviceId = Array.isArray(id) ? id[0] : id; // เลือกค่าตัวแรกจากอาร์เรย์ ถ้า id เป็นอาร์เรย์

    if (serviceId) {
      formData.append("service_id", serviceId.toString()); // แปลงเป็น string ถ้าไม่ใช่
    }

    formData.append("title", inputTitle);
    if (inputCat) {
      formData.append("category_id", inputCat.toString());
    }

    if (inputImage) {
      formData.append("image", inputImage);
    }

    formData.append("subservices", JSON.stringify(inputSubservice));

    console.log("FormData contents:");
    let formDataObject: { [key: string]: any } = {};
    for (let [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }

    console.log(
      "test data for sent request by form data.append",
      formDataObject
    );

    // Commented out API call
    // try {
    //   await axios.put(`/api/admin/management/edit/${id}`, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    //   router.push("/adminservice");
    //   console.log("fromdata2", formData);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // // ตัวอย่างการเรียกใช้ modifyInputSubservice
  // useEffect(() => {
  //   modifyInputSubservice(); // เรียกใช้ฟังก์ชัน
  // }, [inputSubservice]); // เรียกใช้เมื่อ inputSubservice เปลี่ยนแปลง

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
          <div>
            <AdminSidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
              <div
                className="flex flex-row items-center cursor-pointer"
                onClick={() => router.push("/adminservice")}
              >
                <ArrowBack />
                <div className="flex flex-col">
                  <div className="text-xs">บริการ</div>
                  <div className="text-xl font-medium">{nameTopic}</div>
                </div>
              </div>
              <div className="h-full flex flex-row items-center gap-6 relative">
                {/* <button
                  className="bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
                  onClick={() => router.push("/adminservice")}
                  type="button"
                >
                  ยกเลิก
                </button> */}
                <button
                  className="bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center"
                  onClick={() => router.push(`/adminservice/edit/${id}`)}
                >
                  แก้ไข
                </button>
              </div>
            </div>
            <AdminserviceIndex
              setInputSubservice={setInputSubservice}
              setInputTitle={setInputTitle}
              setInputCat={setInputCat}
              SetInputimage={setInputImage}
              setURLimage={setURLimage}
              setNameTopic={setNameTopic}
              setShowPopUpDeleteImg={setShowPopUpDeleteImg}
              showPopUpDeleteImg={showPopUpDeleteImg}
              inputTitle={inputTitle}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export const AdminserviceIndex = ({
  setInputSubservice,
  setInputTitle,
  setInputCat,
  SetInputimage,
  setURLimage,
  setNameTopic,
  setShowPopUpDeleteImg,
  showPopUpDeleteImg,
  inputTitle,
}: any) => {
  const router = useRouter();
  const { id } = router.query;

  const [category_id, setCategory_id] = useState<string>("");
  const [subservices, setSubservices] = useState<any[]>([]);

  // setInputSubservice(subservices)
  useEffect(() => {
    // ตรวจสอบและกำหนด unit_price ให้เป็น 0 ถ้าค่าเป็น null
    const updatedSubservices = subservices.map((subservice) => ({
      ...subservice,
      unit_price: subservice.unit_price === null ? 0 : subservice.unit_price,
    }));

    // ส่งข้อมูลที่อัปเดตไปที่ setInputSubservice
    setInputSubservice(updatedSubservices);
  }, [subservices]); // เมื่อ subservices เปลี่ยนแปลง จะทำการอัพเดท

  const [dataParams, setDataParams] = useState();
  const [serviceNameData, setServiceNameData] = useState<String>("");
  const [serviceCategoryData, setServiceCategoryData] = useState<String>();
  const [fetchDataCategories, setFetchDataCategories] = useState<any>([]);
  const [createAt, setCreateAt] = useState<string>(new Date().toISOString());
  const [updateAt, setUpdateAt] = useState<string>(new Date().toISOString());

  const addSubService = () => {
    setSubservices((prevSubservices) => [
      ...prevSubservices,
      { description: "", unit: "", unit_price: null },
    ]);
  };

  const deleteSubservice = (index: number) => {
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
    // setServiceNameData(event.target.value);
    setInputTitle(event.target.value);
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
    // try {
    //   const response = await axios.delete(`/api/delete-image`, {
    //     params: { serviceId: id },
    //   });

    //   console.log("Image deleted successfully", response.data);
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     // AxiosError: จัดการข้อผิดพลาดที่เกิดจาก axios
    //     if (error.response) {
    //       console.error("Error response from server:", error.response.data);
    //     } else if (error.request) {
    //       console.error("No response received:", error.request);
    //     } else {
    //       console.error("Unexpected Axios error:", error.message);
    //     }
    //   } else {
    //     // Unknown error: จัดการกรณีที่ไม่ใช่ข้อผิดพลาดของ axios
    //     console.error("An unknown error occurred:", error);
    //   }
    // }
  };

  const fetchService = async () => {
    try {
      const response = await axios.get(
        `/api/admin/management/selectedit/${id}`
      );
      console.log("test response fetching data", response.data);
      setDataParams(response.data);
      setServiceNameData(response.data.service_name);
      setNameTopic(response.data.service_name);
      setServiceCategoryData(response.data.categories.category);
      setSubservices(
        response.data.sub_services.map(
          (subService: {
            description: string;
            unit: string;
            unit_price: number;
          }) => ({
            ...subService,
            unit_price:
              subService.unit_price === 0 ? null : subService.unit_price,
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
          {/* ชื่อบริการ */}
          <div className="w-full bg-white ">
            <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
              <label htmlFor="ชื่อบริการ">ชื่อบริการ</label>
              <div className="border-gray-300 h-11 rounded-lg w-[433px]  text-black font-normal items-center flex">
                {inputTitle.toString()}
              </div>
            </div>
          </div>

          {/* หมวดหมู่ */}
          <div className="flex items-center justify-between w-[662px]  text-gray-500 font-medium">
            <label htmlFor="category">หมวดหมู่</label>
            <div className="border-gray-300 h-11 rounded-lg w-[433px]  text-black font-normal items-center flex">
              {serviceCategoryData}
            </div>
            {/* <Select
              onValueChange={(value: string) => {
                handleCategorySelect({
                  target: { value },
                } as React.ChangeEvent<HTMLSelectElement>);
              }}
            >
              <SelectTrigger className="w-[433px] text-base font-normal h-[44px] text-black">
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
            </Select> */}
          </div>

          <div className="flex flex-col gap-12">
            {/* Update Image */}
            <div className="flex items-start justify-between w-[662px] text-gray-500 font-medium">
              <label htmlFor="ชื่อบริการ" className="">
                รูปภาพ
              </label>
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
                              className="cursor-pointer text-blue-500"
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
                        <div></div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">
                      ขนาดภาพที่แนะนำ: 1440 x 225
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px w-full bg-gray-300"></div>
            {/* กล่องกลาง */}
            <div>
              <div className="">
                <h1 className="text-gray-500 font-medium mb-5">
                  รายการบริการย่อย
                </h1>
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
              {/* <div className="">
                <button
                  type="button"
                  className="bg-white text-defaultColor text-base h-10 flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 mt-3"
                  onClick={addSubService}
                >
                  เพิ่มรายการ
                  <span>
                    <IconPlusDefaultColor />
                  </span>
                </button>
              </div> */}
            </div>
            {/* กล่องล่าง */}
            <div className="h-px w-full bg-gray-300 -mt-8"></div>
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
            <h1 className="font-medium text-xl ">ยืนยันการลบรายการ ?</h1>
            <h1 className="text-center text-gray-500">
              {/* คุณต้องการลบรายการ ‘{serviceName}’ <br /> */}
              ใช่หรือไม่
            </h1>
            <div className="flex flex-row gap-3">
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
    unit_price: number;
  };

  deleteSubservice: (index: number) => void;
  updateSubservice: (
    index: number,
    field: "description" | "unit" | "unit_price",
    value: string | number
  ) => void;
}) {
  return (
    <>
      {/* sub service */}
      <div className="flex flex-row justify-between w-[980px]">
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceName-${index}`}
            className="text-sm text-gray-600"
          >
            ชื่อบริการ
          </label>
          {/* <input
            type="text"
            id={`subserviceName-${index}`}
            value={subservice.description}
            onChange={(e) =>
              updateSubservice(index, "description", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[422px] pl-5"
          /> */}
          <div className="border-gray-300 h-11 rounded-lg w-[422px] items-center flex">
            {subservice.description}
          </div>
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subservicePrice-${index}`}
            className="text-sm text-gray-600"
          >
            ค่าบริการ / 1 หน่วย
          </label>
          {/* <input
            type="number"
            id={`subservicePrice-${index}`}
            value={subservice.unit_price !== null ? subservice.unit_price : ""}
            onChange={(e) =>
              updateSubservice(index, "unit_price", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          /> */}
          <div className="border-gray-300 h-11 rounded-lg w-[240px] items-center flex">
            {subservice.unit_price}
          </div>
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceUnit-${index}`}
            className="text-sm text-gray-600"
          >
            หน่วยการบริการ
          </label>
          {/* <input
            type="text"
            id={`subserviceUnit-${index}`}
            value={subservice.unit}
            onChange={(e) => updateSubservice(index, "unit", e.target.value)}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          /> */}
          <div className="border-gray-300 h-11 rounded-lg w-[240px] items-center flex">
            {subservice.unit}
          </div>
        </div>
      </div>
    </>
  );
}

export function ArrowBack() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.0007 31.6667L13.334 20L25.0007 8.33337"
        stroke="#646C80"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
