import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTimer } from "@/context/TimerContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SubService } from "@/types/service";
import { format } from "date-fns";
import { th } from "date-fns/locale";
interface LocationInfo {
  date: Date | null;
  time: string | null;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  additionalDetails?: string;
}

interface PaymentInfo {
  date: Date | null;
  time: string | null;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  additionalDetails?: string;
}

interface MobileSummaryProps {
  getSelectedServices: () => SubService[];
  getQuantityDisplay: (subServiceId: number) => number;
  calculateTotal: () => number;
  locationInfo?: LocationInfo;
  payment?: PaymentInfo;
  discount: number;
  totalAmount: number;
}

export const MobileSummary = ({
  getSelectedServices,
  getQuantityDisplay,
  calculateTotal,
  locationInfo,
  payment,
  discount = 0,
  totalAmount,
}: MobileSummaryProps & {
  discount?: number;
}) => {
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  // const [sessionData, setSessionData] = useState<{
  //   totalAmount: number;
  // } | null>(null);
  // const [loading, setLoading] = useState<boolean>(true);
  const preDiscountTotal = totalAmount;
  const discountAmount = preDiscountTotal * discount;
  const router = useRouter();
  const { timeLeft } = useTimer();
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [isExpired, setIsExpired] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setIsExpired(true);
      let countdown = 5;

      const countdownInterval = setInterval(() => {
        countdown--;
        setRedirectCountdown(countdown);

        if (countdown === 0) {
          clearInterval(countdownInterval);
          router.push("/servicelist");
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [timeLeft, router]);

  return (
    <div className="rounded-t-2xl bg-white shadow-sm">
      <Collapsible
        open={isOrderSummaryOpen}
        onOpenChange={setIsOrderSummaryOpen}
      >
        <CollapsibleTrigger asChild>
          <div className="w-full bg- rounded-t-2xl cursor-pointer border">
            <div className="px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-base text-gray-500">สรุปรายการ</span>
                {isOrderSummaryOpen ? (
                  <ChevronUp className="h-4 w-4 text-blue-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 py-3 bg-white border-t">
            {getSelectedServices().length > 0 ? (
              <div className="flex flex-col gap-2">
                {getSelectedServices().map((subService: SubService) => (
                  <div
                    key={subService.id}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span className="text-sm flex-grow break-words">
                      {subService.description}
                    </span>
                    <span className="text-sm text-blue-600 flex items-center gap-3 ml-2 text-right text-nowrap">
                      {getQuantityDisplay(subService.id)} รายการ
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center">
                ไม่มีรายการที่เลือก
              </div>
            )}
            {locationInfo && (
              <div className="mt-6 space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">วันที่</span>
                  <span className="text-sm">
                    {locationInfo.date
                      ? format(locationInfo.date, "d MMMM yyyy", {
                          locale: th,
                        })
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
            {/* PAYMENT */}
            {payment && (
              <div className="mt-6 space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">วันที่</span>
                  <span className="text-sm">
                    {payment.date
                      ? format(payment.date, "d MMMM yyyy", {
                          locale: th,
                        })
                      : "ยังไม่ได้เลือก"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">เวลา</span>
                  <span className="text-sm">
                    {payment.time || "ยังไม่ได้เลือก"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                    สถานที่
                  </span>
                  <span className="text-right flex-1 text-sm">
                    {payment.address ||
                    payment.subDistrict ||
                    payment.district ||
                    payment.province
                      ? [
                          payment.address,
                          payment.subDistrict,
                          payment.district,
                          payment.province,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "ไม่ได้ระบุ"}
                  </span>
                </div>
                {payment.additionalDetails && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 whitespace-nowrap mr-2">
                      ข้อมูลเพิ่มเติม
                    </span>
                    <span className="text-right flex-1 text-sm">
                      {payment.additionalDetails}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* ส่วนแสดงยอดรวมที่อยู่ด้านล่างสุด */}
      <div className="px-4 py-3 bg-white border-t">
        {/* discount amount */}
        {discount > 0 && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">ส่วนลด</span>
            <span className="text-sm font-normal text-[#C82438]">
              -
              {discountAmount.toLocaleString("th-TH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {""} ฿
            </span>
          </div>
        )}
        {router.pathname === "/payment" && (
          <div className="flex justify-between items-center mb-4">
            {isExpired ? (
              <span className="text-sm text-red-500">
                กำลังพาคุณกลับไปยังหน้าเลือกบริการใน {redirectCountdown} วินาที
              </span>
            ) : (
              <>
                <span className="text-sm text-gray-600">
                  กรุณาชำระเงินภายใน
                </span>
                <span className="text-lg font-semibold text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </>
            )}
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">รวม</span>
          <span className="text-base font-semibold">
            {calculateTotal().toLocaleString("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ฿
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileSummary;
