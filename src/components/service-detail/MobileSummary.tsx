import React, { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Service } from "@/types/service";
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
  getSelectedServices: () => Service["sub_services"];
  getQuantityDisplay: (subServiceId: number) => number;
  calculateTotal: () => number;
  locationInfo?: LocationInfo;
  payment?: PaymentInfo;
}

export const MobileSummary = ({
  getSelectedServices,
  getQuantityDisplay,
  calculateTotal,
  locationInfo,
  payment,
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
              // Payment
            )}
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
