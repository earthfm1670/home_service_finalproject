import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import OrderCard from "@/components/customer/orderCard";
import React, { useState } from "react";
import axios from "axios";
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
    id: "AD001",
    status: "รอดำเนินการ",
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
    id: "AD002",
    status: "กำลังดำเนินการ",
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

interface FetchedOrders {
  id: number;
  description: string;
  amount: number;
  total_price: number;
}
interface FetchedBooking {
  booking_id: string;
  user_name: string;
  scheduled_date: string;
  staff_name: string;
  status: string;
  order_list: FetchedOrders[];
}
interface FetchedData {
  data: FetchedBooking;
}

export default function customerOrderlist() {
  const [fetchOrder, setFetchOrder] = useState<FetchedBooking>({
    booking_id: "",
    user_name: "",
    scheduled_date: "",
    staff_name: "",
    status: "",
    order_list: [],
  });

  const fetchData = async () => {
    const respond: FetchedData = await axios.get("/api/customer/orderlist");
    if (respond) {
      setFetchOrder({
        booking_id: respond.data.booking_id,
        user_name: respond.data.user_name,
        scheduled_date: respond.data.scheduled_date,
        staff_name: respond.data.staff_name,
        status: respond.data.status,
        order_list: [...respond.data.order_list],
      });
    }
  };
  // const {
  //   booking_id: id,
  //   user_name: userName,
  //   scheduled_date,
  //   staff_name: staff,
  //   status,
  //   order_list: orders,
  // } = fetchOrder;

  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        รายการคำสั่งซ่อม
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:relative lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar />
        </div>
        <div className="small-banner flex lg:hidden justify-center items-center border rounded-lg mx-4 my-4 bg-blue-600 font-medium text-3xl text-white py-6">
          รายการคำสั่งซ่อม
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
