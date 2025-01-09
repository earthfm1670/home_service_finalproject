import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import IconX from "@/components/ui/IconX";
import IconCheck from "@/components/ui/IconCheck";
import { IconBath } from "@/components/ui/IconBath";
import { IconPercent } from "@/components/ui/IconPercent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelectorAdminPromotionCode } from "@/components/admin/admin-time-selector-promotioncode";
import { format } from "date-fns";
import { th } from "date-fns/locale"; // เพิ่มการ import locale ภาษาไทย

export default function AdminPromotionCodeAddIndex() {
  const [showPopUpSubmit, setShowPopUpSubmit] = useState<Boolean>(false);
  const [inputTitleCode, setInputTitleCode] = useState<string>();
  console.log("input category for check", inputTitleCode);
  const [inputLimitCode, setInputLimitCode] = useState<string>();
  const [inputPercentDiscount, setInputPercentDiscount] = useState<string | undefined>();
  console.log("inputPercentDiscount", inputPercentDiscount);
  const [isYesSelected, setIsYesSelected] = useState<boolean | null>(null); // กำหนดสถานะ Boolean
  const [selectedTime, setSelectedTime] = useState<string>(""); // กำหนดเป็น string แทน null
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const newInputData = {
        promotion_code: inputTitleCode,
      };
      console.log("new input data for create check", newInputData);

      // await axios.post(`/api/admin/management/create`, newInputData);
      await axios.post(`/api/admin/promotion/create`, newInputData, {
        headers: { "Content-Type": "application/json" },
      });
      // router.push("/adminpromotioncode");
      // setShowPopup(true);
      console.log("newInputData2", newInputData);
      setShowPopUpSubmit(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputCodeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitleCode(event.target.value);
  };
  const handleInputCodeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLimitCode(event.target.value);
  };

  const handleYesClick = () => {
    setIsYesSelected(true); // เมื่อเลือกปุ่ม "เอา"
  };

  const handleNoClick = () => {
    setIsYesSelected(false); // เมื่อเลือกปุ่ม "ไม่เอา"
  };

  const handleInputPercentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    setInputPercentDiscount(event.target.value); // อัปเดตค่าใน state
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time); // อัปเดตเวลาเมื่อเลือกใหม่
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
          <div>
            <AdminSidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <div className="flex flex-row items-center justify-between bg-white sticky top-0 h-20 px-10 py-5 min-w-[1200px] border-b  border-gray-300 z-10">
              <div className="text-xl">เพิ่มหมวดหมู่</div>
              <div className="h-full flex flex-row items-center gap-6 relative">
                <button
                  className=" bg-white text-defaultColor text-base h-full px-7 flex items-center gap-3 rounded-lg w-32 text-center justify-center border border-defaultColor"
                  onClick={() => router.push("/admincategory")}
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
            {/* AdminPromotionCodeAddPromotionCode */}
            <div>
              {/* พื้นหลัง */}
              <div className=" min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
                {/* กล่องใหญ่ */}
                <div className="flex flex-col w-[1120px] py-12 border bg-white border-gray-300 rounded-lg  gap-10 justify-center px-7 relative">
                  <div className="w-full bg-white flex gap-10 flex-col">
                    {/* Promotion Code InputTitle */}
                    <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
                      <label htmlFor="ชื่อบริการ">Promotion Code</label>
                      <input
                        type="text"
                        onChange={handleInputCodeTitle}
                        className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5 text-black font-normal"
                      />
                    </div>
                    {/* Promotion Code Selet Type */}
                    <div className="flex items-center justify-start w-[500px] text-gray-500 font-medium ">
                      <label htmlFor="ชื่อบริการ" className="min-w-[230px] ">
                        ประเภท
                      </label>
                      <div className="flex flex-col justify-between w-full gap-2">
                        {/* ปุ่ม "เอา" */}
                        <div className="hidden items-center justify-between relative">
                          <label
                            className="flex flex-row cursor-pointer"
                            onClick={handleYesClick}
                          >
                            {/* button for fix */}
                            <button
                              onClick={handleYesClick}
                              className={`${
                                isYesSelected === true
                                  ? "bg-blue-500"
                                  : "border-gray-200"
                              } w-5 h-5 rounded-full flex items-center justify-center border border-blue-400`}
                            >
                              <div
                                className={`${
                                  isYesSelected === true
                                    ? "bg-white"
                                    : "bg-transparent"
                                } w-1 h-1 rounded-full`}
                              />

                              {/* ตัวอักษร "Fixed" เปลี่ยนสีตามการเลือก */}
                            </button>
                            <h1
                              className={`text-sm pl-2 ${
                                isYesSelected === true
                                  ? "text-black"
                                  : "text-gray-400"
                              }`}
                            >
                              Fixed
                            </h1>
                          </label>
                          {/* input for number bath */}
                          <input
                            type="text"
                            className={`${
                              isYesSelected === true
                                ? "bg-white"
                                : "bg-gray-300"
                            } w-[140px] h-[42px]  pl-5 pr-10 border border-gray-300 rounded-md `}
                            disabled={isYesSelected === false} // ถ้าไม่เลือกจะไม่สามารถพิมพ์ได้
                          />
                          <div className="absolute left-[245px]">
                            <IconBath />
                          </div>
                        </div>

                        {/* ปุ่ม "ไม่เอา" */}
                        <div className="flex items-center justify-between relative">
                          <label
                            className="flex flex-row cursor-pointer"
                            onClick={handleNoClick}
                          >
                            <button
                              onClick={handleNoClick}
                              className={`${
                                isYesSelected === false
                                  ? "bg-blue-500"
                                  : "border-gray-200"
                              } w-5 h-5 rounded-full flex items-center justify-center border border-blue-400`}
                            >
                              <div
                                className={`${
                                  isYesSelected === false
                                    ? "bg-white"
                                    : "bg-transparent"
                                } w-1 h-1 rounded-full`}
                              />
                            </button>
                            <h1
                              className={`text-sm pl-2 ${
                                isYesSelected === false
                                  ? "text-black"
                                  : "text-gray-400"
                              }`}
                            >
                              Percent
                            </h1>
                          </label>
                          {/* input for number percent */}
                          <input
                            type="text"
                            className={`${
                              isYesSelected === false
                                ? "bg-white"
                                : "bg-gray-300"
                            } w-[140px] h-[42px] ml-4 pl-5 pr-10 border border-gray-300 rounded-md  appearance-none`}
                            disabled={isYesSelected === null} // ถ้าเลือก "เอา" จะไม่สามารถพิมพ์ได้
                            onChange={handleInputPercentChange}
                            value={inputPercentDiscount}
                          />
                          <div className="absolute left-[245px]">
                            <IconPercent />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* limit of usesage */}
                    <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium relative">
                      <label htmlFor="โควต้าการใช้">โควต้าการใช้</label>
                      <input
                        type="text"
                        onChange={handleInputCodeLimit}
                        className="border border-gray-300 h-11 rounded-lg w-[433px] pl-5 text-black font-normal"
                      />
                      <h1 className="absolute right-[10px] text-gray-400">
                        ครั้ง
                      </h1>
                    </div>
                    {/* end date */}
                    <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
                      <label htmlFor="วันหมดอายุ" className="">
                        วันหมดอายุ
                      </label>
                      {/* date */}
                      <div className="w-[433px] flex flex-row gap-6 ">
                        <div className="w-[205px]">
                          <Popover
                            open={isCalendarOpen}
                            onOpenChange={setIsCalendarOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between px-3 py-2 h-10 text-sm"
                                onClick={() => setIsCalendarOpen(true)}
                              >
                                <span className="truncate mr-2">
                                  {selectedDate
                                    ? format(selectedDate, "d MMMM yyyy", {
                                        locale: th,
                                      }) // แสดงวันที่ที่เลือก
                                    : ""}
                                </span>
                                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="bg-white  rounded-lg shadow-lg">
                              <Calendar
                                // mode="single"
                                // selected={selectedDate || undefined}
                                // onSelect={handleDateSelect}
                                // disabled={(date) => !isDateSelectable(date)}
                                // initialFocus
                                mode="single"
                                selected={selectedDate || undefined}
                                initialFocus
                                onSelect={(day) => {
                                  setSelectedDate(day ?? null); // กำหนดวันที่ที่เลือก
                                  setIsCalendarOpen(false); // ปิด Popover หลังจากเลือกวันที่
                                }}
                                disabled={(date) => date < new Date()} // ปิดวันที่ในอดีต
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <button className="w-[205px] absolute right-[428px]">
                          <TimeSelectorAdminPromotionCode
                            value={selectedTime} // ส่งค่าเวลา
                            onChange={handleTimeChange} // ส่งฟังก์ชันจัดการการเปลี่ยนแปลงเวลา
                            selectedDate={selectedDate} // ส่งค่าของวันที่เลือก
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* Popup */}
    </>
  );
}

// ----------------------------------------------------------------------------------------------

//  {/* Popup for submit */}
//  {showPopUpSubmit && (
//   <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
//     <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-3 gap-3 absolute">
//       <div className="w-full">
//         <div
//           className="w-full flex justify-end "
//           onClick={() => {
//             setShowPopUpSubmit(false);
//             window.location.reload();
//           }}
//         >
//           <IconX />
//         </div>
//         <div className="flex justify-center ">
//           <div className="bg-green-600 w-10 h-10 rounded-full mx-auto"></div>
//           <div className="absolute top-12">
//             <IconCheck />
//           </div>
//         </div>
//       </div>
//       <h1 className="font-medium text-xl ">สร้างรายการสำเร็จ</h1>
//       <h1 className="text-center text-gray-500">
//         {/* คุณต้องการลบรายการ ‘{serviceName}’ <br /> */}
//         กรุณากดยืนยันเพื่อกลับสู่หน้าหลัก ?
//       </h1>
//       <div className="flex flex-row gap-3 mb-2 mt-2">
//         <button
//           className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
//           // onClick={handleDeleteImg}
//           onClick={() => router.push("/admincategory")}
//         >
//           ยืนยัน
//         </button>
//       </div>
//     </div>
//   </div>
// )}
