/* eslint-disable react-hooks/exhaustive-deps */
import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import OrderCard from "@/components/customer/orderCard";
import React, { useEffect, useState } from "react";
import { OrdersList } from "../orderlist";
import axios from "axios";
import SkeletonCardRender from "@/components/customer/cardSkeletonRender";
import { useAuth } from "@/context/authContext";

interface FetchBookingHistory {
  booking_id: string;
  user_name: string;
  completed_at: string;
  staff_name: string;
  status: string;
  total_price: number;
  order_list: OrdersList[];
}
interface FetchedData {
  data: FetchBookingHistory[];
}
interface Respond {
  data: FetchedData;
}
export default function CustomerHistory() {
  const [fetchOrder, setFetchOrder] = useState<FetchBookingHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authState } = useAuth();
  // const user = authState.user?.user_metadata;
  const userId = authState.userId;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const respond: Respond = await axios.get(
        `/api/customer/history/${userId}`
      );
      if (respond) {
        setIsLoading(false); //fix to false
        setFetchOrder(respond.data.data);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false); //fix to false
    }
  };
  useEffect(() => {
    fetchData();
  }, [authState.userId]);
  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        ประวัติการสั่งซ่อม
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar userId={userId} />
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
                completed_at,
                staff_name,
                total_price,
                order_list,
              }) => {
                return (
                  <OrderCard
                    key={booking_id}
                    id={booking_id}
                    status={status}
                    pendingAt={completed_at}
                    staff={staff_name}
                    totalPrice={total_price}
                    orders={order_list}
                    fromHistory={true}
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
