import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";

interface NavigationButtonsProps {
  canProceed: boolean;
  disabled: boolean;
  handleProceed: () => void;
  onBack?: () => void; // เพิ่ม prop สำหรับการจัดการการกลับ
  backButtonText?: string; // เพิ่ม prop สำหรับข้อความปุ่มย้อนกลับ
  proceedButtonText?: string; // เพิ่ม prop สำหรับข้อความปุ่มดำเนินการต่อ
}

export const NavigationButtons = ({
  canProceed,
  handleProceed,
  onBack,
  backButtonText = "ย้อนกลับ",
  proceedButtonText = "ดำเนินการต่อ",
}: NavigationButtonsProps) => {
  const router = useRouter();
  const isServiceInfoPage = router.pathname.includes("/info");

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  return (
    <div
      className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t"
      style={{ zIndex: 9999 }}
    >
      <div className="px-4 py-4 lg:px-40">
        <div className="flex justify-between">
          <Button
            variant="outline"
            className={`px-8 ${
              isServiceInfoPage
                ? "border-blue-500 text-blue-500"
                : "border-grey-500 text-grey-500"
            }`}
            onClick={handleBack}
          >
            <ChevronLeft
              className={`h-4 w-4 mr-2 ${
                isServiceInfoPage ? "text-blue-500" : "text-grey-500"
              }`}
            />
            {backButtonText}
          </Button>
          <Button
            className={`px-8 ${
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

export default NavigationButtons;
