import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import moment from "moment-timezone";

// กำหนด type สำหรับข้อมูลที่เราจะดึงมา
type BookingData = {
  booking_id: string;
  booked_at: string;
  scheduled_date: string;
  completed_at: string | null;
  total_price: number;
  address: string;
  in_progress_at: string | null;
  users: { name: string; phone_number: string; email: string } | null;
  staffs: { name: string } | null;
  booking_status: { status_name: string } | null;
  order_list: Array<{
    sub_services_id: string;
    amount: number;
    order_price: number;
    sub_services: {
      description: string;
      unit: string;
      unit_price: number;
      services: { service_name: string };
    } | null;
  }> | null;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingData:
 *       type: object
 *       properties:
 *         booking_id:
 *           type: string
 *         booked_at:
 *           type: string
 *         scheduled_date:
 *           type: string
 *         completed_at:
 *           type: string
 *           nullable: true
 *         total_price:
 *           type: number
 *         address:
 *           type: string
 *         in_progress_at:
 *           type: string
 *           nullable: true
 *         users:
 *           type: object
 *           nullable: true
 *           properties:
 *             name:
 *               type: string
 *             phone_number:
 *               type: string
 *             email:
 *               type: string
 *         staffs:
 *           type: object
 *           nullable: true
 *           properties:
 *             name:
 *               type: string
 *         booking_status:
 *           type: object
 *           nullable: true
 *           properties:
 *             status_name:
 *               type: string
 *         order_list:
 *           type: array
 *           nullable: true
 *           items:
 *             type: object
 *             properties:
 *               sub_services_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               order_price:
 *                 type: number
 *               sub_services:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   description:
 *                     type: string
 *                   unit:
 *                     type: string
 *                   unit_price:
 *                     type: number
 *                   services:
 *                     type: object
 *                     properties:
 *                       service_name:
 *                         type: string
 * 
 * /api/handyman:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieves all bookings with related information
 *     tags: [Handyman]
 *     responses:
 *       200:
 *         description: Successful response with bookings data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookingData'
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update booking status
 *     description: Updates the status of a booking
 *     tags: [Handyman]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_id
 *               - status_id
 *             properties:
 *               booking_id:
 *                 type: string
 *               status_id:
 *                 type: number
 *               completed_at:
 *                 type: string
 *               inProgress_at:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // ดึงข้อมูลจากตาราง bookings
      const { data: bookings, error: bookingsError } = (await supabase
        .from("bookings")
        .select(
          `booking_id, booked_at, scheduled_date, completed_at, total_price, address, in_progress_at, 
          users:user_id (name, phone_number, email), 
          staffs:staff_id (name), 
          booking_status:status_id (status_name), 
          order_list (
            sub_services_id, 
            amount, 
            order_price, 
            sub_services:sub_services_id (description, unit, unit_price, services:service_id (service_name))
          )`
        )) as { data: BookingData[]; error: null };

      if (bookingsError) throw bookingsError;
      // ตรวจสอบว่าข้อมูล bookings ไม่เป็น null หรือ undefined
      if (!bookings) {
        throw new Error("No bookings data found");
      }

      res.status(200).json({ data: bookings });
    } catch (error) {
      console.error("API Error:", error);
      res
        .status(500)
        .json({ error: "Internal Server Error: " + (error as Error).message });
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
