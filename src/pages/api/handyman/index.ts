import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default async function handlerHandyman(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { query } = req;
      // Pagination params
      const page = parseInt((query.page as string) || "1");
      const limit = parseInt((query.limit as string) || "10");

      // Base query with join
      let dbQuery = supabase
        .from("order_list")
        .select(
          ` id, booking_id, sub_services_id, amount, order_price, sub_services:sub_services ( description, unit, unit_price, services:services ( service_name ) ), booking:bookings ( booked_at, completed_at, status_id, total_price, address, booking_status:booking_status ( status_name ) ) `,
          { count: "exact" }
        );

      // let dbQuery = supabase.from("bookings").select(` * `, { count: "exact" });

      // let dbQuery = supabase
      //   .from("bookings")
      //   .select(
      //     ` booking_id, booked_at, completed_at, status_id, booking_status ( status_name ), total_price, address, user_id, users ( name ) `,
      //     { count: "exact" }
      //   );

      const { data: bookings, error } = await dbQuery;
      if (error) throw error;

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedBookings = bookings.slice(startIndex, endIndex);
      const totalCount = bookings.length;
      const totalPages = Math.ceil(totalCount / limit);

      // Format response

      const formattedBookings = paginatedBookings.map((booking: any) => ({
        id: booking.id,
        booking_id: booking.booking_id,
        service_name: booking.sub_services.services.service_name,
        sub_service_description: booking.sub_services.description,
        amount: booking.amount,
        sub_service_unit_price: booking.sub_services.unit_price,
        sub_service_unit: booking.sub_services.unit,
        order_price: booking.order_price,
        booked_at: booking.booking?.booked_at,
        completed_at: booking.booking?.completed_at,
        status_name: booking.booking?.booking_status?.status_name,
        total_price: booking.booking?.total_price,
        address: booking.booking?.address,
        // booking_id: booking.booking_id,
        // booked_at: booking.booked_at,
        // completed_at: booking.completed_at,
        // status_name: booking.status_id,
        // total_price: booking.total_price,
        // address: booking.address,
        // user_name: booking.users.name,
      }));

      console.log("Formatted Bookings:", formattedBookings); // Debugging log

      res.status(200).json({
        data: formattedBookings,
        totalCount,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        data: null,
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        error: "Internal Server Error: " + (error as Error).message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
