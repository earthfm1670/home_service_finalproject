import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import moment from "moment-timezone";

interface Booking {
  booking_id: number;
  booked_at: string;
  completed_at?: string;
  in_progress_at?: string;
  status_id: number;
  total_price: number;
  address: string;
  booking_status: { status_name: string };
  user_id: number;
  users: { name: string; phone_number: string; email: string };
  staff_id: number;
  staffs: { name: string };
}

interface Order {
  booking_id: number;
  sub_services_id: number;
  amount: number;
  order_price: number;
  sub_services: {
    description: string;
    unit: string;
    unit_price: number;
    services: { service_name: string };
  };
}

export default async function handlerHandyman(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // ดึงข้อมูลจากตาราง bookings ก่อน
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select(
          "booking_id, booked_at, completed_at, in_progress_at, status_id, total_price, address, booking_status:booking_status ( status_name ), user_id, users ( name, phone_number, email ), staff_id, staffs ( name )"
        );

      if (bookingsError) throw bookingsError;

      // ตรวจสอบว่าข้อมูล bookings ไม่เป็น null หรือ undefined
      if (!bookings) {
        throw new Error("No bookings data found");
      }

      // ดึงข้อมูลจากตาราง order_list โดยใช้ booking_id จาก bookings
      const { data: orders, error: ordersError } = await supabase
        .from("order_list")
        .select(
          "booking_id, sub_services_id, amount, order_price, sub_services:sub_services ( description, unit, unit_price, services:services ( service_name ) )"
        );

      if (ordersError) throw ordersError;

      // ตรวจสอบว่าข้อมูล orders ไม่เป็น null หรือ undefined
      if (!orders) {
        throw new Error("No orders data found");
      }

      // จัดรูปแบบ response
      const bookingsData = bookings.map((booking: Booking) => {
        const relatedOrders = orders.filter(
          (order: Order) => order.booking_id === booking.booking_id
        );

        const bookingDetail = relatedOrders.map((order: Order) => ({
          service_name: order.sub_services?.services?.service_name || " ",
          sub_service_description: order.sub_services?.description || " ",
          amount: order.amount,
          sub_service_unit_price: order.sub_services?.unit_price || " ",
          sub_service_unit: order.sub_services?.unit || " ",
          order_price: order.order_price,
        }));

        return {
          booking_id: booking.booking_id,
          booked_at: booking.booked_at || " ",
          completed_at: booking.completed_at || " ",
          in_progress_at: booking.in_progress_at || " ",
          status_name: booking.booking_status?.status_name || " ",
          total_price: booking.total_price || " ",
          address: booking.address || " ",
          user_name: booking.users?.name || " ",
          user_phone: booking.users?.phone_number || " ",
          user_email: booking.users?.email || " ",
          staff_name: booking.staffs?.name || " ",
          bookingDetail: bookingDetail,
        };
      });

      res.status(200).json({
        data: bookingsData,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        data: null,
        error: "Internal Server Error: " + (error as Error).message,
      });
    }
  } else if (req.method === "PATCH") {
    try {
      const { booking_id, status_id, completed_at, inProgress_at } = req.body;

      const updateData: {
        status_id: number;
        completed_at?: string;
        in_progress_at?: string;
      } = {
        status_id: status_id,
      };

      // ถ้ามีค่า completed_at ให้แปลงเวลาเป็นเวลาท้องถิ่นของประเทศไทย
      if (completed_at) {
        const localTime = moment.tz(completed_at, "Asia/Bangkok").format();
        updateData.completed_at = localTime;
      }

      if (inProgress_at) {
        const localTime = moment.tz(inProgress_at, "Asia/Bangkok").format();
        updateData.in_progress_at = localTime;
      }

      const { data, error } = await supabase
        .from("bookings")
        .update(updateData)
        .eq("booking_id", booking_id);
      if (error) throw error;
      res
        .status(200)
        .json({ message: "Status updated successfully", data: data });
    } catch (error) {
      console.error("API Error:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error: " + (error as Error).message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
