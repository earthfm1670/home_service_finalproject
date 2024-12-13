import React from "react";
import StripeContext from "@/components/StripeContext";
import PaymentForm from "@/components/PaymentForm";

//stand alone payment page, need to connect to service info later
const PaymentPage: React.FC = () => {
  return (
    <StripeContext>
      <h1>Payment Page</h1>
      <PaymentForm />
    </StripeContext>
  );
};

export default PaymentPage;
