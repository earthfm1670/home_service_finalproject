import { CalendarDays, CircleUser } from "lucide-react";
import React from "react";

interface Orders {
  description: string;
  type: string;
  amount: number;
  unit: string;
}
interface OrderCardProps {
  key: string;
  id: string;
  status: string;
  date: string;
  time: string;
  staff: string;
  totalPrice: number;
  orders: Orders[];
}

export default function OrderCard({
  id,
  status,
  date,
  time,
  staff,
  totalPrice,
  orders,
}: OrderCardProps) {
  return (
    <>
      <div className="card-box flex flex-row justify-between items-strat p-4 gap-4 bg-white border rounded-lg w-11/12 min-h-72 my-3">
        <div className="small flex flex-col">
          <div className="order-header flex flex-col gap-2">
            <h4 className="font-medium text-lg">คำสั่งการซ่อมรหัส : {id}</h4>
            <div className="status-box text-gray-700 lg:hidden">
              สถานะ:{" "}
              <span
                className={`status text-gray-900 rounded-full py-1 px-3 ${
                  status === "ดำเนินการสำเร็จ"
                    ? `bg-green-200`
                    : status === "กำลังดำเนินการ"
                    ? `bg-yellow-200`
                    : `bg-gray-200`
                }`}>
                {status}
              </span>
            </div>
          </div>
          <div className="order-detail flex flex-col gap-2">
            <div className="with-icon">
              <div className="date-time text-gray-700 flex gap-2">
                <CalendarDays size={21} color="gray" />
                วันเวลาดำเนินการ: {date} เวลา {time} น.
              </div>
              <div className="staff text-gray-700 flex gap-2">
                <CircleUser size={21} color="gray" />
                พนักงาน: {staff}
              </div>
            </div>
            <div className="totla-price text-gray-700 font-normal text-sm lg:hidden">
              ราคารวม:{" "}
              <span className="price font-normal text-base text-gray-950 ">
                {totalPrice} B
              </span>
            </div>
            <div className="totla-order text-gray-700 font-normal text-sm flex gap-3">
              รายการ:
              <div className="flex flex-col">
                {orders.map((eachOrder, indext) => {
                  return (
                    <li
                      key={indext}
                      className="price font-normal text-base text-gray-950 ">
                      {`${eachOrder.description} ${eachOrder.type} ${eachOrder.amount} ${eachOrder.unit}`}
                    </li>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            className="detail-button text-white text-base font-medium 
        py-2 px-6 w-36 h-10 rounded-lg bg-blue-600 lg:hidden">
            ดูรายละเอียด
          </button>
        </div>

        <div className="large hidden lg:flex lg:flex-col lg:gap-12">
          <div className="status-and-price flex flex-col gap-3">
            <div className="status-box text-gray-700 ">
              สถานะ:{" "}
              <span
                className={`status text-gray-900 rounded-full py-1 px-3 ${
                  status === "ดำเนินการสำเร็จ"
                    ? `bg-green-200`
                    : status === "กำลังดำเนินการ"
                    ? `bg-yellow-200`
                    : `bg-gray-200`
                }`}>
                {status}
              </span>
            </div>
            <div className="totla-price text-gray-700 font-normal text-sm">
              ราคารวม:{" "}
              <span className="price font-normal text-base text-gray-950 ">
                {totalPrice} B
              </span>
            </div>
          </div>
          <button
            className="detail-button text-white text-base font-medium 
        py-2 px-6 w-36 h-11 rounded-lg bg-blue-600">
            ดูรายละเอียด
          </button>
        </div>
      </div>
    </>
  );
}
