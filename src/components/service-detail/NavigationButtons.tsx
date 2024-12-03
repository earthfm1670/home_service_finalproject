import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";

interface NavigationButtonsProps {
  canProceed: boolean;
  handleProceed: () => void;
}

export const NavigationButtons = ({
  canProceed,
  handleProceed,
}: NavigationButtonsProps) => {
  const router = useRouter();

  return (
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
  );
};

export default NavigationButtons;
