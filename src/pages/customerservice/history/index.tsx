import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import OrderCard from "@/components/customer/orderCard";
import React, { useEffect, useState } from "react";
import { FetchedBooking, Respond } from "../orderlist";
import axios from "axios";
import SkeletonCardRender from "@/components/customer/cardSkeletonRender";

export default function CustomerHistory() {
  const [fetchOrder, setFetchOrder] = useState<FetchedBooking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    console.log("history fetching--------------------------------------------");
    console.log(fetchOrder);
    try {
      const respond: Respond = await axios.get("/api/customer/history");
      if (respond) {
        console.log(
          "history respond-----------------------------------------------"
        );
        setIsLoading(false); //fix to false
        setFetchOrder(respond.data.data);
        console.log(respond.data.data);
      }
    } catch (err) {
      console.log("Fetch data error");
      console.log(err);
      setIsLoading(false); //fix to false
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
        <div className="content flex flex-col justify-start items-center w-full min-h-96 mt-1 pb-7 lg:pt-7 lg:ml-60">
          {isLoading ? (
            <SkeletonCardRender />
          ) : (
            fetchOrder.map(
              ({
                booking_id,
                status,
                scheduled_date,
                staff_name,
                total_price,
                order_list,
              }) => {
                return (
                  <OrderCard
                    key={booking_id}
                    id={booking_id}
                    status={status}
                    date={scheduled_date}
                    time={scheduled_date}
                    staff={staff_name}
                    totalPrice={total_price}
                    orders={order_list}
                  />
                );
              }
            )
          )}
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
