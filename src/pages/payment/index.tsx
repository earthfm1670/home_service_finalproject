import React, { useEffect, useState } from "react";
import StripeContext from "@/components/StripeContext";
import PaymentForm from "@/components/PaymentForm";
import { Navbar } from "@/components/navbar";
import { ProgressStepsNew } from "@/components/service-detail/ProgressSteps";
import Link from "next/link";

//stand alone payment page, need to connect to service info later
const PaymentPage: React.FC = () => {
  const [service, setService] = useState<{
    service_picture_url: string;
    service_name: string;
  } | null>(null);

  const [currentStep, setCurrentStep] = useState(3);

  useEffect(() => {
    //Simulate API call to fetch service data
    setService({
      service_picture_url: "https://via.placeholder.com/1920x1080",
      service_name: "Service Name",
    });
  }, []);

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <StripeContext>
      {/* <h1>Payment Page</h1> */}
      <Navbar />
      {/* Hero Section */}
      <div className="relative h-[168px] w-full lg:h-56">
        <img
          src={service.service_picture_url}
          alt={service.service_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#163C9366]">
          <div className="px-4 pt-9 lg:px-32 lg:mt-5">
            {/* Breadcrumb */}
            <div className="">
              <div className="bg-white rounded-md py-2 px-4 inline-flex items-center space-x-2 lg:p-5">
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  บริการของเรา
                </Link>
                <span className="text-gray-500 text">&gt;</span>
                <span className="text-blue-600 font-bold text-3xl">
                  {service.service_name}
                </span>
              </div>
            </div>

            <ProgressStepsNew currentStep={currentStep} />
          </div>
        </div>
      </div>
      <PaymentForm />
    </StripeContext>
  );
};

export default PaymentPage;
