import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import MobileSummary from "@/components/service-detail/MobileSummary";
import type { SubService } from "@/types/service";

interface LocationInfo {
  date: Date | string | null;
  time: string | null;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  additionalDetails?: string;
}
interface MobileBottomBarProps {
  canProceed: boolean;
  disabled: boolean;
  calculateTotal: () => number;
  getSelectedServices: () => SubService[]; 
  getQuantityDisplay: (subServiceId: number) => number;
  handleProceed: () => void;
  locationInfo?: LocationInfo;
  isServiceInfoPage?: boolean;
  discount: number;
  totalAmount: number;
  backButtonText: string;
  proceedButtonText: string;
}
interface LocationInfo {
  date: string | Date | null;
  time: string | null;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  additionalDetails?: string;
}

export const MobileBottomBar = ({
  canProceed,
  // disabled,
  calculateTotal,
  getSelectedServices,
  getQuantityDisplay,
  handleProceed,
  locationInfo,
  isServiceInfoPage = false,
  discount,
  totalAmount,
  backButtonText = "ย้อนกลับ",
  proceedButtonText = "ดำเนินการต่อ",
}: MobileBottomBarProps) => {
  const router = useRouter();
  
  const parsedLocationInfo = locationInfo
    ? {
        ...locationInfo,
        date: locationInfo.date ? new Date(locationInfo.date) : null,
      }
    : undefined;


  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden">
      {/* Mobile Summary */}
      <MobileSummary
        getSelectedServices={getSelectedServices}
        getQuantityDisplay={getQuantityDisplay}
        calculateTotal={calculateTotal}
        locationInfo={parsedLocationInfo}
        discount={discount}
        totalAmount={totalAmount}
      />

      {/* Navigation Buttons */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className={`flex-1 ${
              isServiceInfoPage
                ? "border-blue-500 text-blue-500"
                : "border-grey-500 text-grey-500"
            }`}
            onClick={() => router.back()}
          >
            <ChevronLeft
              className={`h-4 w-4 mr-2 ${
                isServiceInfoPage ? "text-blue-500" : "text-grey-500"
              }`}
            />
            {backButtonText}
          </Button>
          <Button
            className={`flex-1 ${
              canProceed ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            disabled={!canProceed}
            onClick={handleProceed}
          >
            {proceedButtonText}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomBar;
