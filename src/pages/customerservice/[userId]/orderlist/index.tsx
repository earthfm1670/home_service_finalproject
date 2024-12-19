import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";
import UserSidebar from "@/components/customer/userSidebar";
import OrderCard from "@/components/customer/orderCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SkeletonCardRender from "@/components/customer/cardSkeletonRender";
import { useAuth } from "@/context/authContext";
export interface OrdersList {
  id: number;
  description: string;
  amount: number;
  unit: string;
  order_price: number;
}
interface FetchBookingOrderlist {
  booking_id: string;
  user_name: string;
  scheduled_date: string;
  staff_name: string;
  status: string;
  total_price: number;
  order_list: OrdersList[];
}
interface FetchedData {
  data: FetchBookingOrderlist[];
}
interface Respond {
  data: FetchedData;
}
export default function CustomerOrderlist() {
  const [fetchOrder, setFetchOrder] = useState<FetchBookingOrderlist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { authState } = useAuth();
  const user = authState.user?.user_metadata;
  const userId = authState.userId;
  if (!user || !userId) {
    console.log("No User");
    console.log(authState);
    console.log(authState.user?.user_metadata);
    console.log(user);
  }

  const fetchData = async () => {
    setIsLoading(true);
    console.log("fetching--------------------------------------------");
    console.log(fetchOrder);
    try {
      const respond: Respond = await axios.get(
        `/api/customer/orderlist/${userId}`
      );
      if (respond) {
        console.log("respond-----------------------------------------------");
        setIsLoading(false);
        setFetchOrder(respond.data.data);
        console.log(respond.data.data);
      }
    } catch (err) {
      console.log("Fetch data error");
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.userId]);

  return (
    <>
      <Navbar />
      <div className="banner hidden lg:flex justify-center items-center w-full bg-blue-600 font-medium text-3xl text-white py-6">
        รายการคำสั่งซ่อม
      </div>
      <div className="template-body bg-[#F3F4F6] lg:flex lg:relative lg:pb-24 lg:pl-44 lg:pr-40">
        <div className="sidebar-box flex justify-center lg:fixed lg:top-44">
          <UserSidebar userId={userId} />
        </div>
        <div className="small-banner flex lg:hidden justify-center items-center border rounded-lg mx-4 my-4 bg-blue-600 font-medium text-3xl text-white py-6">
          รายการคำสั่งซ่อม
        </div>
        <div className="content flex flex-col justify-center items-center w-full min-h-96 mt-1 pb-7 lg:pt-7 lg:ml-60">
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
                    pendingAt={scheduled_date}
                    staff={staff_name}
                    totalPrice={total_price}
                    orders={order_list}
                    fromHistory={false}
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
