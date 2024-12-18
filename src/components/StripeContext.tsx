import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeContextProps {
  children: React.ReactNode;
}

const StripeContext: React.FC<StripeContextProps> = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export default StripeContext;
