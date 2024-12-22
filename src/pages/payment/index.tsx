import React, { useEffect, useState } from "react";
import StripeContext from "@/components/StripeContext";
import PaymentForm from "@/components/PaymentForm";
import { Navbar } from "@/components/navbar";
import { ProgressStepsNew } from "@/components/service-detail/ProgressSteps";
import Link from "next/link";
import MobileSummary from "@/components/service-detail/MobileSummary";
import MobileBottomBar from "@/components/service-detail/MobileBottomBar";
import ServiceHero from "@/components/service-detail/ServiceHero";
import { useRouter } from "next/router";
import type { Service } from "@/types/service";
import DesktopSummary from "@/components/service-detail/DesktopSummary";
import {
  isWeekend,
  isAfter,
  isBefore,
  isSameDay,
  startOfToday,
  addDays,
  isSaturday,
  isSunday,
} from "date-fns";
import NavigationButtons from "@/components/service-detail/NavigationButtons";

//stand alone payment page, need to connect to service info later
const PaymentPage: React.FC = ({ initialService }: ServiceInfoPageProps) => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(
    initialService || null
  );
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedServices, setSelectedServices] =
    useState<SelectedServicesData | null>(null);
  const [locationInfo, setLocationInfo] = useState({
    date: "",
    time: "",
    address: "",
    subDistrict: "",
    district: "",
    province: "",
  });

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | string | null>(null);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [address, setAddress] = useState<string>("");

  const [timeError, setTimeError] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState<string>("");

  interface ServiceInfoPageProps {
    initialService?: Service | null;
  }

  interface SubService {
    id: number;
    description: string;
    sub_service_id: number;
    unit: string;
    unit_price: number;
  }

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
      setLocationInfo(parsedData);
    }
  }, [service]);
  // End of useEffect

  const getSelectedServices = () => selectedServices?.selections || [];

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

  const isFormComplete = (): boolean => {
    const isServicesSelected =
      selectedServices && selectedServices.selections.length > 0;
    const isPaymentInfoComplete = payment !== null;
    return isServicesSelected && isPaymentInfoComplete;
  };

  const handleProceed = () => {
    // if (!isFormComplete()) {
    //   alert("Please complete all required fields before proceeding.");
    //   return;
    // }
    console.log("Selected Services Before Nav:", selectedServices);
    console.log("date", locationInfo.date);
    console.log("time", locationInfo.time);
    console.log("address", locationInfo.address);
    router.push({
      pathname: "/paymentsuccess",
      query: {
        selectedServices: JSON.stringify(selectedServices),
        date: locationInfo.date,
        time: locationInfo.time,
        address: locationInfo.address,
      },
    });
  };

  return (
    <StripeContext>
      <div className="bg-gray-100">
        <div className="flex flex-col h-min-screen">
          {/* <h1>Payment Page</h1> */}
          <Navbar />
          {/* Hero Section */}
          <ServiceHero service={service} />
        </div>

        <div className="mt-14 lg:flex lg:mt-28 lg:flex-row lg:justify-center lg:gap-5 lg:mr-4">
          <div className="overflow-y-auto pb-28 lg:pb-0">
            <PaymentForm setDiscount={setDiscount} />
          </div>
          <div className="lg:w-[349px] lg:h-[374px]">
            <DesktopSummary
              getSelectedServices={getSelectedServices}
              getQuantityDisplay={getQuantityDisplay}
              calculateTotal={calculateTotal}
              // canProceed={isFormComplete()}
              canProceed={true}
              handleProceed={handleProceed}
              locationInfo={locationInfo}
              discount={discount}
              totalAmount={totalAmount}
            />
          </div>
        </div>
        <div className="">
          <NavigationButtons
            // canProceed={isFormComplete()}
            canProceed={true}
            handleProceed={handleProceed}
            backButtonText="ย้อนกลับ"
            proceedButtonText="ดำเนินการต่อ"
          />
        </div>
        <div className="sticky bottom-0 z-10">
          <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
            <MobileBottomBar
              getSelectedServices={getSelectedServices}
              getQuantityDisplay={getQuantityDisplay}
              calculateTotal={calculateTotal}
              canProceed={isFormComplete()}
              handleProceed={handleProceed}
              locationInfo={locationInfo}
              discount={discount}
              totalAmount={totalAmount}
            />
          </div>
        </div>
      </div>
    </StripeContext>
  );
};

export default PaymentPage;
