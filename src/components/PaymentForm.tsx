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
        <div className="mx-3 my-2">
          <label className="block">
            หมายเลขบัตรเครดิต<span className="text-[#C82438]">*</span>
          </label>
          <CardNumberElement
            options={{ style: elementStyle }}
            className="block w-full border border-gray-300 rounded-md py-2 px-3"
          />
        </div>
        <div className="mx-3">
          <label className="block mb-2">
            ชื่อบนบัตร<span className="text-[#C82438]">*</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-1"
            ></input>
          </label>
        </div>
        <div>
          <div className="mx-3 mb-4">
            <label className="block">
              วันหมดอายุ<span className="text-[#C82438]">*</span>
            </label>
            <CardExpiryElement
              options={{ style: elementStyle }}
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="mx-3 mb-4">
            <label className="block">
              รหัส CVC / CVV<span className="text-[#C82438]">*</span>
            </label>
            <CardCvcElement
              options={{ style: elementStyle }}
              className="block w-full border border-gray-300 rounded-md py-2 px-3"
            />
          </div>
          <div className="mx-3 mb-4">
            <label>Promotion Code</label>{" "}
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="block min-w-[205px] h-[64px] text-[16px] border border-gray-300 rounded-md py-3 px-4 placeholder:text-[14px]"
                placeholder="กรุณากรอกโค้ดส่วนลด(ถ้ามี)"
              ></input>
              <button className="min-w-[90px] h-[44px] bg-blue-600 rounded-md text-white font-medium text-[16px]">
                ใช้โค้ด
              </button>
            </div>
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
