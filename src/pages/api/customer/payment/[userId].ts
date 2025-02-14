import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
/**
 * payment
 * - total_price
 * - payment_method
 * - promotion_id
 * - user_id
 *
 * bookings
 * - scheduled_date
 * - user_id
 * - payment_id
 * - total_price
 *
 * orderlist (need loop)
 * - (array of) sub_service_id
 * - (array of) amount
 */

/** await axios.post("/api/customer/payment/[userId]")
 * สิ่งที่ต้องส่ง
 * userId : เป็น params อยู่แล้ว
 * scheduledDate: วันจอง
 * totalPrice: ราคารวม
 * paymentMethod: รหัสประเภทบัตร (1:cash, 2:visa, 3:mastercard, 4:paypal)
 * paymentDate: วันจ่าย Now()
 * promotionId: promotion id : number ถ้าไม่มีใส่ 0
 * subServices: array of object [{subServiceId: id ของ sub-service(number) , amount: จำนวนที่จอง (number)}, {}, ......]
 */
/**
 * Example body
 * @param req 
 * {
  "totalPrice": 987,
  "paymentDate": "2025-01-09T12:00:00Z",
  "paymentMethod": 1,
  "promotionId": 0,
  "scheduledDate": "2025-01-10T09:00:00Z",
  "subServices": [
    {
      "subServiceId": 67,
      "amount": 1
    },
    {
      "subServiceId": 68,
      "amount": 2
    }
  ]
}
 * @returns 
 */

/**
 * @swagger
 * /api/customer/payment/{userId}:
 *   post:
 *     summary: Process payment and create booking
 *     description: Handles payment processing and creates a new booking for the user
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalPrice
 *               - paymentDate
 *               - paymentMethod
 *               - scheduledDate
 *               - subServices
 *             properties:
 *               totalPrice:
 *                 type: number
 *               paymentDate:
 *                 type: string
 *                 format: date-time
 *               paymentMethod:
 *                 type: integer
 *                 enum: [1, 2, 3, 4]
 *                 description: 1:cash, 2:visa, 3:mastercard, 4:paypal
 *               promotionId:
 *                 type: integer
 *                 default: 0
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               subServices:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subServiceId:
 *                       type: integer
 *                     amount:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request or failed to insert data
 *       500:
 *         description: Internal server error
 */

export default async function getOrderList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method no allow" });
  }
  const userId = req.query.userId;
  const bookingStatus = 1;
  const {
    totalPrice,
    paymentDate,
    paymentMethod,
    promotionId,
    scheduledDate,
    subServices,
  } = req.body;
  try {
    const { error } = await supabase.rpc("insert_payment_and_related_data", {
      p_user_id: userId,
      p_total_price: totalPrice,
      p_payment_date: paymentDate,
      p_payment_method_id: paymentMethod,
      p_promotion_id: promotionId,
      p_scheduled_date: scheduledDate,
      p_booking_status_id: bookingStatus,
      p_sub_services: subServices,
    });
    if (error) {
      console.log("Fail to insert data________________________________");
      console.log(error.message);
      return res.status(400).json({
        message: "Fail to insert payment data.",
        error: error.message,
      });
    }
    return res.status(201).json({ success: "Pending booking successfully." });
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
}
//----Legacy code--------
// export default async function getOrderList(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(400).json({ error: "Method no allow" });
//   }
//   try {
//     const {
//       subServices,
//       scheduledDate,
//       totalPrice,
//       paymentMethod,
//       paymentDate,
//       promotionId,
//     } = req.body;
//     const userId = req.query.userId;
//     const statusId = 1;

//     let query = `
// BEGIN;
//     WITH inserted_payment AS (
//         INSERT INTO payments (user_id, total_price, payment_date, payment_method_id, promotion_id)
//         VALUES ($1, $2, $3, $4, $5)
//         RETURNING payment_id
// ),
//         inserted_promotion_history AS (
//         INSERT INTO promotions_history (payment_id, promotion_id)
//         VALUES ((SELECT payment_id FROM inserted_payment), $5)
//         ),
//         inserted_booking AS(
//         INSERT INTO bookings (user_id, scheduled_date, total_price, payment_id, status_id)
//         VALUES ($1, $6, $2, (SELECT payment_id FROM inserted_payment), $7)
//         RETURNING booking_id
// )
//   `;
//     const values = [
//       userId,
//       totalPrice,
//       paymentDate,
//       paymentMethod,
//       promotionId,
//       scheduledDate,
//       statusId,
//     ];

//     for (const item of subServices) {
//       query += `
//     INSERT INTO order_list (sub_services_id, amount, booking_id)
//     VALUES (${
//       (item.subServiceId, item.amount)
//     }, (SELECT booking_id FROM inserted_booking));
//     `;
//     }
//     query += `COMMIT`;
//     console.log("From payment-------------------------------");
//     console.log(query);
//     const response = await connectionPool.query(query, values);
//     console.log(response);
//   } catch (e) {
//     const error = e as Error;
//     console.log(error.message);
//     return res.status(500).json({
//       message: "Server fail unexpetedly, see detail: ",
//       error: error.message,
//     });
//   }
//   return res.status(201).json({ message: "paid successfully" });
// }
