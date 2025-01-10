import React, { useEffect, useRef, useState } from "react";
import StripeContext from "@/components/StripeContext";
import PaymentForm, { PaymentFormHandle } from "@/components/PaymentForm";
import { Navbar } from "@/components/navbar";
import MobileBottomBar from "@/components/service-detail/MobileBottomBar";
import ServiceHero from "@/components/service-detail/ServiceHero";
import { useRouter } from "next/router";
import type { Service } from "@/types/service";
import DesktopSummary from "@/components/service-detail/DesktopSummary";

interface PaymentInfo {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}
import NavigationButtons from "@/components/service-detail/NavigationButtons";
interface SelectedServicesData {
  selections: Array<{
    id: number;
    quantity: number;
  }>;
  totalAmount: number;
}

interface SubService {
  id: number;
  description: string;
  sub_service_id: number;
  unit: string;
  unit_price: number;
}
interface ServiceInfoPageProps {
  initialService?: Service | null;
}

//stand alone payment page, need to connect to service info later
const PaymentPage: React.FC = ({ initialService }: ServiceInfoPageProps) => {
  const router = useRouter();
  const formRef = useRef<PaymentFormHandle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [service, setService] = useState<Service | null>(
    initialService || null
  );
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedServices, setSelectedServices] =
    useState<SelectedServicesData | null>(null);
  const [locationInfo, setLocationInfo] = useState({
    date: null as Date | null,
    time: "",
    address: "",
    subDistrict: "",
    district: "",
    province: "",
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [selectedPayment, setSelectedPayment] = useState<string>("creditcard");

  const [cardComplete, setCardComplete] = useState<boolean>(false);
  const [expiryComplete, setExpiryComplete] = useState<boolean>(false);
  const [cvcComplete, setCvcComplete] = useState<boolean>(false);

  const handlePaymentChange: React.Dispatch<React.SetStateAction<string>> = (
    paymentType
  ) => {
    setSelectedPayment(paymentType);
  };

  const updateCardDetails = (field: string, value: string) => {
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  useEffect(() => {
    const sessionData = {
      selectedServices: sessionStorage.getItem("selectedServices"),
      paymentData: sessionStorage.getItem("paymentData"),
    };

    // Load selected services from session storage
    const servicesData = sessionStorage.getItem("selectedServices");

    if (servicesData) {
      const parsedData = JSON.parse(servicesData);
      setSelectedServices(parsedData);
      setTotalAmount(parsedData.totalAmount);

      // Fetch service details if not provided as props (comment)
      if (!service && parsedData.serviceId) {
        getService(parsedData.serviceId).then((result) => {
          if (result.data) {
            setService(result.data);
          }
        });
      }
    }

    const paymentData = sessionStorage.getItem("paymentData");
    if (paymentData) {
      const parsedData = JSON.parse(paymentData);
      setPayment(parsedData);
      setLocationInfo({
        ...parsedData,
        date: parsedData.date ? new Date(parsedData.date) : null,
      });
    }
  }, [service]);
  // End of useEffect

  const getSelectedServices = () => {
    return (
      selectedServices?.selections.map((selection) => ({
        id: selection.id,
        sub_service_id: selection.id, // Add appropriate sub_service_id
        description: "", // Add appropriate description
        unit: "", // Add appropriate unit
        unit_price: 0, // Add appropriate unit price
        quantity: selection.quantity,
      })) || []
    );
  };

  const getQuantityDisplay = (subServiceId: number) => {
    const service = selectedServices?.selections.find(
      (s) => s.id === subServiceId
    );
    return service?.quantity || 0;
  };

  const calculateTotal = () => {
    const totalAmount = selectedServices?.totalAmount || 0;
    return totalAmount - totalAmount * discount;
  };

  const [currentStep, setCurrentStep] = useState(3);

  if (!service) {
    return <div>Loading...</div>;
  }

  async function getService(
    id: string
  ): Promise<{ data: Service | null; error?: string }> {
    try {
      const res = await fetch(`http://localhost:3000/api/services/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch service");
      }
      return res.json();
    } catch (error) {
      console.error("Error fetching service:", error);
      return { data: null, error: "Failed to fetch service" };
    }
  }

  // const isFormComplete = (): boolean => {
  //   const isServicesSelected =
  //     selectedServices && selectedServices.selections.length > 0;
  //   const isPaymentInfoComplete = payment !== null;
  //   return isServicesSelected && isPaymentInfoComplete;
  // };

  const isFormComplete = (): boolean => {
    const isServicesSelected =
      selectedServices && selectedServices.selections.length > 0;

    const isPaymentInfoComplete = payment && selectedPayment === "creditcard";

    const isLocationInfoComplete =
      Boolean(locationInfo.date) &&
      Boolean(locationInfo.time) &&
      Boolean(locationInfo.address);

    return (
      Boolean(isServicesSelected) &&
      Boolean(isPaymentInfoComplete) &&
      Boolean(isLocationInfoComplete)
    );
  };

  const handleProceed = () => {
    setIsLoading(true);
    if (formRef.current) {
      formRef.current.handleSubmit(new Event("submit"));
    }

    if (!cardComplete || !expiryComplete || !cvcComplete) {
      setIsLoading(false);
      // alert("Please ensure the card details are entered correctly.");
      return;
    }

    if (!isFormComplete()) {
      alert("Please complete all required fields before proceeding.");
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      const discountedTotal = calculateTotal();
      // console.log("Selected Services Before Nav:", selectedServices);
      // console.log("date", locationInfo.date);
      // console.log("time", locationInfo.time);
      // console.log("address", locationInfo.address);
      // console.log("totalAmount", discountedTotal.toFixed(2));
      router.push({
        pathname: "/paymentsuccess",
        query: {
          selectedServices: JSON.stringify(selectedServices),
          date:
            locationInfo.date instanceof Date
              ? locationInfo.date.toISOString()
              : null,
          time: locationInfo.time,
          address: locationInfo.address,
          subDistrict: locationInfo.subDistrict,
          district: locationInfo.district,
          province: locationInfo.province,
          totalAmountAfterDiscount: discountedTotal.toFixed(2),
        },
      });
    }, 3000);
  };

  return (
    <StripeContext>
      {/* screen loading effect */}
      {isLoading && (
        <>
          <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-50"></div>
        </>
      )}
      <div className={`bg-gray-100 ${isLoading ? "hidden" : ""}`}>
        <div className="flex flex-col h-min-screen">
          {/* <h1>Payment Page</h1> */}
          <Navbar />
          {/* Hero Section */}
          <ServiceHero service={service} />
        </div>

        <div className="mt-14 lg:flex lg:mt-28 lg:flex-row lg:justify-center lg:gap-5 lg:mr-4">
          <div className="overflow-y-auto pb-28 lg:pb-0">
            
            <PaymentForm
              ref={formRef}
              setDiscount={setDiscount}
              updateCardDetails={updateCardDetails}
              cardDetails={cardDetails}
              selectedPayment={selectedPayment}
              setSelectedPayment={handlePaymentChange}
              calculateTotal={calculateTotal}
              totalAmount={totalAmount}
              onCardCompleteChange={setCardComplete}
              onExpiryCompleteChange={setExpiryComplete}
              onCvcCompleteChange={setCvcComplete}
            />
          </div>
          <div className="lg:w-[349px] lg:h-[374px]">
            <DesktopSummary
              getSelectedServices={getSelectedServices}
              getQuantityDisplay={getQuantityDisplay}
              calculateTotal={calculateTotal}
              // canProceed={isFormComplete()}
              // canProceed={true}
              locationInfo={locationInfo}
              discount={discount}
              totalAmount={totalAmount}
              getPriceDisplay={function (id: number): number {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
        <div className="">
          <NavigationButtons
            disabled={!isFormComplete()}
            canProceed={true}
            handleProceed={handleProceed}
            backButtonText="ย้อนกลับ"
            proceedButtonText="ชำระเงิน"
          />
        </div>
        <div className="sticky bottom-0 z-10">
          <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
            <MobileBottomBar
              getSelectedServices={getSelectedServices}
              getQuantityDisplay={getQuantityDisplay}
              calculateTotal={calculateTotal}
              disabled={!isFormComplete()}
              // canProceed={isFormComplete()}
              canProceed={true}
              handleProceed={handleProceed}
              locationInfo={locationInfo}
              discount={discount}
              totalAmount={totalAmount}
              backButtonText="ย้อนกลับ"
              proceedButtonText="ชำระเงิน"
            />
          </div>
        </div>
      </div>
    </StripeContext>
  );
};

export default PaymentPage;
