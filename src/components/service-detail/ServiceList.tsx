import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Tag } from "lucide-react";
import type { Service } from "@/types/service";

interface ServiceListProps {
  service: Service;
  handleQuantityChange: (subServiceId: number, change: number) => void;
  getQuantityDisplay: (subServiceId: number) => number;
}

export const ServiceList = ({
  service,
  handleQuantityChange,
  getQuantityDisplay,
}: ServiceListProps) => {
  return (
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
                    {subService.unit_price.toFixed(2)} ฿ / {subService.unit}
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
                      : "border-blue-600 text-blue-600"
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
                      : "border-blue-600 text-blue-600"
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
  );
};

export default ServiceList;
