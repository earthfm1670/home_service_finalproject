import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";
export default async function getOrderList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  //api for get order history
  const query = `
  SELECT 
    bookings.booking_id, 
    users.name as user_name, 
    scheduled_date, 
    staffs.name as staff_name, 
    booking_status.status_name as status, 
    json_agg(json_build_object(
            'id', order_list.id, 
            'description', sub_services.description, 
            'amount', amount, 
            'total_price', total_price  )) as order_list
    FROM bookings
    INNER JOIN booking_status
    ON booking_status.status_id = bookings.status_id
    INNER JOIN users
    ON bookings.user_id = users.user_id
    INNER JOIN staffs
    ON staffs.staff_id = bookings.staff_id
    LEFT JOIN order_list 
    ON order_list.booking_id = bookings.booking_id
    LEFT JOIN sub_services
    ON sub_services.id = order_list.sub_services_id
    WHERE booking_status.status_id=1 OR booking_status.status_id=2 
    AND bookings.user_id=$1
    GROUP BY bookings.booking_id, users.name, scheduled_date, staffs.name, booking_status.status_name;
`;
  const userIdFromClient = `a8371d36-b1af-4582-a31d-4edf8fbacb38`;

  try {
    const respond = await connectionPool.query(query, [userIdFromClient]);
    console.log(respond);
    if (!respond.rows[0]) {
      return res
        .status(404)
        .json({ error: "Orders list not found, check user id." });
    }
    return res.status(200).json({ data: respond.rows[0] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
