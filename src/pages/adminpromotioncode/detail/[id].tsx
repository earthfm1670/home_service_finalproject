import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { format } from "date-fns";
import { AdminPromotionDetailNavbar } from "@/components/admin-promotion/detail/adminPromotionDetailNavbar";

export default function AdminPromotionCodeAddIndex() {
  // input for sent name of code discount
  const [inputTitleCode, setInputTitleCode] = useState<string>("");
  //   console.log("input title code for check", inputTitleCode);

  const [inputPercentDiscount, setInputPercentDiscount] = useState<
    number | null
  >(null);
  //   console.log("inputPercentDiscount", inputPercentDiscount);

  // set number of time to use
  const [inputLimitCode, setInputLimitCode] = useState<number | null>();
  console.log("inputLimitCode", inputLimitCode);

  // select expiration date
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  //   console.log("selectedEndDate", selectedEndDate);

  // select expiration time
  const [selectedTime, setSelectedTime] = useState<string>(""); // กำหนดเป็น string แทน null
  //   console.log("selectedTime", selectedTime);

  // nameTopic for navbar
  const [nameTopic, setNameTopic] = useState<string>("loading");

  // fetch data for show create and last update date
  const [createdAtDatePromotion, setCreatedAtDatePromotion] =
    useState<string>("");
  const [updatedAtDatePromotion, setUpdatedAtDatePromotion] =
    useState<string>("");

  // fetch usage limit
  const [ussagePool, setUsagePool] = useState<string>();

  const router = useRouter();

  // before sent data to .post must change decimal of number
  let NumberTodecimal = null;
  if (
    inputPercentDiscount != null &&
    typeof inputPercentDiscount === "number"
  ) {
    NumberTodecimal = inputPercentDiscount / 100;
  }
  // console.log("numberTodecimal", NumberTodecimal);

  const { id } = router.query;

  const FetchPromotionCode = async () => {
    try {
      const response = await axios.get(
        `/api/admin/promotions/selectedit/${id}`
      );
      console.log("test response fetching data", response.data.data);
      setNameTopic(response.data.data.promotion_code);
      setInputTitleCode(response.data.data.promotion_code);
      setInputPercentDiscount(response.data.data.discount_value * 100);
      setInputLimitCode(response.data.data.usage_limit);

      // Set the date and time
      const endDate = new Date(response.data.data.end_at);

      // ตั้งค่าเป็นวันที่แบบ LocalTime
      setSelectedEndDate(endDate);

      // ใช้ date-fns เพื่อแปลงเป็น HH:mm (24 ชั่วโมง)
      const formattedTime = format(endDate, "HH:mm"); // เช่น "15:30"
      setSelectedTime(formattedTime);

      // fetch date created and last updated
      setCreatedAtDatePromotion(response.data.data.created_at);
      setUpdatedAtDatePromotion(response.data.data.lastupdated_at);

      // fetch usesage limit
      setUsagePool(response.data.data.usage_pool);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      FetchPromotionCode();
    }
  }, [id]);

  return (
    <>
      <form>
        <div className="flex flex-row w-full">
          <div>
            <AdminSidebar />
          </div>
          <div className="w-full flex flex-col">
            {/* navbar for admin page */}
            <AdminPromotionDetailNavbar nameTopic={nameTopic} id={id}/>

            {/* AdminPromotionCodeAddPromotionCode */}

            {/* พื้นหลัง */}
            <div className=" min-h-screen w-full flex flex-col justify-start items-center py-12 min-w-[1200px]  bg-gray-100 gap-5">
              {/* กล่องใหญ่ */}
              <div className="flex flex-col w-[1120px] py-12 border bg-white border-gray-300 rounded-lg  justify-center px-7 relative ">
                <div className="w-full bg-white flex gap-10 flex-col">
                  {/* Promotion Code InputTitle */}
                  <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
                    <label htmlFor="ชื่อบริการ">Promotion Code</label>
                    <div>
                      <div className="w-[433px] text-black font-normal">
                        {inputTitleCode}
                      </div>
                    </div>
                  </div>
                  {/* Promotion Code Selet Type */}
                  <div className="flex items-center justify-start w-[500px] text-gray-500 font-medium ">
                    <label htmlFor="ชื่อบริการ" className="min-w-[230px] ">
                      ประเภท
                    </label>
                    <div className="text-black font-normal">Percent</div>
                  </div>
                  <div className="flex items-center justify-start w-[500px] text-gray-500 font-medium ">
                    <label htmlFor="ชื่อบริการ" className="min-w-[230px] ">
                      ราคาที่ลด
                    </label>
                    <div className=" font-normal flex flex-row tiems center gap-3 text-red-600">
                      -{inputPercentDiscount}.00%
                    </div>
                  </div>

                  {/* limit of usesage */}
                  <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium relative">
                    <label htmlFor="โควต้าการใช้">โควต้าการใช้</label>
                    <div className="w-[433px] text-black font-normal">
                      {ussagePool}/{inputLimitCode} ครั้ง
                    </div>
                  </div>

                  {/* popup for select date */}
                  <div className="flex items-center justify-between w-[662px] text-gray-500 font-medium">
                    <label htmlFor="วันหมดอายุ" className="">
                      วันหมดอายุ
                    </label>
                    <div className="w-[433px] text-black font-normal">
                      {selectedEndDate
                        ? `${new Date(selectedEndDate).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )} ${new Date(selectedEndDate).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}`
                        : "ไม่ระบุวันที่"}
                    </div>
                  </div>
                  <div className="h-px w-full bg-gray-300 mb-10"></div>
                  <div className="flex flex-row gap-[57px] w-[400px]">
                    <div className="flex flex-col justify-between w-full gap-5 text-gray-500 font-medium">
                      <div>สร้างเมื่อ</div>
                      <div>แก้ไขล่าสุด</div>
                    </div>
                    <div className="flex flex-col justify-between w-full gap-5">
                      <div className="flex gap-2">
                        <div>
                          {new Date(createdAtDatePromotion).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </div>
                        {new Date(createdAtDatePromotion).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </div>
                      <div className="flex gap-2">
                        <div>
                          {new Date(updatedAtDatePromotion).toLocaleDateString(
                            "th-TH",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </div>
                        {new Date(updatedAtDatePromotion).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

// ----------------------------------------------------------------------------------------------
