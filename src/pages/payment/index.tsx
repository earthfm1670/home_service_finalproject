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
  const [service, setService] = useState<Service | null>(
    initialService || null
  );
  const [selectPaymentData, setSelectPaymentData] =
    useState<SelectedPaymentData | null>(null);
  const router = useRouter();

  const [selectedServices, setSelectedServices] =
    useState<SelectedServicesData | null>(null);

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
    // Load selected services from session storage
    const servicesData = sessionStorage.getItem("selectedServices");
    const paymentData = sessionStorage.getItem("paymentData");
    if (servicesData) {
      const parsedData = JSON.parse(servicesData);
      setSelectedServices(parsedData);

      if (paymentData) {
        const parsedData = JSON.parse(paymentData);
        setSelectedServices(parsedData);
      }

      // Fetch service details if not provided as props
      if (!service && parsedData.serviceId) {
        getService(parsedData.serviceId).then((result) => {
          if (result.data) {
            setService(result.data);
          }
        });
      }
    }
  }, [service]);

  const getSelectedServices: () => SubService[] = () => [
    {
      id: 1,
      description: "Service A",
      sub_service_id: 101,
      unit: "hours",
      unit_price: 100,
    },
    {
      id: 2,
      description: "Service B",
      sub_service_id: 102,
      unit: "days",
      unit_price: 200,
    },
  ];

  const getQuantityDisplay = (subServiceId: number) => 2;
  const calculateTotal = () => 1500;

  const [currentStep, setCurrentStep] = useState(3);

  // useEffect(() => {
  //   //Simulate API call to fetch service data
  //   setService({
  //     service_picture_url: "https://via.placeholder.com/1920x1080",
  //     service_name: "Service Name",
  //   });
  // }, []);

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

  return (
    <StripeContext>
      <div className="flex flex-col h-min-screen">
        {/* <h1>Payment Page</h1> */}
        <Navbar />
        {/* Hero Section */}
        <ServiceHero service={service} />
      </div>
      <div className="flex-1 overflow-y-auto pb-20">
        <PaymentForm />
      </div>
      <div className="sticky bottom-0 z-10">
        <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Location Form */}

            {/* Summary Section */}
            <DesktopSummary
              getSelectedServices={() => selectedServices?.selections || []}
              getQuantityDisplay={(id: number) =>
                selectedServices?.selections.find((s) => s.id === id)
                  ?.quantity || 0
              }
              calculateTotal={() => {
                const total = selectedServices?.totalAmount;
                return typeof total === "number" && !isNaN(total) ? total : 0;
              }}
              getPriceDisplay={(id: number) => {
                const service = selectedServices?.selections.find(
                  (s) => s.id === id
                );
                return typeof service?.unit_price === "number" &&
                  !isNaN(service?.unit_price)
                  ? service.unit_price
                  : 0;
              }}
              isServiceInfoPage={true}
              isServiceDetailPage={true}
            />
          </div>
        </div>
        {/* divider */}
        <MobileSummary
          getSelectedServices={getSelectedServices}
          getQuantityDisplay={getQuantityDisplay}
          calculateTotal={calculateTotal}
        />
        <MobileBottomBar
          canProceed
          calculateTotal={calculateTotal}
          getSelectedServices={getSelectedServices}
          getQuantityDisplay={getQuantityDisplay}
          handleProceed={() => console.log("Proceed")}
          isServiceInfoPage
        />
      </div>
    </StripeContext>
  );
};

export default PaymentPage;
