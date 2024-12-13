import React from "react";
import StripeContext from "@/components/StripeContext";
import PaymentForm from "@/components/PaymentForm";

const PaymentPage: React.FC = () => {
  return (
    <StripeContext>
      <h1>Payment Page</h1>
      <PaymentForm />
    </StripeContext>
  );
};

export default PaymentPage
