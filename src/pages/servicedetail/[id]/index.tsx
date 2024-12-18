import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { Navbar } from "@/components/navbar";
import ServiceHero from "@/components/service-detail/ServiceHero";
import ServiceList from "@/components/service-detail/ServiceList";
import DesktopSummary from "@/components/service-detail/DesktopSummary";
import MobileBottomBar from "@/components/service-detail/MobileBottomBar";
import NavigationButtons from "@/components/service-detail/NavigationButtons";
import type { Service } from "@/types/service";
import { ServiceHeroSkeleton } from "@/components/service-detail/ServiceHeroSkeleton";

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
  const [isLoading, setIsLoading] = useState(!initialService);

  useEffect(() => {
    if (id && !service) {
      setIsLoading(true);
      const serviceId = Array.isArray(id) ? id[0] : id;
      getService(serviceId).then((result) => {
        if (result.data) {
          setService(result.data);
        }
        setIsLoading(false);
      });
    }
  }, [id, service]);

  useEffect(() => {
    const hasSelectedServices = Object.values(quantities).some(
      (item) => item.quantity > 0
    );
    setCanProceed(hasSelectedServices);
  }, [quantities]);

  if (isLoading) {
    return <ServiceHeroSkeleton />;
  }

  if (!service) {
    return <div>Service not found</div>;
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

  const getPriceDisplay = (subServiceId: number) => {
    const subService = service?.sub_services.find((s) => s.id === subServiceId);
    const quantity = quantities[subServiceId]?.quantity || 0;
    return subService ? subService.unit_price * quantity : 0;
  };

  const handleProceed = () => {
    if (canProceed) {
      const selectedServicesData = {
        serviceId: id,
        serviceName: service.service_name,
        servicePictureUrl: service.service_picture_url,
        selections: getSelectedServices().map((subService) => ({
          id: subService.id,
          description: subService.description,
          quantity: quantities[subService.id].quantity,
          unit: subService.unit,
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
      <Navbar />
      <ServiceHero service={service} />

      {/* Main Content */}
      <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ServiceList
            service={service}
            handleQuantityChange={handleQuantityChange}
            getQuantityDisplay={getQuantityDisplay}
          />

          <DesktopSummary
            getSelectedServices={getSelectedServices}
            getQuantityDisplay={getQuantityDisplay}
            calculateTotal={calculateTotal}
            getPriceDisplay={getPriceDisplay}
          />
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
