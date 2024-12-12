import { CalendarDays, CircleUser } from "lucide-react";
export default function OrderCard() {
  interface Order {
    description: string;
    type: string;
    amount: number;
    unit: string;
  }
  interface Job {
    id: string;
    status: string;
    date: string;
    time: string;
    staff: string;
    totalPrice: number;
    orders: Order[];
  }
  const orderlist: Job[] = [
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

  return (
    <>
      <div className="card-box flex flex-col items-strat p-4 gap-4 bg-white border rounded-lg w-11/12 h-72 my-3">
        <div className="order-header flex flex-col gap-2">
          <h4 className="font-medium text-lg">
            คำสั่งซ่อมรหัส : {orderlist[0].id}
          </h4>
          <div className="status-box text-gray-700">
            สถานะ:{" "}
            <span
              className={`status text-gray-900 rounded-full py-1 px-3 ${
                orderlist[0].status === "กำลังดำเนินการ"
                  ? `bg-yellow-200`
                  : `bg-gray-200`
              }`}>
              {orderlist[0].status}
            </span>
          </div>
        </div>
        <div className="order-detail flex flex-col gap-2">
          <div className="with-icon">
            <div className="date-time text-gray-700 flex gap-2">
              <CalendarDays size={21} color="gray" />
              วันเวลาดำเนินการ: {orderlist[0].date} เวลา {orderlist[0].time} น.
            </div>
            <div className="staff text-gray-700 flex gap-2">
              <CircleUser size={21} color="gray" />
              พนักงาน: {orderlist[0].staff}
            </div>
          </div>
          <div className="totla-price text-gray-700 font-normal text-sm">
            ราคารวม:{" "}
            <span className="price font-normal text-base text-gray-950 ">
              {orderlist[0].totalPrice} B
            </span>
          </div>
          <div className="totla-price text-gray-700 font-normal text-sm">
            รายการ:{" "}
            <span className="price font-normal text-base text-gray-950 ">
              {`${orderlist[0].orders[0].description} 
              ${orderlist[0].orders[0].type} 
              ${orderlist[0].orders[0].amount} 
              ${orderlist[0].orders[0].unit}`}
            </span>
          </div>
        </div>
        <button
          className="detail-button text-white text-base font-medium 
        py-2 px-6 w-36 h-10 rounded-lg bg-blue-600 ">
          ดูรายละเอียด
        </button>
      </div>
    </>
  );
}
