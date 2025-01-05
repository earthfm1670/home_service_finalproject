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

interface ButtonComponentProps {
  status: string;
}

const mockData = [
  {
    id: "AD1022103",
    date: "31/12/2024",
    status: "กำลังดำเนินการ",
    statusColor: "text-orange-400",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 Fordland Road, Benton Tower",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ติดตั้งแอร์",
        amount: "1",
        price_total: "3000",
      },
    ],
  },
  {
    id: "AD3027103",
    date: "25/12/2024",
    status: "รอดำเนินการ",
    statusColor: "text-red-500",
    name: "Ms. Scarlet Witch",
    email: "scarlet@avengers.io",
    address: "100 Hex Road, Mystical Plaza",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ทำความสะอาดทั่วไป",
        amount: "2",
        price_total: "1000",
      },
      {
        category: "บริการทั่วไป",
        service_name: "ซ่อมเครื่องซักผ้า",
        amount: "1",
        price_total: "800",
      },
    ],
  },
  {
    id: "AD9185463",
    date: "30/12/2024",
    status: "ดำเนินการสำเร็จ",
    statusColor: "text-green-400",
    name: "Mr. Alexander Pierce",
    email: "pierce@shield.io",
    address: "33 Fordland Road, Impossible Tower",
    service: [
      {
        category: "บริการห้องครัว",
        service_name: "ติดตั้งเตาแก๊ส",
        amount: "1",
        price_total: "1500",
      },
    ],
  },
  {
    id: "AD2456103",
    date: "15/11/2024",
    status: "กำลังดำเนินการ",
    statusColor: "text-orange-400",
    name: "Ms. Natasha Romanoff",
    email: "blackwidow@shield.io",
    address: "789 Covert Lane, Blackout District",
    service: [
      {
        category: "บริการห้องน้ำ",
        service_name: "ติดตั้งชักโครก",
        amount: "1",
        price_total: "2000",
      },
      {
        category: "บริการทั่วไป",
        service_name: "ล้างเครื่องบิน",
        amount: "1",
        price_total: "8000",
      },
    ],
  },
  {
    id: "AD6754102",
    date: "01/01/2025",
    status: "รอดำเนินการ",
    statusColor: "text-red-500",
    name: "Mr. Tony Stark",
    email: "ironman@starkindustries.io",
    address: "10880 Malibu Point, New York",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ซ่อมแอร์",
        amount: "1",
        price_total: "3000",
      },
      {
        category: "บริการทั่วไป",
        service_name: "ติดตั้งแอร์",
        amount: "1",
        price_total: "4000",
      },
      {
        category: "บริการห้องครัว",
        service_name: "ติดตั้งเตาแก๊ส",
        amount: "1",
        price_total: "3500",
      },
    ],
  },
  {
    id: "AD7895132",
    date: "20/12/2024",
    status: "ดำเนินการสำเร็จ",
    statusColor: "text-green-400",
    name: "Mr. Steve Rogers",
    email: "cap@avengers.io",
    address: "100 Shield Road, Brooklyn",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ติดตั้งเครื่องดูดควัน",
        amount: "1",
        price_total: "5000",
      },
      {
        category: "บริการห้องน้ำ",
        service_name: "ติดตั้งชักโครก",
        amount: "1",
        price_total: "3000",
      },
    ],
  },
  {
    id: "AD4563019",
    date: "10/12/2024",
    status: "กำลังดำเนินการ",
    statusColor: "text-orange-400",
    name: "Mr. Bruce Banner",
    email: "hulk@avengers.io",
    address: "Gamma Lab, Avengers Tower",
    service: [
      {
        category: "บริการห้องครัว",
        service_name: "ติดตั้งเตาแก๊ส",
        amount: "1",
        price_total: "3500",
      },
      {
        category: "บริการทั่วไป",
        service_name: "ทำความสะอาดทั่วไป",
        amount: "1",
        price_total: "500",
      },
    ],
  },
  {
    id: "AD1112223",
    date: "05/12/2024",
    status: "รอดำเนินการ",
    statusColor: "text-red-500",
    name: "Ms. Wanda Maximoff",
    email: "wanda@avengers.io",
    address: "Hex Village, Sokovia",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ซ่อมเครื่องซักผ้า",
        amount: "2",
        price_total: "3000",
      },
      {
        category: "บริการทั่วไป",
        service_name: "ล้างเครื่องบิน",
        amount: "1",
        price_total: "8000",
      },
    ],
  },
  {
    id: "AD3102114",
    date: "28/12/2024",
    status: "ดำเนินการสำเร็จ",
    statusColor: "text-green-400",
    name: "Ms. Carol Danvers",
    email: "captain@marvel.io",
    address: "Starforce HQ, Hala",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ทำความสะอาดทั่วไป",
        amount: "1",
        price_total: "500",
      },
      {
        category: "บริการห้องครัว",
        service_name: "ติดตั้งเตาแก๊ส",
        amount: "1",
        price_total: "2500",
      },
    ],
  },
  {
    id: "AD7841224",
    date: "22/12/2024",
    status: "กำลังดำเนินการ",
    statusColor: "text-orange-400",
    name: "Mr. Peter Parker",
    email: "spiderman@avengers.io",
    address: "Queens, New York",
    service: [
      {
        category: "บริการทั่วไป",
        service_name: "ซ่อมแอร์",
        amount: "1",
        price_total: "2000",
      },
      {
        category: "บริการห้องครัว",
        service_name: "ติดตั้งเครื่องดูดควัน",
        amount: "1",
        price_total: "3000",
      },
    ],
  },
];

const ButtonComponent: React.FC<ButtonComponentProps> = ({ status }) => (
  <button
    className={`px-8 py-2 text-sm md:text-base font-medium transition-all duration-700 ease-in-out text-white ${
      status === "รอดำเนินการ"
        ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        : status === "กำลังดำเนินการ"
        ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
        : ""
    } rounded-md shadow-md disabled:bg-gray-400 transition duration-150 ease-in-out`}
  >
    {status === "รอดำเนินการ"
      ? "ตกลง ดำเนินการ"
      : status === "กำลังดำเนินการ"
      ? "ดำเนินการ สำเร็จ"
      : ""}
  </button>
);

const HandymanComponent: React.FC = () => {
  const [list, setList] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState(mockData);

  const router = useRouter();

  const handleLogOut = (value: string) => {
    if (value === "logout") {
      router.push("/");
    }
  };

  const handleSelectList = (listStatus: boolean) => {
    setList(listStatus);
    if (listStatus) {
      setFilteredData(
        mockData.filter(
          (service) =>
            service.status === "กำลังดำเนินการ" ||
            service.status === "รอดำเนินการ"
        )
      );
    } else {
      setFilteredData(
        mockData.filter((service) => service.status === "ดำเนินการสำเร็จ")
      );
    }
  };
  useEffect(() => {
    handleSelectList(list);
  }, [list]);

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
        <nav>
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
                คุณ สมควร คงควรคอย
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
        <aside className="flex lg:hidden bg-[#001C59] w-screen h-12 sticky top-0 justify-between text-white">
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
            {filteredData.map((service) => (
              <AccordionItem key={service.id} value={service.id}>
                <AccordionTrigger className="justify-around lg:text-xl md:text-lg transition-all duration-700 ease-in-out font-normal h-20 px-10 py-5 hover:no-underline focus:no-underline hover:bg-blue-50">
                  <h1>{service.id}</h1>
                  <h1 className="tracking-widest">{service.date}</h1>
                  <h1 className={service.statusColor}>{service.status}</h1>
                </AccordionTrigger>
                <AccordionContent className="w-full sm:max-h-[420px] lg:max-h-[540px] overflow-y-auto flex flex-col px-10 rounded-lg shadow-lg lg:text-lg md:text-base transition-all duration-700 ease-in-out">
                  <div className="flex justify-evenly py-6">
                    <div className="flex flex-col px-2 space-y-4 text-gray-800 flex-1">
                      <span className="pb-2 font-medium flex justify-center text-gray-500">
                        <h1 className="px-2 py-1 sm:px-12 sm:py-2 flex justify-center items-center text-center rounded-full shadow-md transition-all duration-700 ease-in-out">
                          รายละเอียดผู้ให้บริการ
                        </h1>
                      </span>
                      <div className="flex flex-col items-center">
                        <span className="space-y-4 ">
                          <h1 className="pt-4 ">Name : {service.name}</h1>
                          <h1>Phone / Email : {service.email}</h1>
                          <h1>Address : {service.address}</h1>
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
                      {service.service.map((detail, index) => (
                        <div
                          key={index}
                          className="flex flex-col space-y-4 sm:px-2 md:px-4 lg:px-8 xl:px-20 2xl:px-32 text-gray-800 transition-all duration-700 ease-in-out"
                        >
                          <h1 className="pt-4 ">บริการ : {detail.category}</h1>
                          <h1>
                            รายการ : {detail.service_name} จำนวน {detail.amount}{" "}
                            รายการ
                          </h1>
                          <h1 className="font-medium  pb-1 border-solid border-b-2 border-gray-100">
                            รวม : {detail.price_total} ฿
                          </h1>
                        </div>
                      ))}
                      <div className="hidden sm:flex justify-center pt-2">
                        {service.status !== "ดำเนินการสำเร็จ" && (
                          <ButtonComponent status={service.status} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:hidden flex justify-center pt-2">
                    {service.status !== "ดำเนินการสำเร็จ" && (
                      <ButtonComponent status={service.status} />
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
