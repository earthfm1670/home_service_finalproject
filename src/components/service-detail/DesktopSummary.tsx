import React from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface DesktopSummaryProps {
  getSelectedServices: () => Array<{
    id: number;
    description: string;
    unit?: string;
    unit_price: number;
    discount: number;
    totalAmount: number;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  serviceInfo?: {
    name: string;
    description: string;
    unit: string;
    unit_price: number;
  };
  isServiceInfoPage?: boolean;
  isServiceDetailPage?: boolean;
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
}) => {
  const preDiscountTotal = totalAmount;
  const discountAmount = preDiscountTotal * discount;
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
              const total = subService.unit_price * quantity;
              return (
                <div
                  key={subService.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-[14px] font-light text-black">
                    {subService.description}
                  </span>
                  <span className="text-[14px] font-light text-gray-900">
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

          {/* Total */}
          <div className="flex justify-between items-center font-semibold">
            <span className="text-[16px] text-gray-700 font-normal">รวม</span>
            <span className="text[16px] text-black font-semibold">
              {(totalAmount - discountAmount).toLocaleString("th-TH", {
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
