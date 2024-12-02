import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import MobileSummary from "@/components/service-detail/MobileSummary";
import type { Service } from "@/types/service";

interface MobileBottomBarProps {
  canProceed: boolean;
  calculateTotal: () => number;
  getSelectedServices: () => Service["sub_services"];
  getQuantityDisplay: (subServiceId: number) => number;
  handleProceed: () => void;
}

export const MobileBottomBar = ({
  canProceed,
  calculateTotal,
  getSelectedServices,
  getQuantityDisplay,
  handleProceed,
}: MobileBottomBarProps) => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden">
      {/* Mobile Summary */}
      <MobileSummary
        getSelectedServices={getSelectedServices}
        getQuantityDisplay={getQuantityDisplay}
        calculateTotal={calculateTotal}
      />

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
  );
};

export default MobileBottomBar;
