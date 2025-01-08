import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";
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

export default async function getOrderList(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method no allow" });
  }
  try {
    const {
      subServices,
      scheduledDate,
      totalPrice,
      paymentMethod,
      paymentDate,
      promotionId,
    } = req.body;
    const userId = req.query.userId;
    const statusId = 1;

    let query = `
BEGIN;
    WITH inserted_payment AS (
        INSERT INTO payments (user_id, total_price, payment_date, payment_method_id, promotion_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING payment_id
),
        inserted_promotion_history AS (
        INSERT INTO promotions_history (payment_id, promotion_id)
        VALUES ((SELECT payment_id FROM inserted_payment), $5)
        ),
        inserted_booking AS(
        INSERT INTO bookings (user_id, scheduled_date, total_price, payment_id, status_id)
        VALUES ($1, $6, $2, (SELECT payment_id FROM inserted_payment), $7)
        RETURNING booking_id
)
  `;
    const values = [
      userId,
      totalPrice,
      paymentDate,
      paymentMethod,
      promotionId,
      scheduledDate,
      statusId,
    ];

    for (const item of subServices) {
      query += `
    INSERT INTO order_list (sub_services_id, amount, booking_id)
    VALUES (${
      (item.subServiceId, item.amount)
    }, (SELECT booking_id FROM inserted_booking));
    `;
    }
    query += `COMMIT`;
    console.log("From payment-------------------------------");
    console.log(query);
    const response = await connectionPool.query(query, values);
    console.log(response);
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return res.status(500).json({
      message: "Server fail unexpetedly, see detail: ",
      error: error.message,
    });
  }
  return res.status(201).json({ message: "paid successfully" });
}
/** Query should look like this
 * BEGIN;
-- Insert into payments and return the payment_id
WITH inserted_payment AS (                                                                           <<< ส่ง payment detail ลง payment table
    INSERT INTO payments (user_id, total_price, payment_date, payment_method_id, promotion_id)
    VALUES ('a8371d36-b1af-4582-a31d-4edf8fbacb38', 70000, NOW(), 1, 0)
    RETURNING payment_id                                                                             <<< เอา payment id ออกมา
),
-- Insert into bookings using the returned payment_id
inserted_booking AS(                                                                                 <<< สร้างคิว bookings ลง bookings table
INSERT INTO bookings (user_id, scheduled_date, total_price, payment_id, status_id)
VALUES ('a8371d36-b1af-4582-a31d-4edf8fbacb38', NOW(), 70000, (SELECT payment_id FROM inserted_payment), 1)
RETURNING booking_id                                                                                  <<< เอา booking id id ออกมา
)

INSERT INTO order_list (sub_services_id, amount, booking_id)                                            <<<สองตัวนี้เป็นลูป เอามาจาก array subServies                         
VALUES (68, 1, (SELECT booking_id FROM inserted_booking)),

INSERT INTO order_list (sub_services_id, amount, booking_id)                                    
VALUES (69, 3, (SELECT booking_id FROM inserted_booking)),


COMMIT;                                                                                                 <<< ทำเสร็จทุกขั้นตอนแล้วค่อย Commit
 * 
 * 
 */
