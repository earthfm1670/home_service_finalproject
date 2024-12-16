import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name,
      },
    });

    if (error) {
      setError(error.message || "An error occurred");
      setLoading(false);
    } else {
      // Handle successful payment method creation
      console.log(paymentMethod);
      console.log("Promotion Code:", promoCode);
      setLoading(false);
    }
  };

  const elementStyle = {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  };

  return (
    <div className="border mt-14 mx-4 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mx-3">
          <label className="block mb-2">
            Name on Card
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-1"
            ></input>
          </label>
          <label>
            Promotion Code (Optional)
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-1"
            ></input>
          </label>
        </div>
        <div>
          <div className="mx-3 mb-4">
            <label className="block mb-2">Card Number</label>
            <CardNumberElement
              options={{ style: elementStyle }}
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="mx-3 mb-4">
            <label className="block mb-2">Expiration Date</label>
            <CardExpiryElement
              options={{ style: elementStyle }}
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="mx-3 mb-4">
            <label className="block mb-2">CVC</label>
            <CardCvcElement
              options={{ style: elementStyle }}
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
        </div>
        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay"}
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default PaymentForm;
