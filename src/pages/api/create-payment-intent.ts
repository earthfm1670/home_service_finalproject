import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
});

const promoCodes: { [key: string]: number } = {
  DISCOUNT10: 0.1,
  DISCOUNT20: 0.2,
  FURRY: 0.99,
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const { amount, promoCode } = req.body;
      //apply discount based on promo code
      let finalAmount = amount;
      if (promoCode && promoCodes[promoCode]) {
        finalAmount = amount * (1 - promoCodes[promoCode]);
      }

      const finalAmountInSatang = Math.round(finalAmount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: finalAmountInSatang,
        currency: "thb",
      });
      res.status(200).json(paymentIntent);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
