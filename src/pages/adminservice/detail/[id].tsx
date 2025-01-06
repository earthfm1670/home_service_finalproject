import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AdminserviceDetailNavbar } from "@/components/adminservice/detail/adminserviceDetailNavbar";

interface SubService {
  description: string;
  unit: string;
  unit_price: number;
}

export default function AdminserviceDetailIndex() {
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([]);
  console.log(
    "check subservice id and value of subservice when refresh window",
    inputSubservice
  );
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputCat, setInputCat] = useState<number | undefined>();
  // console.log("this test for receive value inputCat", inputCat);
  const [inputImage, setInputImage] = useState<File>();
  // console.log("check image when update", inputImage);
  const [nameTopic, setNameTopic] = useState<string>("loading");
  const [URLimage, setURLimage] = useState<String>();
  // const [changeImage,setChangeImage] = useState<Boolean>(false)
  const [showPopUpDeleteImg, setShowPopUpDeleteImg] = useState<Boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <form>
        <div className="flex flex-row w-full">
          <div>
            <AdminSidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <AdminserviceDetailNavbar 
            nameTopic={nameTopic} 
            id={id} />
            <AdminserviceDetailService
              setInputSubservice={setInputSubservice}
              setInputTitle={setInputTitle}
              setInputCat={setInputCat}
 
              setNameTopic={setNameTopic}

              inputTitle={inputTitle}
            />
          </div>
        </div>
      </form>
    </>
  );
}

export const AdminserviceDetailService = ({
  setInputSubservice,
  setInputTitle,
  setInputCat,
  setNameTopic,
  inputTitle,
}: any) => {
  const router = useRouter();
  const { id } = router.query;

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




  const [preview, setPreview] = useState<string | null>(null);

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
                      <div></div>
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
                  <AdminserviceDetailSubService
                    key={index}
                    index={index}
                    subservice={subservice}
                  />
                ))}
              </div>
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
    </>
  );
};

export function AdminserviceDetailSubService({
  index,
  subservice,
}: {
  index: number;
  subservice: {
    description: string;
    unit: string;
    unit_price: number;
  };

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
          <div className="border-gray-300 h-11 rounded-lg w-[240px] items-center flex">
            {subservice.unit}
          </div>
        </div>
      </div>
    </>
  );
}
