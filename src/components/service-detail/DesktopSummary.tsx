import React from "react";
import { Card } from "@/components/ui/card";
import type { Service } from "@/types/service";

interface DesktopSummaryProps {
  getSelectedServices: () => Service["sub_services"];
  getQuantityDisplay: (subServiceId: number) => number;
  calculateTotal: () => number;
}

export const DesktopSummary = ({
  getSelectedServices,
  getQuantityDisplay,
  calculateTotal,
}: DesktopSummaryProps) => {
  return (
    <div className="hidden lg:block">
      <Card className="p-6 sticky top-4">
        <h2 className="text-lg text-gray-500 mb-4">สรุปรายการ</h2>
        <div className="space-y-4">
          {getSelectedServices().map((subService) => (
            <div key={subService.id} className="flex justify-between text-sm">
              <span>
                {subService.description} x {getQuantityDisplay(subService.id)}
              </span>
              <span>
                {(
                  subService.unit_price * getQuantityDisplay(subService.id)
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
  );
};

export default DesktopSummary;
