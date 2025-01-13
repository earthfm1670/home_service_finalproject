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
import { CartSkeleton } from "@/components/service-detail/CartSkeleton";

async function getService(
  id: string
): Promise<{ data: Service | null; error?: string }> {
  const domainName = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${domainName}/api/services/${id}`);
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
  const [finalLoading, setFinalLoading] = useState(false);
  // deifnde path protechtion
  const pathProtect = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
    } else {
      setFinalLoading(true);
    }
  };
  // Load service and quantities from storage
  useEffect(() => {
    pathProtect();
    if (!id) return;

    const loadData = async () => {
      // Load service if not available
      if (!service) {
        setIsLoading(true);
        const serviceId = Array.isArray(id) ? id[0] : id;
        const result = await getService(serviceId);
        if (result.data) {
          setService(result.data);
        }
      }

      // Load quantities from localStorage
      const savedQuantities = localStorage.getItem(`quantities_${id}`);
      if (savedQuantities) {
        try {
          const parsedQuantities = JSON.parse(savedQuantities);
          setQuantities(parsedQuantities);
        } catch (error) {
          console.error("Error parsing saved quantities:", error);
        }
      }
    };

    loadData();
  }, [id, service]);

  // Check if can proceed whenever quantities change
  useEffect(() => {
    const hasSelectedServices = Object.values(quantities).some(
      (item) => item.quantity > 0
    );
    setCanProceed(hasSelectedServices);
  }, [quantities]);

  const saveQuantities = (newQuantities: Record<number, ServiceQuantity>) => {
    if (id) {
      localStorage.setItem(`quantities_${id}`, JSON.stringify(newQuantities));
    }
  };

  const handleQuantityChange = (subServiceId: number, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = (prev[subServiceId]?.quantity || 0) + change;

      let newQuantities;
      if (currentQuantity <= 0) {
        const { [subServiceId]: ignored, ...rest } = prev;
        void ignored;
        newQuantities = rest as Record<number, ServiceQuantity>;
      } else {
        newQuantities = {
          ...prev,
          [subServiceId]: { quantity: currentQuantity },
        };
      }

      saveQuantities(newQuantities);
      return newQuantities;
    });
  };

  if (isLoading) {
    return <ServiceHeroSkeleton />;
  }

  if (!service) {
    return <div>Service not found</div>;
  }

  const calculateTotal = () => {
    return service.sub_services.reduce((total, subService) => {
      const quantity = quantities[subService.id]?.quantity || 0;
      return total + quantity * subService.unit_price;
    }, 0);
  };

  const getSelectedServices = () => {
    return service.sub_services
      .filter((subService) => (quantities[subService.id]?.quantity || 0) > 0)
      .map((subService) => ({
        ...subService,
        quantity: quantities[subService.id]?.quantity || 0,
        discount: 0,
        totalAmount:
          (quantities[subService.id]?.quantity || 0) * subService.unit_price,
        canProceed: true,
        handleProceed: handleProceed,
      }));
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
      // if (!authState.user) {
      //   // ถ้าผู้ใช้ยังไม่ได้ล็อกอิน ให้ redirect ไปหน้า login
      //   router.push("/login");
      //   return;
      // }
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
      saveQuantities(quantities);
      router.push(`/serviceinfo`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <Navbar />

      <ServiceHero service={service} />
      {finalLoading ? (
        <div className="container mx-auto px-4 lg:px-20 mt-14 lg:mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
            <div className="lg:col-span-2">
              <ServiceList
                service={service}
                handleQuantityChange={handleQuantityChange}
                getQuantityDisplay={getQuantityDisplay}
              />
            </div>

            <div className="lg:col-span-1">
              <DesktopSummary
                getSelectedServices={getSelectedServices}
                getQuantityDisplay={getQuantityDisplay}
                calculateTotal={calculateTotal}
                getPriceDisplay={getPriceDisplay}
                totalAmount={calculateTotal()}
              />
            </div>
          </div>
        </div>
      ) : (
        <CartSkeleton />
      )}

      <MobileBottomBar
        canProceed={canProceed}
        calculateTotal={calculateTotal}
        getSelectedServices={getSelectedServices}
        getQuantityDisplay={getQuantityDisplay}
        handleProceed={handleProceed}
        disabled={!canProceed}
        discount={0}
        totalAmount={calculateTotal()}
        backButtonText="ย้อนกลับ"
        proceedButtonText="ดำเนินการต่อ"
      />

      <NavigationButtons
        canProceed={canProceed}
        handleProceed={handleProceed}
        disabled={!canProceed}
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
