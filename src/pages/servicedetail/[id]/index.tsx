import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ClipboardList,
  FileText,
  CreditCard,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Navbar } from "@/components/navbar";
import type { Service } from "@/types/service";
import { GetServerSidePropsContext } from "next";

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
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
        const { [subServiceId]: _, ...rest } = prev;
        return rest;
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
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[168px] w-full lg:h-56">
        <img
          src={service.service_picture_url}
          alt={service.service_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#163C9366]">
          <div className="max-w-7xl mx-auto px-4 pt-16 ">
            {/* Breadcrumb */}
            <div className="mb-4">
              <div className="bg-white rounded-md py-2 px-4 inline-flex items-center space-x-2 lg:p-5">
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  บริการของเรา
                </Link>
                <span className="text-gray-500 text">&gt;</span>
                <span className="text-blue-600 font-bold text-xl">
                  {service.service_name}
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            <Card className="p-4 mt-4 lg:p-6 lg:mt-12">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-[15%] right-[15%] h-0.5 bg-gray-200" />
                {/* Blue Progress Line */}
                <div
                  className="absolute top-5 left-[15%] h-0.5 bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 2) * 70}%` }}
                />

                <div className="relative flex justify-between max-w-none mx-auto">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center relative z-10 flex-1">
                    <div className="w-10 h-10 rounded-full bg-white border-2 bg-grey-200 border-blue-500 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="mt-2 text-xs lg:text-sm font-medium text-blue-600">
                      รายการ
                    </span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center relative z-10 flex-1">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="mt-2 text-xs lg:text-sm font-medium text-gray-400">
                      กรอกข้อมูลบริการ
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center relative z-10 flex-1">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="mt-2 text-xs lg:text-sm font-medium text-gray-400">
                      ชำระเงิน
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-10 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl text-gray-500 mb-6">
                เลือกรายการบริการ{service.service_name}
              </h2>
              <div className="space-y-6">
                {service.sub_services.map((subService) => (
                  <div
                    key={subService.id}
                    className="flex items-start justify-between pb-6 border-b last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <h3 className="font-medium">{subService.description}</h3>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Tag className="w-3 h-3" />
                        <p className="text-sm">
                          {subService.unit_price.toFixed(2)} ฿ /{" "}
                          {subService.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 pt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-8 w-8 ${
                          getQuantityDisplay(subService.id) > 0
                            ? "border-blue-600 text-blue-600"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(subService.id, -1);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {getQuantityDisplay(subService.id)}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-8 w-8 ${
                          getQuantityDisplay(subService.id) > 0
                            ? "border-blue-600 text-blue-600"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(subService.id, 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Desktop Summary */}
          <div className="hidden lg:block">
            <Card className="p-6 sticky top-4">
              <h2 className="text-lg text-gray-500 mb-4">สรุปรายการ</h2>
              <div className="space-y-4">
                {getSelectedServices().map((subService) => (
                  <div
                    key={subService.id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {subService.description} x{" "}
                      {getQuantityDisplay(subService.id)}
                    </span>
                    <span>
                      {(
                        subService.unit_price *
                        getQuantityDisplay(subService.id)
                      ).toFixed(2)}{" "}
                      ฿
                    </span>
                  </div>
                ))}
                <div className="pt-4 border-t flex justify-between font-semibold">
                  <span>รวม</span>
                  <span>{calculateTotal().toFixed(2)} ฿</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden">
        {/* Mobile Summary */}
        <div className="rounded-t-2xl bg-white shadow-sm">
          <Collapsible
            open={isOrderSummaryOpen}
            onOpenChange={setIsOrderSummaryOpen}
          >
            <CollapsibleTrigger asChild>
              <div className="w-full bg-white rounded-t-2xl cursor-pointer  border">
                <div className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base text-gray-500">สรุปรายการ</span>
                    {isOrderSummaryOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  {!isOrderSummaryOpen && (
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">รวม</span>
                      <span className="text-base font-semibold">
                        {calculateTotal().toFixed(2)} ฿
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="px-4 py-3 bg-white border-t">
                {getSelectedServices().length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {getSelectedServices().map((subService) => (
                      <div
                        key={subService.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm">
                          {subService.description}
                        </span>
                        <span className="text-sm text-blue-600">
                          {getQuantityDisplay(subService.id)} รายการ
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <span className="text-sm text-gray-600">รวม</span>
                      <span className="text-base font-semibold">
                        {calculateTotal().toFixed(2)} ฿
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 text-center">
                      ไม่มีรายการที่เลือก
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">รวม</span>
                      <span className="text-base font-semibold">
                        {calculateTotal().toFixed(2)} ฿
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-blue-500 text-blue-500"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-2 text-blue-500" />
              ย้อนกลับ
            </Button>
            <Button
              className={`flex-1 ${
                canProceed ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              disabled={!canProceed}
              onClick={handleProceed}
            >
              ดำเนินการต่อ
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="px-8 border-blue-500 text-blue-500"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-2 text-blue-500" />
              ย้อนกลับ
            </Button>
            <Button
              className={`px-8 ${
                canProceed ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
              disabled={!canProceed}
              onClick={handleProceed}
            >
              ดำเนินการต่อ
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
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
