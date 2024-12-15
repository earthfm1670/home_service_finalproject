import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function getOrderHistory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  //api for get order history
  //const {data, error} = await supabase.from().select(`oreder_id, order_status, created_at, staff, total_price, sub_orders_id`)
}
