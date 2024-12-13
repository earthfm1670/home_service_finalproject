import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import OrderCard from "@/components/customer/orderCard";
import React from "react";
interface Orders {
  description: string;
  type: string;
  amount: number;
  unit: string;
}
interface CustomerOrder {
  id: string;
  status: string;
  date: string;
  time: string;
  staff: string;
  totalPrice: number;
  orders: Orders[];
}
const orderlist: CustomerOrder[] = [
  {
    id: "AD003",
    status: "ดำเนินการสำเร็จ",
    date: "25/04/2563",
    time: "13.00",
    staff: "สมาน ยอดเยี่ยม",
    totalPrice: 15000,
    orders: [
      {
        description: "ล้างแอร์ 9000 - 18000 BTU",
        type: "ติดผนัง",
        amount: 2,
        unit: "เครื่อง",
      },
      {
        description: "ล้างแอร์ 9000 - 18000 BTU",
        type: "ติดผนัง",
        amount: 2,
        unit: "เครื่อง",
      },
    ],
  },
  {
    id: "AD004",
    status: "ดำเนินการสำเร็จ",
    date: "25/04/2563",
    time: "13.00",
    staff: "สมาน ยอดเยี่ยม",
    totalPrice: 15000,
    orders: [
      {
        description: "ล้างแอร์ 9000 - 18000 BTU",
        type: "ติดผนัง",
        amount: 2,
        unit: "เครื่อง",
      },
    ],
  },
];
export default function customerHistory() {
  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        ประวัติการสั่งซ่อม
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar />
        </div>
        <div className="small-banner flex lg:hidden justify-center items-center border rounded-lg mx-4 my-4 bg-blue-600 font-medium text-3xl text-white py-6">
          ประวัติการสั่งซ่อม
        </div>
        <div className="content flex flex-col justify-center items-center w-full min-h-96 mt-1 pb-7 lg:pt-7 lg:ml-60">
          {orderlist.map(
            ({ id, status, date, time, staff, totalPrice, orders }) => {
              return (
                <OrderCard
                  key={id}
                  id={id}
                  status={status}
                  date={date}
                  time={time}
                  staff={staff}
                  totalPrice={totalPrice}
                  orders={orders}
                />
              );
            }
          )}
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
