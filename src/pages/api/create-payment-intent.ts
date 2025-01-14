import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27" as any,
});

const promoCodes: { [key: string]: number } = {
  DISCOUNT10: 0.1,
  DISCOUNT20: 0.2,
  FURRY: 0.99,
};
/**
 * @swagger
 * /api/create-payment-intent:
 *   post:
 *     summary: Create a payment intent
 *     description: Creates a Stripe payment intent with optional promo code discount
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethodId
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The payment amount in THB
 *               promoCode:
 *                 type: string
 *                 description: Optional promo code for discount
 *               paymentMethodId:
 *                 type: string
 *                 description: Stripe payment method ID
 *     responses:
 *       200:
 *         description: Successful response with client secret
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *       400:
 *         description: Bad request
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { amount, promoCode, paymentMethodId } = req.body;

      if (!paymentMethodId) {
        return res
          .status(400)
          .json({ error: "Payment method ID is required." });
      }

      //apply discount based on promo code
      let finalAmount = amount;
      if (promoCode && promoCodes[promoCode]) {
        finalAmount = amount * (1 - promoCodes[promoCode]);
      }

      const finalAmountInSatang = Math.round(finalAmount * 100);

      // Create payment intent with the provided payment method
      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmountInSatang,
        currency: "thb",
        payment_method: paymentMethodId,
        confirm: true,
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating payment intent:", error.message);
        res.status(500).json({ error: error.message });
      } else {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "An unknown error occurred." });
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
