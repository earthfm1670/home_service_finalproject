import React from "react";
import { Card } from "@/components/ui/card";
import { ClipboardList, FileText, CreditCard } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  return (
    <Card className="p-4 mt-5 g:p-6 lg:mt-8 lg:p-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-[17%] right-[17%] h-0.5 bg-gray-200" />
        {/* Blue Progress Line */}
        <div
          className="absolute top-5 left-[15%] h-0.5 bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 2) * 70}%` }}
        />

        <div className="relative flex justify-between max-w-none mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10 flex-1 ">
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
  );
};

export default ProgressSteps;
