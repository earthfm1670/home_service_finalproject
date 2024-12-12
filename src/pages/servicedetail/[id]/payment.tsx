import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import ProgressSteps from "@/components/service-detail/ProgressSteps";
import ServiceList from "@/components/service-detail/ServiceList";
import DesktopSummary from "@/components/service-detail/DesktopSummary";
import MobileBottomBar from "@/components/service-detail/MobileBottomBar";
import NavigationButtons from "@/components/service-detail/NavigationButtons";
import type { Service } from "@/types/service";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutform";

// publishable-key
const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

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

interface ServiceDetailPageProps {
  initialService: Service | null;
}

interface ServiceQuantity {
  quantity: number;
}

const ServiceDetailPage = ({ initialService }: ServiceDetailPageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [service, setService] = useState<Service | null>(initialService);
  const [quantities, setQuantities] = useState<Record<number, ServiceQuantity>>(
    {}
  );
  const [canProceed, setCanProceed] = useState(false);
  const [currentStep] = useState(1);

  useEffect(() => {
    if (id && !service) {
      const serviceId = Array.isArray(id) ? id[0] : id;
      getService(serviceId).then((result) => {
        if (result.data) {
          setService(result.data);
        }
      });
    }
  }, [id, service]);

  useEffect(() => {
    const hasSelectedServices = Object.values(quantities).some(
      (item) => item.quantity > 0
    );
    setCanProceed(hasSelectedServices);
  }, [quantities]);

  if (!service) {
    return <div>Loading...</div>;
  }

  const handleQuantityChange = (subServiceId: number, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = (prev[subServiceId]?.quantity || 0) + change;

      if (currentQuantity <= 0) {
        const { [subServiceId]: ignored, ...rest } = prev;
        void ignored;
        return rest as Record<number, ServiceQuantity>;
      }

      return {
        ...prev,
        [subServiceId]: { quantity: currentQuantity },
      };
    });
  };

  const calculateTotal = () => {
    return service.sub_services.reduce((total, subService) => {
      const quantity = quantities[subService.id]?.quantity || 0;
      return total + quantity * subService.unit_price;
    }, 0);
  };

  const getSelectedServices = () => {
    return service.sub_services.filter(
      (subService) => (quantities[subService.id]?.quantity || 0) > 0
    );
  };

  const getQuantityDisplay = (subServiceId: number) => {
    return quantities[subServiceId]?.quantity || 0;
  };

  const handleProceed = () => {
    if (canProceed) {
      const selectedServicesData = {
        serviceId: id,
        serviceName: service.service_name,
        selections: getSelectedServices().map((subService) => ({
          id: subService.id,
          description: subService.description,
          quantity: quantities[subService.id].quantity,
          unitPrice: subService.unit_price,
          total: subService.unit_price * quantities[subService.id].quantity,
        })),
        totalAmount: calculateTotal(),
      };
      sessionStorage.setItem(
        "selectedServices",
        JSON.stringify(selectedServicesData)
      );
      router.push(`/servicedetail/${id}/info`);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      {/* Navbar */}
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

            <ProgressSteps currentStep={currentStep} />
          </div>
        </div>
      </div>

      <MobileBottomBar
        canProceed={canProceed}
        calculateTotal={calculateTotal}
        getSelectedServices={getSelectedServices}
        getQuantityDisplay={getQuantityDisplay}
        handleProceed={handleProceed}
      />

      <NavigationButtons
        canProceed={canProceed}
        handleProceed={handleProceed}
      />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as { id: string };
  const serviceData = await getService(id);

  if (!serviceData.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialService: serviceData.data },
  };
}

export default ServiceDetailPage;
