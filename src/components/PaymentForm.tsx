import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface PromoCodes {
  [key: string]: number;
}

interface PaymentFormProps {
  setDiscount: (discount: number) => void;
  updateCardDetails: (field: string, value: string) => void;
  selectedPayment: string;
  setSelectedPayment: React.Dispatch<React.SetStateAction<string>>;
  calculateTotal: () => number;
  totalAmount: number;
  onCardCompleteChange: (isComplete: boolean) => void;
  onExpiryCompleteChange: (isComplete: boolean) => void;
  onCvcCompleteChange: (isComplete: boolean) => void;
  cardDetails: {
    cardNumber: string;

    cardExpiry: string;

    cardCvc: string;
  };
  ref: ReturnType<typeof useRef<PaymentFormHandle | null>>;
}

export interface PaymentFormHandle {
  handleSubmit: (event: Event) => Promise<void>;
}


const PaymentForm = forwardRef<PaymentFormHandle, PaymentFormProps>(
  (
    {
      setDiscount,
      totalAmount,
      onCardCompleteChange,
      onExpiryCompleteChange,
      onCvcCompleteChange,
    },
    ref
  ) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [promoCode, setPromoCode] = useState<string>("");
    const [selectedPayment, setSelectedPayment] =
      useState<string>("creditcard");
    const [cardComplete, setCardComplete] = useState<boolean>(false);
    const [expiryComplete, setExpiryComplete] = useState<boolean>(false);
    const [cvcComplete, setCvcComplete] = useState<boolean>(false);

    const handleCardNumberChange = (event: any) => {
      const isComplete = !event.empty;
      setCardComplete(isComplete);
      onCardCompleteChange(isComplete);
    };

    const handleExpiryChange = (event: any) => {
      const isComplete = !event.empty;
      setExpiryComplete(isComplete);
      onExpiryCompleteChange(isComplete);
    };

    const handleCvcChange = (event: any) => {
      const isComplete = !event.empty;
      setCvcComplete(isComplete);
      onCvcCompleteChange(isComplete);
    };

    const [cardNumber, setCardNumber] = useState<number>(0);

    // const handleCardNumberChange = (field: string, value: string) => {
    //   updateCardDetails(field, value);
    // };

    const handlePaymentMethodChange = (method: string) => {
      setSelectedPayment(method);
    };

    const isPaymentFormComplete = (): boolean => {

      const isCreditCardSelected = selectedPayment === "creditcard";
      // const cardComplete = cardElement && !cardElement._empty;
      // const expiryComplete = expiryElement && !expiryElement._empty;
      // const cvcComplete = cvcElement && !cvcElement._empty;

      // console.log("isCreditCardSelected:", selectedPayment === "creditcard");
      // console.log("Card complete:", cardElement && !cardElement._empty);
      // console.log("Expiry complete:", expiryElement && !expiryElement._empty);
      // console.log("CVC complete:", cvcElement && !cvcElement._empty);
      // console.log("Name entered:", name !== "");

      // validate all inputs
      if (!isCreditCardSelected) return true;

      if (!cardComplete) {
        setError("Please enter a valid card number.");
        alert("Please enter a valid card number.");
        return false;
      }

      if (!name.trim()) {
        setError("Please enter the name on the card.");
        alert("Please enter the name on the card.");
        return false;
      }

      if (!expiryComplete) {
        setError("Please enter the card's expiration date.");
        alert("Please enter a the card's expiration date.");
        return false;
      }

      if (!cvcComplete) {
        setError("Please enter the card's CVC.");
        alert("Please enter the card's CVC");
        return false;
      }

      setError(null);
      return true;

      // return (
      //   isCreditCardSelected &&
      //   cardComplete &&
      //   expiryComplete &&
      //   cvcComplete &&
      //   name !== ""
      // );
    };

    const handleSubmit = async () => {
      setLoading(true);

      if (!stripe || !elements) {
        setError("Stripe has not loaded yet. Please try again.");
        setLoading(false);
        return;
      }

      // apply promo code and update total amount
      let discount = 0;
      let promotionId = 0;

      if (promoCode.trim()) {
        try {
          const response = await axios.post("/api/discount", {
            promotionCode: promoCode,
            useCount: 1,
          });
          if (response.data && response.data.data) {
            const promotion = response.data.data;
            promotionId = promotion.promotion_id;
            discount = promotion.discount_value;
            setDiscount(discount);
          } else {
            setDiscount(0);
          }
        } catch (error) {
          console.error("Error applying promo code:", error);
          setError("An error occurred while fetching the promo code.");
          setDiscount(0);
          setLoading(false);
          return;
        }
      } else {
        setDiscount(0);
      }

      const finalAmount = totalAmount - totalAmount * discount;

      if (!isPaymentFormComplete()) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      try {
        const cardElement = elements.getElement(CardNumberElement);

        if (!cardElement) {
          setError("Card element is not available.");
          setLoading(false);
          return;
        }

        const { error: paymentMethodError, paymentMethod } =
          await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: { name },
          });

        if (paymentMethodError) {
          setError(
            paymentMethodError.message || "Failed to create payment method."
          );
          setLoading(false);
          return;
        }

        // // send data to payment database
        const userId: string | null =
          JSON.parse(localStorage.getItem("user") || "{}")?.sub || null; //MARK <<< เช็คว่า userId มีจริงไหม ถ้าไม่มี เอาจาก params หรือ pares localstorage.user แล้วดูที่ sub
        const serviceInfo = sessionStorage.getItem("serviceInfoFormData");
        const parsedServiceInfo = serviceInfo ? JSON.parse(serviceInfo) : null;
        const selectedServices = sessionStorage.getItem("selectedServices");
        const parsedSelectedServices = selectedServices
          ? JSON.parse(selectedServices)
          : [];

        const scheduledDate = parsedServiceInfo?.selectedDate || null;
        const paymentDate = new Date().toISOString();
        const paymentMethodId = selectedPayment === "creditcard" ? 2 : 1;
        // const promotionId = promoCodes[promoCode] ? 1 : 0; //MARK <<< เปลี่ยนเป็นค่าของ promotion_id ถ้าไม่มี เป็น 0
        const subServices = parsedSelectedServices.selections.map(
          (service: any) => ({
            //MARK <<< เพิ่ม selections เพื่อเข้าถึง array
            subServiceId: service.id,
            amount: service.quantity,
          })
        );
        // console.log(subServices);

        // send payment data to api
        const apiResponse = await axios.post(
          `/api/customer/payment/${userId}`,
          {
            scheduledDate,
            totalPrice: totalAmount,
            paymentMethod: paymentMethodId,
            paymentDate,
            promotionId,
            subServices,
          }
        );

        if (apiResponse.status === 201) {
          alert("Payment successful! Thank you for your purchase.");
          // console.log("Redirecting to /paymentsuccess...");
          setLoading(false);
          router.push("/paymentsuccess");
        } else {
          setError(
            apiResponse.data.message || "Failed to process the payment."
          );
          setLoading(false);
        }

        // send payment data to create payment intent
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finalAmount,
            promoCode,
            paymentMethodId: paymentMethod.id,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.clientSecret) {
          setError(data.message || "Failed to create payment intent.");
          setLoading(false);
          return;
        }

        const { clientSecret } = data;

        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod.id,
          });

        if (stripeError) {
          setError(stripeError.message || "Payment failed. Please try again.");
          setLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          alert("Payment successful! Thank you for your purchase.");
          // console.log("Redirecting to /paymentsuccess...");
          setLoading(false);
        }
      } catch (err) {
        console.error("Payment error:", err);
        setError("An error occurred during payment. Please try again.");
        setLoading(false);
      }
    };

    React.useImperativeHandle(ref, () => ({
      handleSubmit: async () => {
        // console.log("Submitting the payment form...");
        await handleSubmit();
      },
    }));

    const applyPromoCode = async (): Promise<void> => {
      if (!promoCode.trim()) {
        alert("กรุณากรอกโค้ดส่วนลด");
        setDiscount(0);
        return;
      }

      try {
        // Fetch promotion codes from the database
        const response = await axios.post("/api/discount", {
          promotionCode: promoCode,
          useCount: 1,
        });

        // if (!response) {
        //   alert("ไม่สามารถดึงข้อมูลโค้ดส่วนลดได้ กรุณาลองใหม่อีกครั้ง");
        //   return;
        // }

        // parse data
        const promotion = response.data.data;
        // console.log(promotion);

        if (promotion.promotion_code.trim() === promoCode.trim()) {
          const discount = promotion.discount_value;
          setDiscount(discount);
          alert(`โค้ดส่วนลดสามารถใช้งานได้ คุณได้รับส่วนลด ${discount * 100}%`);
        } else {
          alert("โค้ดส่วนลดไม่ถูกต้อง");
          setDiscount(0);
        }
      } catch (error) {
        console.error("Error applying promo code:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
        setDiscount(0);
      }
    };

    const elementStyle = {
      base: {
        fontSize: "16px",
        fontWeight: "normal",
        color: "#424770",
        fontFamily: "'Poppins', sans-serif",
        lineHeight: "28px",
        padding: "0 12px",
        "::placeholder": {
          color: "#6B7280",
          fontSize: "16px",
          fontWeight: "normal",
          fontFamily: "'Poppins', sans-serif",
        },
      },
      invalid: {
        color: "#9e2146", // Invalid input color
      },
    };

    const customCardNumberOptions = {
      style: elementStyle,
      placeholder: "XXXX XXXX XXXX XXXX",
    };

    const customCvcOptions = {
      style: elementStyle,
      placeholder: "XXX",
    };

    return (
      <div className="border mx-4 mb-10 rounded-lg bg-white lg:w-[735px]">
        <div className="mx-3 mt-2 text-[18px] text-gray-700 font-medium lg:mx-6 lg:text-[20px] lg:py-6 lg:hidden">
          กรอกข้อมูลบริการ
        </div>
        <div className="mx-3 mt-2 text-[18px] text-gray-700 font-medium lg:mx-6 lg:text-[20px] lg:py-6 hidden lg:block">
          ชำระเงิน
        </div>
        <div className="mx-3 mb-2 h-[95px] flex justify-between lg:justify-center lg:gap-6 lg:mb-6">
          {/* Promptpay Option */}
          <div
            className={`w-[147px] h-[95px] lg:w-[331px] lg:h-[86px] border rounded-sm flex flex-col justify-center items-center cursor-pointer ${
              selectedPayment === "qrcode" ? "bg-blue-100 border-blue-600" : ""
            }`}
            onClick={() => handlePaymentMethodChange("qrcode")}
          >
            {selectedPayment === "qrcode" ? (
              <>
                <img
                  src="/image/qrclicked.svg"
                  className="w-[35px] h-[35px]"
                ></img>
                <p className="text-[16px] text-blue-600 font-semibold">
                  พร้อมเพย์
                </p>
              </>
            ) : (
              <>
                <img
                  src="/image/qricon.svg"
                  className="w-[35px] h-[35px]"
                ></img>
                <p className="text-[16px] text-gray-800 font-semibold">
                  พร้อมเพย์
                </p>
              </>
            )}
          </div>
          {/* Credit Card Option */}
          <div
            className={`w-[147px] h-[95px] lg:w-[331px] lg:h-[86px] border rounded-sm flex flex-col justify-center items-center cursor-pointer ${
              selectedPayment === "creditcard"
                ? "bg-blue-100 border-blue-600"
                : ""
            }`}
            onClick={() => handlePaymentMethodChange("creditcard")}
          >
            {selectedPayment === "creditcard" ? (
              <>
                <img
                  src="/image/creditcardclicked.svg"
                  className="w-[35px] h-[35px]"
                ></img>
                <p className="text-[16px] text-blue-600 font-semibold">
                  บัตรเครดิต
                </p>
              </>
            ) : (
              <>
                <img
                  src="/image/creditcard.svg"
                  className="w-[35px] h-[35px]"
                ></img>
                <p className="text-[16px] text-gray-800 font-semibold">
                  บัตรเครดิต
                </p>
              </>
            )}
          </div>
        </div>
        {/* Payment Form */}
        {selectedPayment === "creditcard" ? (
          <>
            <form onSubmit={handleSubmit} className="bg-white">
              <div className="mx-3 my-2 lg:mx-6 lg:my-6">
                <label className="block">
                  หมายเลขบัตรเครดิต<span className="text-[#C82438]">*</span>
                </label>
                <CardNumberElement
                  onChange={handleCardNumberChange}
                  options={customCardNumberOptions}
                  className="block w-full h-[44px] border border-gray-300 rounded-md py-2 px-2"
                />
              </div>
              <div className="mx-3 lg:mx-6 lg:my-6">
                <label className="block mb-2">
                  ชื่อบนบัตร<span className="text-[#C82438]">*</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full h-[44px] border border-gray-300 rounded-md py-1 px-3 placeholder:text-gray-500 placeholder:text-[16px] placeholder:font-normal"
                    placeholder="กรุณากรอกชื่อบนบัตร"
                  ></input>
                </label>
              </div>
              <div>
                {/* div for expiry and cvc */}
                <div className="lg:flex lg:w-[686px] lg:ml-6 lg:justify-between lg:my-6">
                  <div className="mx-3 mb-4 lg:mx-0">
                    <label className="block">
                      วันหมดอายุ<span className="text-[#C82438]">*</span>
                    </label>
                    <CardExpiryElement
                      onChange={handleExpiryChange}
                      options={{ style: elementStyle }}
                      className="block w-full lg:w-[331px] h-[44px] border border-gray-300 rounded-md py-2 px-2"
                    />
                  </div>
                  <div className="mx-3 mb-4 lg:mx-0">
                    <label className="block">
                      รหัส CVC / CVV<span className="text-[#C82438]">*</span>
                    </label>
                    <CardCvcElement
                      onChange={handleCvcChange}
                      options={customCvcOptions}
                      className="block w-full lg:w-[331px] h-[44px] border border-gray-300 rounded-md py-2 px-2"
                    />
                  </div>
                </div>

                {/* divider line */}
                <div className="border-t border-gray-300 my-6 mb-8 mx-3 lg:mx-6"></div>
                <div className="mx-3 mb-6 lg:mx-6 lg:my-6 lg:pb-6">
                  <label>Promotion Code</label>{" "}
                  <div className="flex items-center gap-5">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="block min-w-[205px] h-[64px] text-[16px] border border-gray-300 rounded-md py-3 px-2 placeholder:text-[16px] lg:h-[44px]"
                      placeholder="กรุณากรอกโค้ดส่วนลด(ถ้ามี)"
                    ></input>
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      className="min-w-[90px] h-[44px] bg-blue-600 rounded-md text-white font-medium text-[16px]"
                    >
                      ใช้โค้ด
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="mx-3 mb-6 py-2 px-6 rounded-md bg-blue-600 text-white font-medium text-[16px] hidden lg:hidden"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : "Purchase Now"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mx-3 mb-6">
              <label>Promotion Code</label>{" "}
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="block min-w-[205px] h-[64px] lg:h-[44px] text-[16px] border border-gray-300 rounded-md py-3 px-2 placeholder:text-[16px]"
                  placeholder="กรุณากรอกโค้ดส่วนลด(ถ้ามี)"
                ></input>
                <button
                  type="button"
                  onClick={applyPromoCode}
                  className="min-w-[90px] h-[44px] bg-blue-600 rounded-md text-white font-medium text-[16px]"
                >
                  ใช้โค้ด
                </button>
              </div>
              <img src="/image/mockqrcode.jpg" className="w-full h-full"></img>
            </div>
          </>
        )}
      </div>
    );
  }
);

PaymentForm.displayName = "PaymentForm"; // <-- Add this line
export default PaymentForm;
