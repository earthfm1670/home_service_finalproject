import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useTimer } from "@/context/TimerContext";

interface DesktopSummaryProps {
  getSelectedServices: () => Array<{
    id: number;
    description: string;
    unit?: string;
    unit_price: number;
  }>;
  getQuantityDisplay: (subServiceId: number) => number;
  calculateTotal: () => number;
  getPriceDisplay: (id: number) => number;
  locationInfo?: {
    province: string;
    district: string;
    subDistrict: string;
    address: string;
    date: Date | null;
    time: string;
    additionalDetails?: string;
  };
  serviceInfo?: {
    name: string;
    description: string;
    unit: string;
    unit_price: number;
  };
  isServiceInfoPage?: boolean;
  isServiceDetailPage?: boolean;
  discount?: number;
  totalAmount: number;
  // canProceed?: boolean;
  // handleProceed?: () => void;
}

export const DesktopSummary: React.FC<DesktopSummaryProps> = ({
  getSelectedServices,
  getQuantityDisplay,
  calculateTotal,
  locationInfo,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serviceInfo,
  isServiceInfoPage = false,
  isServiceDetailPage = false,
  discount = 0,
  totalAmount,
  // canProceed,
  // handleProceed,
}) => {
  const preDiscountTotal = totalAmount;
  const discountAmount = preDiscountTotal * discount;
  const router = useRouter();
  const { timeLeft, startTimer, resetTimer } = useTimer();
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    if (router.pathname === "/payment") {
      startTimer();
    } else if (isServiceInfoPage) {
      resetTimer();
    }
  }, [router.pathname, isServiceInfoPage, startTimer, resetTimer]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimerExpired(true);
      let countdown = 5;

      const countdownInterval = setInterval(() => {
        countdown--;
        setRedirectCountdown(countdown);

        if (countdown === 0) {
          clearInterval(countdownInterval);
          router.back();
        }
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [timeLeft, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="hidden lg:block">
      <Card className="p-6 sticky top-4">
        <h2 className="text-lg text-gray-500 mb-4">สรุปรายการ</h2>

        {isServiceInfoPage && (
          <div className="mb-4">
            {getSelectedServices().map((subService) => {
              const quantity = getQuantityDisplay(subService.id);

              return (
                <div
                  key={subService.id}
                  className="flex justify-between text-sm mb-2"
                >
                  <span className="flex-grow pr-2 break-words">
                    {subService.description}
                  </span>
                  <span className="flex items-center gap-3 ml-2 text-right text-nowrap">
                    <span>{quantity}</span>
                    {subService.unit && <span>{subService.unit}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!isServiceDetailPage && (
          <div className="space-y-4">
            {getSelectedServices().map((subService) => {
              const quantity = getQuantityDisplay(subService.id);
              // const total = subService.unit_price * quantity;
              return (
                <div
                  key={subService.id}
                  className="flex justify-between text-sm mb-2"
                >
                  <span className="flex-grow pr-2 break-words">
                    {subService.description}
                  </span>
                  <span className="flex items-center gap-3 ml-2 text-right text-nowrap">
                    {quantity} รายการ
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {locationInfo && (
          <div className="mt-6 space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">วันที่</span>
              <span className="text-sm">
                {locationInfo.date
                  ? format(locationInfo.date, "d MMMM yyyy", { locale: th })
                  : "ยังไม่ได้เลือก"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">เวลา</span>
              <span className="text-sm">
                {locationInfo.time || "ยังไม่ได้เลือก"}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                สถานที่
              </span>
              <span className="text-right flex-1 text-sm">
                {locationInfo.address ||
                locationInfo.subDistrict ||
                locationInfo.district ||
                locationInfo.province
                  ? [
                      locationInfo.address,
                      locationInfo.subDistrict,
                      locationInfo.district,
                      locationInfo.province,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : "ไม่ได้ระบุ"}
              </span>
            </div>
            {locationInfo.additionalDetails && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                  ข้อมูลเพิ่มเติม
                </span>
                <span className="text-right flex-1 text-sm">
                  {locationInfo.additionalDetails}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          {/* Discount and Total Section */}
          {discount > 0 && (
            <div className="flex justify-between items-center mb-2">
              {/* Discount */}
              <span className="text-sm text-gray-700 font-normal">ส่วนลด</span>
              <span className="text-sm font-medium text-[#C82438]">
                -
                {discountAmount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {" ฿"}
              </span>
            </div>
          )}

          {/* Countdown Timer or Expiration Message */}
          {router.pathname === "/payment" && (
            <div className="flex flex-col items-center mb-4 text-center">
              {isTimerExpired ? (
                <span className="text-sm text-red-600 font-medium">
                  กำลังพาคุณกลับไปยังหน้าเลือกบริการใน {redirectCountdown}{" "}
                  วินาที
                </span>
              ) : (
                <>
                  <span className="text-sm text-gray-700 font-normal mb-1">
                    กรุณาชำระเงินภายใน
                  </span>
                  <span className="text-lg font-semibold text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-xs text-gray-500">
                    หากไม่ชำระภายในเวลาที่กำหนด รายการสั่งซื้อจะถูกยกเลิก
                  </span>
                </>
              )}
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center font-semibold">
            <span className="text-[16px] text-gray-700 font-normal">รวม</span>
            <span className="text[16px] text-black font-semibold">
              {calculateTotal().toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {" ฿"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DesktopSummary;
