// import Adminsidebar from "@/components/admin/adminsidebar";
// import { useEffect, useState } from "react";
// import { useServices } from "@/components/ServicesContext";
// import { useRouter } from "next/router";
// import { FormEvent } from "react";
// import axios from "axios";
// import IconPicture from "@/components/ui/IconPicture";
// import IconDrag from "@/components/ui/IconDragAddAdmin";
// import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";

// export default function AdminNavbar() {

//   const [inputSubservice, setInputSubservice] = useState<any[]>([
//     { description: "", unit: "", pricePerUnit: 0 },
//   ]);
//   const [inputTitle, setInputTitle] = useState("");
//   const [inputCat, setInputCat] = useState("");
//   const [inputImage, setInputImage] = useState("");

//   const router = useRouter();

//   //   <option value="general_service">บริการทั่วไป</option>
//   //   <option value="kitchen_service">บริการห้องครัว</option>
//   //   <option value="bathroom_service">บริการห้องน้ำ</option>

//   //   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   //     setInput(event.target.value);
//   //   };

//   const { id } = router.query;

//   const handleSubmit = async () => {
//     console.log("create new category");
//     let category_id = 0;

//     if (inputCat === "general_service") {
//       category_id = 2;
//     } else if (inputCat === "kitchen_service") {
//       category_id = 3;
//     } else if (inputCat === "bathroom_service") {
//       category_id = 4;
//     }

//     const newInputData = {
//       title: inputTitle,
//       category_id: category_id,
//       image: inputImage,
//       subService: inputSubservice,
//     };

//     try {
//       await axios.put(`/api/admin/management/edit/${id}`, newInputData);
//       router.push("/adminservice")
//     } catch {}

//     // คุณอาจใส่ logic เพิ่มเพื่อส่ง `newInputData` ผ่าน API
//     console.log(newInputData); // ทดสอบการสร้างข้อมูล
//   };

// //   useEffect(() => {
// // const refresh=() {
// //   await axios.
// // }
// //   },[])

//   return (
//     <>
//       <div className="flex flex-row w-full">
//         <div>
//           <Adminsidebar />
//         </div>
//         <div className="w-full flex flex-col">
//           {/* navbar for admin page */}
//           <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
//             <div className="text-xl">เพิ่มบริการ</div>
//             <div className="h-full flex flex-row items-center gap-6 relative">
//               <button
//                 className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
//                 onClick={() => router.push("/adminservice")}
//               >
//                 ยกเลิก
//               </button>
//               <button
//                 className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
//                 onClick={handleSubmit}
//               >
//                 ยืนยัน
//               </button>
//             </div>
//           </div>
//           <AdminserviceIndex
//             input={setInputSubservice}
//             inputtitle={setInputTitle}
//             inputcat={setInputCat}
//             inputimage={setInputImage}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

// // ----------------------------------------------------------------------------------------------

// export const AdminserviceIndex = ({
//   input,
//   inputtitle,
//   inputcat,
//   inputimage,
// }: any) => {
//   const router = useRouter();

//   // ดึงข้อมูลจาก Context
//   // สร้าง state เพื่อมารับข้อมูล service

//   // สร้าง state มาส่งข้อมูล
//   const [title, setTitle] = useState<string>("");
//   const [category_id, setCategory_id] = useState<string>("");
//   const [image, setImage] = useState<string>("");
//   const [subService, setSubService] = useState<string>("");

//   // State เพื่อจัดการข้อมูล subservice
//   const [subservices, setSubservices] = useState<any[]>([
//     { description: "", unit: "", pricePerUnit: 0 },
//   ]);

//   input(subservices);

//   const addSubService = () => {
//     setSubservices((prevSubservices) => [
//       ...prevSubservices,
//       { description: "", unit: "", pricePerUnit: 0 },
//     ]);
//   };

//   // const { id } = router.query; // ดึง dynamic route parameter
//   // const { getServicesData, servicesData } = useServices();
//   // const [serviceDetail, setServiceDetail] = useState(null);

//   // // รอจนกว่า servicesData จะถูกโหลด
//   // useEffect(() => {
//   //   if (servicesData && id) {
//   //     const service = servicesData.find((item) => item.id === id);
//   //     setServiceDetail(service || null);
//   //   }
//   // }, [servicesData, id]);

//   // // หากยังไม่มีข้อมูล servicesData
//   // useEffect(() => {
//   //   if (!servicesData || servicesData.length === 0) {
//   //     getServicesData(); // โหลดข้อมูลจาก API หาก Context ยังไม่มีข้อมูล
//   //   }
//   // }, []);

//   const deleteSubservice = (index: number) => {
//     // ลบรายการตาม index
//     const updatedSubservices = subservices.filter((_, idx) => idx !== index);
//     setSubservices(updatedSubservices);
//   };

//   const updateSubservice = (
//     index: number,
//     field: string,
//     value: string | number
//   ) => {
//     setSubservices((prevSubservices) => {
//       const updatedSubservices = [...prevSubservices];
//       updatedSubservices[index] = {
//         ...updatedSubservices[index],
//         [field]: value,
//       };
//       return updatedSubservices;
//     });
//   };

//   const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
//     inputtitle(event.target.value);
//   };

//   inputcat(category_id);

//   const handleInputImg = (event: React.ChangeEvent<HTMLInputElement>) => {
//     inputimage(event.target.value);
//   };

//   return (
//     <>
//       <form className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
//         <div className="flex flex-col w-[1120px] border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 py-12 px-7">
//           {/* กล่องบน */}
//           {/* ชื่อบริการ */}
//           <div className="w-full bg-white ">
//             <div className="flex items-center justify-between w-[662px]">
//               <label htmlFor="ชื่อบริการ">ชื่อบริการ</label>
//               <input
//                 type="text"
//                 onChange={handleInputTitle}
//                 className="border border-gray-300 h-11 rounded-lg w-[433px] pl-10"
//               />
//             </div>
//           </div>

//           {/* หมวดหมู่ */}
//           <div className="flex items-center justify-between w-[662px]">
//             <label htmlFor="category">หมวดหมู่</label>
//             <div className="relative w-[433px]">
//               <select
//                 id="category"
//                 className="border border-gray-300 h-11 rounded-lg w-full px-5  appearance-none" // ลบลูกศรเดิมและเพิ่ม padding ขวา
//                 value={category_id}
//                 onChange={(e) => setCategory_id(e.target.value)}
//               >
//                 <option value="">เลือกหมวดหมู่</option>
//                 <option value="general_service">บริการทั่วไป</option>
//                 <option value="kitchen_service">บริการห้องครัว</option>
//                 <option value="bathroom_service">บริการห้องน้ำ</option>
//               </select>
//               {/* ลูกศร */}
//               <span className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 pointer-events-none">
//                 &#9662;
//               </span>
//             </div>
//           </div>

//           {/* update image */}
//           <div className=" flex flex-col gap-12">
//             {/* ข้อความ */}
//             <div className="flex items-start justify-between w-[662px]">
//               <label htmlFor="ชื่อบริการ" className="">
//                 รูปภาพ
//               </label>
//               <div className="">
//                 <div className="w-[433px] flex gap-4 items-center justify-center flex-col p-4 border-2 border-dashed border-gray-300 rounded-lg">
//                   {/* SVG รูปภาพ */}
//                   <IconPicture />

//                   {/* ฟอร์มเลือกไฟล์ */}
//                   <div className="flex flex-col">
//                     <div className="flex flex-row gap-2">
//                       <label
//                         htmlFor="file-upload"
//                         className="cursor-pointer text-blue-500 hover:text-blue-700 underline"
//                       >
//                         อัพโหลดภาพ
//                       </label>
//                       <p className="text-gray-600 text-center mb-4">หรือ</p>
//                       <p className="text-gray-600 text-center mb-4">
//                         ลากและวางที่นี้
//                       </p>
//                     </div>
//                     <div className="flex flex-row gap-2">
//                       <p className="text-gray-600 text-center mb-4">PNG</p>
//                       <p className="text-gray-600 text-center mb-4">,</p>
//                       <p className="text-gray-600 text-center mb-4">JPG</p>
//                       <p className="text-gray-600 text-center mb-4">
//                         ขนาดไม่เกิน
//                       </p>
//                       <p className="text-gray-600 text-center mb-4">5MB</p>
//                     </div>

//                     <input
//                       type="file"
//                       id="file-upload"
//                       accept="image/png, image/jpeg"
//                       className="hidden"
//                       onChange={handleInputImg} // ฟังก์ชันที่ใช้ในการจัดการไฟล์ที่เลือก
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="h-[1] w-full bg-gray-300"></div>
//             {/* กล่องล่าง */}
//             <div>
//               <div className="">
//                 <h1>รายการรับผิดชอบ</h1>
//                 {subservices.map((subservice, index) => (
//                   <AddSubService
//                     key={index}
//                     index={index}
//                     subservice={subservice}
//                     deleteSubservice={deleteSubservice}
//                     updateSubservice={updateSubservice}
//                   />
//                 ))}
//               </div>
//               <div className="">
//                 <button
//                   type="button"
//                   className=" bg-white text-defaultColor text-base h-10  flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 "
//                   onClick={addSubService}
//                 >
//                   เพิ่มรายการ
//                   <span>
//                     <IconPlusDefaultColor />
//                   </span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// // --------------------------------------------------------------------------

// export function AddSubService({
//   index,
//   subservice,
//   deleteSubservice,
//   updateSubservice,
// }: {
//   index: number;
//   subservice: {
//     description: string;
//     unit: string;
//     pricePerUnit: number;
//   };
//   deleteSubservice: (index: number) => void;
//   updateSubservice: (
//     index: number,
//     field: "description" | "unit" | "pricePerUnit",
//     value: string | number
//   ) => void;
// }) {
//   return (
//     <>
//       {/* sub service */}
//       <div className="flex flex-row justify-between">
//         <div className="mt-14">
//           <IconDrag />
//         </div>

//         <div className="flex flex-col py-6">
//           <label htmlFor={`subserviceName-${index}`}>ชื่อบริการ</label>
//           <input
//             type="text"
//             id={`subserviceName-${index}`}
//             value={subservice.description}
//             onChange={(e) =>
//               updateSubservice(index, "description", e.target.value)
//             }
//             className="border border-gray-300 h-11 rounded-lg w-[422px] pl-10"
//           />
//         </div>
//         <div className="flex flex-col py-6">
//           <label htmlFor={`subservicePrice-${index}`}>
//             ค่าบริการ / 1 หน่วย
//           </label>
//           <input
//             type="number"
//             id={`subservicePrice-${index}`}
//             // value={subservice.pricePerUnit}
//             onChange={(e) =>
//               updateSubservice(index, "pricePerUnit", e.target.value)
//             }
//             className="border border-gray-300 h-11 rounded-lg w-[240px] pl-10"
//           />
//         </div>
//         <div className="flex flex-col py-6">
//           <label htmlFor={`subserviceUnit-${index}`}>หน่วยการบริการ</label>
//           <input
//             type="text"
//             id={`subserviceUnit-${index}`}
//             value={subservice.unit}
//             onChange={(e) => updateSubservice(index, "unit", e.target.value)}
//             className="border border-gray-300 h-11 rounded-lg w-[240px] pl-10"
//           />
//         </div>
//         <h1
//           className="mt-14 active:text-[#FF6347] cursor-pointer"
//           onClick={() => deleteSubservice(index)}
//         >
//           ลบรายการ
//         </h1>
//       </div>
//     </>
//   );
// }

//--------------------------------------------------------------------

// import Adminsidebar from "@/components/admin/adminsidebar";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";
// import IconPicture from "@/components/ui/IconPicture";
// import IconDrag from "@/components/ui/IconDragAddAdmin";
// import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";
// import { useServices } from "@/components/ServicesContext";

// export default function AdminNavbar() {
//   const [inputSubservice, setInputSubservice] = useState<any[]>([
//     { description: "", unit: "", pricePerUnit: 0 },
//   ]);
//   const [inputTitle, setInputTitle] = useState("");
//   const [inputCat, setInputCat] = useState("");
//   const [inputImage, setInputImage] = useState("");
//   const router = useRouter();
//   const { id } = router.query;

//   const { getServicesData, servicesData } = useServices();
//   // console.log(servicesData, 1);
//   const [serviceList, setServicesList] = useState<any[]>(
//     servicesData || []
//   );

//   // เรียกข้อมูลเมื่อเกิดการ refresh window
//   useEffect(() => {
//     if (servicesData) {
//       setServicesList(servicesData);
//     }
//   }, [servicesData]);

//   // ฟังก์ชันที่รวมทั้งหมดไว้
//   const handleSubmit = async () => {
//     console.log("create new category");
//     let category_id = 0;

//     if (inputCat === "general_service") {
//       category_id = 2;
//     } else if (inputCat === "kitchen_service") {
//       category_id = 3;
//     } else if (inputCat === "bathroom_service") {
//       category_id = 4;
//     }

//     const newInputData = {
//       title: inputTitle,
//       category_id: category_id,
//       image: inputImage,
//       subService: inputSubservice,
//     };

//     try {
//       await axios.put(`/api/admin/management/edit/${id}`, newInputData);
//       router.push("/adminservice");
//     } catch (error) {
//       console.error("Error updating category:", error);
//     }

//     console.log(newInputData);
//   };

//   // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input
//   const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setInputTitle(event.target.value);
//   };

//   const handleInputCat = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setInputCat(event.target.value);
//   };

//   const handleInputImg = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setInputImage(event.target.value);
//   };

//   // ฟังก์ชันจัดการ Subservices
//   const addSubService = () => {
//     setInputSubservice((prev) => [
//       ...prev,
//       { description: "", unit: "", pricePerUnit: 0 },
//     ]);
//   };

//   const updateSubservice = (
//     index: number,
//     field: "description" | "unit" | "pricePerUnit",
//     value: string | number
//   ) => {
//     setInputSubservice((prevSubservices) => {
//       const updatedSubservices = [...prevSubservices];
//       updatedSubservices[index] = {
//         ...updatedSubservices[index],
//         [field]: value,
//       };
//       return updatedSubservices;
//     });
//   };

//   const deleteSubservice = (index: number) => {
//     const updatedSubservices = inputSubservice.filter(
//       (_, idx) => idx !== index
//     );
//     setInputSubservice(updatedSubservices);
//   };

//   return (
//     <>
//       <div className="flex flex-row w-full">
//         <div>
//           <Adminsidebar />
//         </div>
//         <div className="w-full flex flex-col">
//           {/* navbar for admin page */}
//           <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b border-gray-300 z-10">
//             <div className="text-xl">เพิ่มบริการ</div>
//             <div className="h-full flex flex-row items-center gap-6 relative">
//               <button
//                 className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
//                 onClick={() => router.push("/adminservice")}
//               >
//                 ยกเลิก
//               </button>
//               <button
//                 className=" bg-defaultColor text-white text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center "
//                 onClick={handleSubmit}
//               >
//                 ยืนยัน
//               </button>
//             </div>
//           </div>

//           <form className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
//             <div className="flex flex-col w-[1120px] border bg-white border-gray-300 rounded-lg overflow-x-auto gap-10 py-12 px-7">
//               {/* ชื่อบริการ */}
//               <div className="w-full bg-white ">
//                 <div className="flex items-center justify-between w-[662px]">
//                   <label htmlFor="ชื่อบริการ">ชื่อบริการ</label>
//                   <input
//                     type="text"
//                     value={inputTitle}
//                     onChange={handleInputTitle}
//                     className="border border-gray-300 h-11 rounded-lg w-[433px] pl-10"
//                   />
//                 </div>
//               </div>

//               {/* หมวดหมู่ */}
//               <div className="flex items-center justify-between w-[662px]">
//                 <label htmlFor="category">หมวดหมู่</label>
//                 <div className="relative w-[433px]">
//                   <select
//                     id="category"
//                     value={inputCat}
//                     onChange={handleInputCat}
//                     className="border border-gray-300 h-11 rounded-lg w-full px-5  appearance-none"
//                   >
//                     <option value="">เลือกหมวดหมู่</option>
//                     <option value="general_service">บริการทั่วไป</option>
//                     <option value="kitchen_service">บริการห้องครัว</option>
//                     <option value="bathroom_service">บริการห้องน้ำ</option>
//                   </select>
//                   <span className="absolute top-1/2 right-5 transform -translate-y-1/2 text-gray-400 pointer-events-none">
//                     &#9662;
//                   </span>
//                 </div>
//               </div>

//               {/* รูปภาพ */}
//               <div className=" flex flex-col gap-12">
//                 <div className="flex items-start justify-between w-[662px]">
//                   <label htmlFor="image">รูปภาพ</label>
//                   <div className="w-[433px] flex gap-4 items-center justify-center flex-col p-4 border-2 border-dashed border-gray-300 rounded-lg">
//                     <IconPicture />
//                     <div className="flex flex-col">
//                       <div className="flex flex-row gap-2">
//                         <label
//                           htmlFor="file-upload"
//                           className="cursor-pointer text-blue-500 hover:text-blue-700 underline"
//                         >
//                           อัพโหลดภาพ
//                         </label>
//                         <p className="text-gray-600 text-center mb-4">หรือ</p>
//                         <p className="text-gray-600 text-center mb-4">
//                           ลากและวางที่นี้
//                         </p>
//                       </div>
//                       <div className="flex flex-row gap-2">
//                         <p className="text-gray-600 text-center mb-4">PNG</p>
//                         <p className="text-gray-600 text-center mb-4">,</p>
//                         <p className="text-gray-600 text-center mb-4">JPG</p>
//                         <p className="text-gray-600 text-center mb-4">
//                           ขนาดไม่เกิน
//                         </p>
//                         <p className="text-gray-600 text-center mb-4">5MB</p>
//                       </div>

//                       <input
//                         type="file"
//                         id="file-upload"
//                         accept="image/png, image/jpeg"
//                         className="hidden"
//                         onChange={handleInputImg}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="h-[1] w-full bg-gray-300"></div>

//                 {/* รายการ subservice */}
//                 <div>
//                   <h1>รายการรับผิดชอบ</h1>
//                   {inputSubservice.map((subservice, index) => (
//                     <div key={index} className="flex flex-row justify-between">
//                       <div className="mt-14">
//                         <IconDrag />
//                       </div>

//                       <div className="flex flex-col py-6">
//                         <label htmlFor={`subserviceName-${index}`}>
//                           ชื่อบริการ
//                         </label>
//                         <input
//                           type="text"
//                           id={`subserviceName-${index}`}
//                           value={subservice.description}
//                           onChange={(e) =>
//                             updateSubservice(
//                               index,
//                               "description",
//                               e.target.value
//                             )
//                           }
//                           className="border border-gray-300 h-11 rounded-lg w-[422px] pl-10"
//                         />
//                       </div>
//                       <div className="flex flex-col py-6">
//                         <label htmlFor={`subservicePrice-${index}`}>
//                           ค่าบริการ
//                         </label>
//                         <input
//                           type="number"
//                           id={`subservicePrice-${index}`}
//                           value={subservice.pricePerUnit}
//                           onChange={(e) =>
//                             updateSubservice(
//                               index,
//                               "pricePerUnit",
//                               +e.target.value
//                             )
//                           }
//                           className="border border-gray-300 h-11 rounded-lg w-[150px] pl-10"
//                         />
//                       </div>
//                       <div className="flex flex-col py-6">
//                         <label htmlFor={`subserviceUnit-${index}`}>หน่วย</label>
//                         <input
//                           type="text"
//                           id={`subserviceUnit-${index}`}
//                           value={subservice.unit}
//                           onChange={(e) =>
//                             updateSubservice(index, "unit", e.target.value)
//                           }
//                           className="border border-gray-300 h-11 rounded-lg w-[150px] pl-10"
//                         />
//                       </div>
//                       <div className="flex items-center justify-center">
//                         <h1
//                           className="mt-14 active:text-[#FF6347] cursor-pointer"
//                           onClick={() => deleteSubservice(index)}
//                         >
//                           ลบรายการ
//                         </h1>
//                       </div>
//                     </div>
//                   ))}

//                   <button
//                     type="button"
//                     className=" bg-white text-defaultColor text-base h-10  flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 "
//                     onClick={addSubService}
//                   >
//                     เพิ่มรายการ
//                     <span>
//                       <IconPlusDefaultColor />
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }


import Adminsidebar from "@/components/admin/adminsidebar";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import axios from "axios";
import IconPicture from "@/components/ui/IconPicture";
import IconDrag from "@/components/ui/IconDragAddAdmin";
import IconPlusDefaultColor from "@/components/ui/IconPluseDefaultColor";

export default function AdminNavbar() {

  // const [inputSubservice, setInputSubservice] = useState<any[]>([
  //   { description: "", unit: "", pricePerUnit: 0 },
  // ]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputCat, setInputCat] = useState("");
  const [inputImage, setInputImage] = useState("");

  const router = useRouter();


  const handleSubmit = async () => {
    console.log("create new category");
    let category_id = 0;

    if (inputCat === "general_service") {
      category_id = 2;
    } else if (inputCat === "kitchen_service") {
      category_id = 3;
    } else if (inputCat === "bathroom_service") {
      category_id = 4;
    }

    const newInputData = {
      title: inputTitle,
      category_id: category_id,
      image: inputImage,
      // subService: inputSubservice,
    };

    try {
      await axios.post(`/api/admin/management/create${id}`);
      router.push("/adminservice")
    } catch {}

    // คุณอาจใส่ logic เพิ่มเพื่อส่ง `newInputData` ผ่าน API
    console.log(newInputData); // ทดสอบการสร้างข้อมูล
  };

    const { id } = router.query; // ดึง dynamic route parameter
  const { getServicesData, servicesData } = useServices();
  const [serviceDetail, setServiceDetail] = useState(null);

  // รอจนกว่า servicesData จะถูกโหลด
  useEffect(() => {
    if (servicesData && id) {
      const service = servicesData.find((item) => item.id === id);
      setServiceDetail(service || null);
    }
  }, [servicesData, id]);

  // หากยังไม่มีข้อมูล servicesData
  useEffect(() => {
    if (!servicesData || servicesData.length === 0) {
      getServicesData(); // โหลดข้อมูลจาก API หาก Context ยังไม่มีข้อมูล
    }
  }, []);


  return (
    <>
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
                onClick={handleSubmit}
              >
                สร้าง
              </button>
            </div>
          </div>
          {/* <AdminserviceIndex
            input={setInputSubservice}
            inputtitle={setInputTitle}
            inputcat={setInputCat}
            inputimage={setInputImage}
          /> */}


        </div>
      </div>
    </>
  );
}
