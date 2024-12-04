import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Service } from "@/types/service";

interface MobileSummaryProps {
  getSelectedServices: () => Service["sub_services"];
  getQuantityDisplay: (subServiceId: number) => number;
  calculateTotal: () => number;
}

export const MobileSummary = ({
  getSelectedServices,
  getQuantityDisplay,
  calculateTotal,
}: MobileSummaryProps) => {
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

  return (
    <div className="rounded-t-2xl bg-white shadow-sm">
      <Collapsible
        open={isOrderSummaryOpen}
        onOpenChange={setIsOrderSummaryOpen}
      >
        <CollapsibleTrigger asChild>
          <div className="w-full bg-white rounded-t-2xl cursor-pointer border">
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
                    <span className="text-sm">{subService.description}</span>
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
  );
};

export default MobileSummary;
