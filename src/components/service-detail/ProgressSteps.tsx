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
        <div className="absolute top-5 left-[16%] right-[16%] h-0.5 bg-gray-200" />
        {/* Blue Progress Line */}
        <div
          className="absolute top-5 left-[17%] h-0.5 bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 2) * 66}%` }}
        />

        <div className="relative flex justify-between max-w-none mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10 flex-1 ">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep > 1
                  ? "bg-blue-500"
                  : currentStep === 1
                  ? "bg-white border-2 border-blue-500"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              <ClipboardList
                className={`w-5 h-5 ${
                  currentStep > 1
                    ? "text-white"
                    : currentStep === 1
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs lg:text-sm font-medium ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              รายการ
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep > 2
                  ? "bg-blue-500"
                  : currentStep === 2
                  ? "bg-white border-2 border-blue-500"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              <FileText
                className={`w-5 h-5 ${
                  currentStep > 2
                    ? "text-white"
                    : currentStep === 2
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs lg:text-sm font-medium ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              กรอกข้อมูลบริการ
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 3
                  ? "bg-white border-2 border-blue-500"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              <CreditCard
                className={`w-5 h-5 ${
                  currentStep === 3 ? "text-blue-500" : "text-gray-400"
                }`}
              />
            </div>
            <span
              className={`mt-2 text-xs lg:text-sm font-medium ${
                currentStep === 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              ชำระเงิน
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressSteps;
