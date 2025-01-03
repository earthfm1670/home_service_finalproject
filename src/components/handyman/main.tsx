import React, { useEffect, useState } from "react";
import homeservicelogo from "../../../public/image/homeservicelogo.svg";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const serviceData = [
  {
    id: "AD1022103",
    date: "31 / 12 / 2024",
    status: "กำลังดำเนินการ",
    statusColor: "text-orange-400",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 fordland road Impossible Tower",
  },
  {
    id: "AD3027103",
    date: "25 / 12 / 2024",
    status: "รอดำเนินการ",
    statusColor: "text-red-500",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 fordland road Impossible Tower",
  },
  {
    id: "AD2033202",
    date: "27 / 12 / 2024",
    status: "กำลังดำเนินการ",
    statusColor: "text-orange-400",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 fordland road Impossible Tower",
  },
  {
    id: "AD5567795",
    date: "21 / 12 / 2024",
    status: "รอดำเนินการ",
    statusColor: "text-red-500",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 fordland road Impossible Tower",
  },
  {
    id: "AD9185463",
    date: "30 / 12 / 2024",
    status: "ดำเนินการสำเร็จ",
    statusColor: "text-green-400",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 fordland road Impossible Tower",
  },
  {
    id: "AD8795631",
    date: "28 / 12 / 2024",
    status: "ดำเนินการสำเร็จ",
    statusColor: "text-green-500",
    name: "Mr. Jack Richer",
    email: "Richer@mission.io",
    address: "33 fordland road Impossible Tower",
  },
];

const Main: React.FC = () => {
  const [list, setList] = useState<Boolean>(true);
  const [filteredData, setFilteredData] = useState(serviceData);
  const handleSelectList = (listStatus: Boolean) => {
    setList(listStatus);
    if (listStatus) {
      setFilteredData(
        serviceData.filter(
          (service) =>
            service.status === "กำลังดำเนินการ" ||
            service.status === "รอดำเนินการ"
        )
      );
    } else {
      setFilteredData(
        serviceData.filter((service) => service.status === "ดำเนินการสำเร็จ")
      );
    }
  };
  useEffect(() => {
    handleSelectList(list);
  }, []);

  return (
    <section className="flex flex-col lg:flex-row">
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
                {/* <Icon1 /> */}
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
                {/* <Icon2 /> */}
                ประวัติรายการ
              </button>
            </div>
          </div>
        </div>
        <div className="hover:bg-[#022B87] w-full my-16">
          <button className="flex flex-row gap-4 px-6 py-4">
            {/* <Icon4 /> */}
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
              {/* <div className="h-20 py-5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-blue-500 text-white text-base h-full px-4 flex items-center gap-3 rounded-lg"
                    >
                      Menu
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="min-w-60">
                    <div className="grid gap-4">
                      <div className="flex flex-col">
                        <div className="">
                          <h1 className="">รายการ</h1>
                          <h1>ประวัติรายการ</h1>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div> */}
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
                className="flex flex-row justify-center px-6 py-4 w-full"
                onClick={() => handleSelectList(true)}
              >
                {/* <Icon1 /> */}
                รายการ
              </button>
            </div>
            <div
              className={`${
                !list ? "bg-[#022B87]" : "hover:bg-blue-900"
              } flex items-center w-full transition duration-500`}
            >
              <button
                className="flex flex-row justify-center px-6 py-4 w-full"
                onClick={() => handleSelectList(false)}
              >
                {/* <Icon2 /> */}
                ประวัติรายการ
              </button>
            </div>
          </div>
        </aside>
        <div>
          <Accordion type="single" collapsible className="w-full">
            {filteredData.map((service) => (
              <AccordionItem key={service.id} value={service.id}>
                <AccordionTrigger className="justify-around lg:text-xl md:text-lg transition-all duration-700 ease-in-out font-normal h-20 px-10 py-5 hover:no-underline focus:no-underline">
                  <h1>{service.id}</h1> <h1>{service.date}</h1>
                  <h1 className={service.statusColor}>{service.status}</h1>
                </AccordionTrigger>
                <AccordionContent className="mx-10">
                  <h1 className="text-lg px-10 py-8">Name : {service.name}</h1>
                  <h1 className="text-lg px-10 py-8">
                    Phone / Email : {service.email}
                  </h1>
                  <h1 className="text-lg px-10 py-8">
                    Address : {service.address}
                  </h1>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </article>
    </section>
  );
};

export default Main;
