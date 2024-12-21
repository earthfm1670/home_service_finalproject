import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ClipboardList, FileText, CreditCard } from "lucide-react";

export const ProgressStepsNew = ({ currentStep }: { currentStep: number }) => {
  const [animatedStep, setAnimatedStep] = useState(currentStep);

  useEffect(() => {
    setAnimatedStep(currentStep);
  }, [currentStep]);

  return (
    <div className="lg:flex lg:justify-center">
      <Card className="p-4 mt-5 g:p-6 lg:mt-8 lg:p-8 lg:w-[1118px]">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-[16%] right-[16%] h-0.5 bg-gray-200" />
          {/* Blue Progress Line */}
          <div
            className="absolute top-5 left-[17%] h-0.5 bg-blue-500 transition-all duration-300"
            style={{ width: `${((animatedStep - 1) / 2) * 66}%` }}
          />

          <div className="relative flex justify-between max-w-none mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 flex-1 ">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  animatedStep > 1
                    ? "bg-blue-500"
                    : animatedStep === 1
                    ? "bg-white border-2 border-blue-500"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <ClipboardList
                  className={`w-5 h-5 ${
                    animatedStep > 1
                      ? "text-white"
                      : animatedStep === 1
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-xs lg:text-sm font-medium ${
                  animatedStep >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                รายการ
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  animatedStep > 2
                    ? "bg-blue-500"
                    : animatedStep === 2
                    ? "bg-white border-2 border-blue-500"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <FileText
                  className={`w-5 h-5 ${
                    animatedStep > 2
                      ? "text-white"
                      : animatedStep === 2
                      ? "text-blue-500"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-xs lg:text-sm font-medium ${
                  animatedStep >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                กรอกข้อมูลบริการ
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  animatedStep === 3
                    ? "bg-white border-2 border-blue-500"
                    : "bg-white border-2 border-gray-200"
                }`}
              >
                <CreditCard
                  className={`w-5 h-5 ${
                    animatedStep === 3 ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`mt-2 text-xs lg:text-sm font-medium ${
                  animatedStep === 3 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                ชำระเงิน
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
