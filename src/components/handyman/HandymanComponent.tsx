import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import homeservicelogo from "../../../public/image/homeservicelogo.svg";
import Image from "next/image";
import { List, ListCheck, LogOut, EllipsisVertical } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

interface ButtonComponentProps {
  status: string;
  booking_id: string;
  fetchData: () => void;
}

interface BookingStatus {
  status_name: string;
}

interface User {
  name: string;
  email: string | null;
  phone_number: string;
}

interface Order {
  amount: number;
  order_price: number;
  sub_services: {
    unit: string;
    services: { service_name: string };
    unit_price: number;
    description: string;
  };
  sub_services_id: number;
}

interface BookingDetail {
  service_name: string;
  sub_service_description: string;
  amount: number;
  sub_service_unit_price: number;
  sub_service_unit: string;
  order_price: number;
}
interface Booking {
  id: number;
  booking_id: string;
  booked_at: string;
  completed_at: string | null;
  in_progress_at: string | null;
  booking_status: BookingStatus;
  total_price: number;
  address: string | null;
  users: User;
  staff_name: string;
  bookingDetail: BookingDetail[];
  order_list: Order[];
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  status,
  booking_id,
  fetchData,
}) => {
  const handleClick = async () => {
    let status_id;
    let completedTime: string | undefined;
    let inProgressTime: string | undefined;
    if (status === "รอดำเนินการ") {
      status_id = 2;
      inProgressTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      });
    } else if (status === "กำลังดำเนินการ") {
      status_id = 3;
      completedTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
      });
    }
    if (status_id) {
      try {
        await axios.patch(`/api/handyman`, {
          booking_id: booking_id,
          status_id: status_id,
          completed_at: completedTime,
          inProgress_at: inProgressTime,
        });
        fetchData();
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };
  return (
    <button
      onClick={handleClick}
      className={`px-8 py-2 text-sm md:text-base font-medium transition-all duration-700 ease-in-out text-white ${
        status === "รอดำเนินการ"
          ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
          : status === "กำลังดำเนินการ"
          ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
          : ""
      } rounded-md shadow-md disabled:bg-gray-400 transition duration-150 ease-in-out`}
    >
      {" "}
      {status === "รอดำเนินการ"
        ? "ตกลง ดำเนินการ"
        : status === "กำลังดำเนินการ"
        ? "ดำเนินการ สำเร็จ"
        : ""}{" "}
    </button>
  );
};

const HandymanComponent: React.FC = () => {
  const [list, setList] = useState<boolean>(true);
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [filteredData, setFilteredData] = useState(bookingsData);
  const router = useRouter();
  // const { isLoggedIn, isStaff, isAdmin, authState } = useAuth();

  // console.log("AuthState:", authState.user?.user_metadata);
  // console.log("LogIn:", isLoggedIn);
  // console.log("Staff:", isStaff);
  // console.log("Admin:", isAdmin);

  // if (!isLoggedIn) {
  //   return <div>กรุณาเข้าสู่ระบบ</div>;
  // }
  // if (!isStaff) {
  //   return <div>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</div>;
  // }

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API

  const fetchData = async () => {
    try {
      const response = await axios.get(`api/handyman`);

      // ตรวจสอบว่าข้อมูลที่ได้รับเป็นอาร์เรย์
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setBookingsData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogOut = (value: string) => {
    if (value === "logout") {
      router.push("/");
    }
  };

  const handleSelectList = (listStatus: boolean) => {
    setList(listStatus);
    if (listStatus) {
      setFilteredData(
        bookingsData
          .filter(
            (booking) =>
              booking.booking_status.status_name === "กำลังดำเนินการ" ||
              booking.booking_status.status_name === "รอดำเนินการ"
          )
          .sort((a, b) => b.booking_id.localeCompare(a.booking_id))
      );
    } else {
      setFilteredData(
        bookingsData
          .filter(
            (booking) =>
              booking.booking_status.status_name === "ดำเนินการสำเร็จ"
          )
          .sort((a, b) => {
            if (a.completed_at && b.completed_at) {
              return (
                new Date(b.completed_at).getTime() -
                new Date(a.completed_at).getTime()
              ); // เรียงลำดับตามเวลาล่าสุด
            }
            return 0;
          })
      );
    }
  };

  useEffect(() => {
    handleSelectList(list);
  }, [list, bookingsData]);

  return (
    <section className="flex flex-col lg:flex-row bg-gray-100">
      <aside className="hidden lg:flex flex-col bg-[#001C59] min-w-60 h-screen sticky top-0 justify-between text-white transition-all duration-700 ease-in-out">
        <div className="w-full">
          <div className="px-6">
            <button className="my-10 bg-blue-100 w-full h-11 flex justify-center items-center rounded-lg hover:bg-hoverColor active:bg-pressedColor">
              <Image src={homeservicelogo} alt="Homeservice Logo" />
            </button>
          </div>
          <div className="">
            <div
              className={`${
                list ? "bg-[#022B87]" : "hover:bg-blue-900"
              } w-full transition duration-500`}
            >
              <button
                className="flex flex-row gap-4 px-6 py-4 w-full"
                onClick={() => handleSelectList(true)}
              >
                <List />
                รายการ
              </button>
            </div>
            <div
              className={`${
                !list ? "bg-[#022B87]" : "hover:bg-blue-900"
              } w-full transition duration-500`}
            >
              <button
                className="flex flex-row gap-4 px-6 py-4 w-full"
                onClick={() => handleSelectList(false)}
              >
                <ListCheck />
                ประวัติรายการ
              </button>
            </div>
          </div>
        </div>
        <div className="hover:bg-[#022B87] w-full my-16">
          <button
            className="flex flex-row gap-4 px-6 py-4"
            onClick={() => {
              router.push("/");
            }}
          >
            <LogOut />
            ออกจากระบบ
          </button>
        </div>
      </aside>
      <article className="flex flex-col w-full">
        <nav className="sticky top-0 z-10">
          <div className="flex items-center justify-between bg-white h-20 px-10 py-5 border-b border-gray-300">
            <div className="hidden lg:block text-xl">
              บริการ / ประวัติรายการ
            </div>
            <div className="lg:hidden flex items-center gap-2">
              <button className=" my-10 w-full h-11 flex justify-center items-center rounded-lg hover:bg-hoverColor active:bg-pressedColor">
                <Image src={homeservicelogo} alt="Homeservice Logo" />
              </button>
            </div>
            <div className="flex h-20 py-5 gap-2">
              <h3 className=" text-gray-700 font-medium text-sm lg:text-base h-full px-2 lg:px-4 flex items-center rounded-lg transition-all duration-700 ease-in-out">
                John Lennon
              </h3>
              <Image
                src="https://frqdeijtcguxcozmpucc.supabase.co/storage/v1/object/public/profile_pictures/UserProfile-handyman.png?t=2024-12-26T09%3A46%3A42.414Z"
                alt="User Profile"
                width={40}
                height={70}
              />
              <span className="flex items-center lg:hidden">
                {/* <EllipsisVertical color="#878282" /> */}
                <Select onValueChange={handleLogOut}>
                  <SelectTrigger className="border-none shadow-none focus:ring-0 relative text-transparent">
                    <SelectValue placeholder="" />
                    <div className="absolute  top-1/2 transform -translate-y-1/2 text-gray-500">
                      <EllipsisVertical />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value="logout"
                        className="!bg-[#022B87] !text-white p-2"
                      >
                        <h1 className="flex items-center gap-2 cursor-pointer">
                          <LogOut /> ออกจากระบบ
                        </h1>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </span>
            </div>
          </div>
        </nav>
        <aside className="flex lg:hidden bg-[#001C59] w-screen h-12 sticky top-20 justify-between text-white">
          <div className="flex w-screen">
            <div
              className={`${
                list ? "bg-[#022B87]" : "hover:bg-blue-900"
              } flex items-center w-full transition duration-500`}
            >
              <button
                className="flex flex-row justify-center px-6 py-4 w-full gap-2"
                onClick={() => handleSelectList(true)}
              >
                <List />
                รายการ
              </button>
            </div>
            <div
              className={`${
                !list ? "bg-[#022B87]" : "hover:bg-blue-900"
              } flex items-center w-full transition duration-500`}
            >
              <button
                className="flex flex-row justify-center px-6 py-4 w-full gap-2"
                onClick={() => handleSelectList(false)}
              >
                <ListCheck />
                ประวัติรายการ
              </button>
            </div>
          </div>
        </aside>
        <div>
          <Accordion type="single" collapsible className="w-full bg-white">
            {filteredData.map((booking) => (
              <AccordionItem
                key={booking.booking_id}
                value={booking.booking_id}
              >
                <AccordionTrigger className="justify-around lg:text-xl md:text-lg transition-all duration-700 ease-in-out font-normal h-20 px-10 py-5 hover:no-underline focus:no-underline hover:bg-blue-50">
                  <h1>{booking.booking_id}</h1>
                  <h1 className="tracking-widest">
                    {booking.booked_at.slice(0, 10)}
                  </h1>
                  <h1
                    className={
                      booking.booking_status.status_name === "ดำเนินการสำเร็จ"
                        ? "text-green-400"
                        : booking.booking_status.status_name === "รอดำเนินการ"
                        ? "text-red-500"
                        : booking.booking_status.status_name ===
                          "กำลังดำเนินการ"
                        ? "text-orange-400"
                        : ""
                    }
                  >
                    {" "}
                    {booking.booking_status.status_name}
                  </h1>
                </AccordionTrigger>
                <AccordionContent className="w-full sm:max-h-[420px] lg:max-h-[540px] overflow-y-auto flex flex-col px-10 rounded-lg shadow-lg lg:text-lg md:text-base transition-all duration-700 ease-in-out">
                  <div className="flex justify-evenly py-6">
                    <div className="flex flex-col px-2 space-y-4 text-gray-800 flex-1">
                      <span className="pb-2 font-medium flex justify-center text-gray-500">
                        <h1 className="px-2 py-1 sm:px-12 sm:py-2 flex justify-center items-center text-center rounded-full shadow-md transition-all duration-700 ease-in-out">
                          รายละเอียดผู้ใช้บริการ
                        </h1>
                      </span>
                      <div className="flex flex-col items-center">
                        <span className="space-y-4 ">
                          <h1 className="pt-4 ">Name : {booking.users.name}</h1>
                          <h1>Phone : {booking.users.phone_number}</h1>
                          <h1>Email : {booking.users.email}</h1>
                          <h1>Address : {booking.address}</h1>
                        </span>
                      </div>
                    </div>
                    <span className="mx-2 border-solid border-l-4 rounded-sm border-gray-300"></span>
                    <div className="flex-col space-y-4 px-2 flex-1">
                      <span className="pb-2 px-4 font-medium flex justify-center text-gray-500">
                        <h1 className="px-2 py-1 sm:px-12 sm:py-2 flex justify-center items-center text-center rounded-full shadow-md transition-all duration-700 ease-in-out">
                          รายละเอียดบริการ
                        </h1>
                      </span>
                      <div className="md:px-4 lg:px-8 xl:px-20 2xl:px-32">
                        {booking.booking_status.status_name ===
                        "กำลังดำเนินการ" ? (
                          <h1 className="w-auto px-3 py-1 font-medium text-center text-white bg-orange-400 rounded-2xl">
                            เริ่มดำเนินการ{" "}
                            {booking.in_progress_at?.slice(0, 10)} เวลา{" "}
                            {booking.in_progress_at?.slice(11, 19)} น.
                          </h1>
                        ) : (
                          ""
                        )}
                        {booking.booking_status.status_name ===
                        "ดำเนินการสำเร็จ" ? (
                          <h1 className="w-auto px-3 py-1 font-medium text-center text-white bg-green-400 rounded-2xl">
                            ดำเนินการสำเร็จ {booking.completed_at?.slice(0, 10)}{" "}
                            เวลา {booking.completed_at?.slice(11, 19)} น.
                          </h1>
                        ) : (
                          ""
                        )}
                      </div>
                      {booking.order_list.map((detail, index) => (
                        <div
                          key={index}
                          className="flex flex-col space-y-4 sm:px-2 md:px-4 lg:px-8 xl:px-20 2xl:px-32 text-gray-800 transition-all duration-700 ease-in-out"
                        >
                          <h1 className="pt-4 ">
                            บริการ : {detail.sub_services.services.service_name}
                          </h1>
                          <h1>
                            รายการ : {detail.sub_services.description} จำนวน{" "}
                            {detail.amount} {detail.sub_services.unit}
                          </h1>
                          <h1 className="font-medium  pb-1 border-solid border-b-2 border-gray-100">
                            รวม : {detail.order_price} ฿
                          </h1>
                        </div>
                      ))}
                      <div className="hidden sm:flex justify-center pt-2">
                        {booking.booking_status.status_name !==
                          "ดำเนินการสำเร็จ" && (
                          <ButtonComponent
                            status={booking.booking_status.status_name}
                            booking_id={booking.booking_id}
                            fetchData={fetchData}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:hidden flex justify-center pt-2">
                    {booking.booking_status.status_name !==
                      "ดำเนินการสำเร็จ" && (
                      <ButtonComponent
                        status={booking.booking_status.status_name}
                        booking_id={booking.booking_id}
                        fetchData={fetchData}
                      />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </article>
    </section>
  );
};

export default HandymanComponent;
