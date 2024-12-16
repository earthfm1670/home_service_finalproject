"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import ProgressSteps from "@/components/service-detail/ProgressSteps";
import DesktopSummary from "@/components/service-detail/DesktopSummary";
import MobileBottomBar from "@/components/service-detail/MobileBottomBar";
import NavigationButtons from "@/components/service-detail/NavigationButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import {
  format,
  isWeekend,
  isAfter,
  isBefore,
  isSameDay,
  startOfToday,
  addDays,
  isSaturday,
  isSunday,
} from "date-fns";
import { th } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import type { Service } from "@/types/service";

async function getService(
  id: string
): Promise<{ data: Service | null; error?: string }> {
  try {
    const res = await fetch(`http://localhost:3000/api/services/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch service");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching service:", error);
    return { data: null, error: "Failed to fetch service" };
  }
}

interface LocationPageProps {
  initialService?: Service | null;
}

const LocationPage = ({ initialService }: LocationPageProps) => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(
    initialService || null
  );
  const [selectedServices, setSelectedServices] = useState<any>(null);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selected, setSelected] = useState({
    province_id: "",
    amphure_id: "",
    tambon_id: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [canProceed, setCanProceed] = useState(false);
  const currentStep = 2;
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [timeError, setTimeError] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const handleTimeChange = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    const selectedTime = hours + (minutes === 30 ? 0.5 : 0);
    if (selectedTime >= 9 && selectedTime < 18) {
      setSelectedTime(value);
      setTimeError("");
    } else {
      setTimeError("โปรดเลือกเวลาทำการ 09:00 - 17:30 น.");
    }
  };
  const isDateSelectable = (date: Date) => {
    const today = startOfToday();
    const now = new Date();
    const maxDate = calculateMaxSelectableDate(today, 30);

    // ไม่สามารถเลือกวันที่ผ่านมาแล้ว (ยกเว้นวันนี้)
    if (isBefore(date, today)) {
      return false;
    }

    // สามารถเลือกวันนี้ได้ ถ้าเวลาปัจจุบันไม่เกิน 18:00 น.
    if (isSameDay(date, today)) {
      return isBefore(
        now,
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          18,
          0,
          0
        )
      );
    }

    // ไม่สามารถเลือกวันหยุดสุดสัปดาห์ (เฉพาะวันเสาร์และอาทิตย์)
    if (isSaturday(date) || isSunday(date)) {
      return false;
    }

    // ไม่สามารถเลือกวันเกินจากช่วง 30 วันทำการ
    if (isAfter(date, maxDate)) {
      return false;
    }

    // ตรวจสอบวันหยุดนักขัตฤกษ์ไทย
    if (isHoliday(date)) {
      return false;
    }

    return true;
  };
  // ฟังก์ชันสำหรับคำนวณวันทำการสูงสุด (30 วันทำการ)
  const calculateMaxSelectableDate = (startDate: Date, days: number) => {
    let count = 0;
    let currentDate = startDate;

    while (count < days) {
      currentDate = addDays(currentDate, 1);
      if (!isWeekend(currentDate) && !isHoliday(currentDate)) {
        count++;
      }
    }

    return currentDate;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      if (!isDateSelectable(date)) {
        // เงื่อนไขและข้อความแจ้งเตือน
        if (isBefore(date, startOfToday())) {
          setDateError(
            "กรุณาเลือกวันที่ใหม่ (ไม่สามารถเลือกวันที่ผ่านมาแล้วได้)"
          );
        } else if (isWeekend(date)) {
          setDateError(
            "วันที่เลือกไม่สามารถให้บริการได้ เนื่องจากเป็นวันหยุดสุดสัปดาห์ (วันจันทร์-ศุกร์เท่านั้น)"
          );
        } else if (
          isAfter(date, calculateMaxSelectableDate(startOfToday(), 30))
        ) {
          setDateError(
            "กรุณาเลือกวันที่ใหม่ (เลือกได้เฉพาะวันที่ภายใน 30 วันทำการจากวันนี้)"
          );
        } else if (isHoliday(date)) {
          setDateError(
            "วันที่เลือกไม่สามารถให้บริการได้ เนื่องจากเป็นวันหยุดนักขัตฤกษ์"
          );
        } else if (
          isSameDay(date, startOfToday()) &&
          isAfter(new Date(), new Date(startOfToday().setHours(18, 0, 0, 0)))
        ) {
          setDateError(
            "วันนี้ไม่สามารถเลือกได้ เนื่องจากเวลาที่เลือกเกิน 18:00 น."
          );
        } else {
          setDateError("วันที่เลือกไม่สามารถให้บริการได้ กรุณาเลือกวันใหม่");
        }
      } else {
        setSelectedDate(date);
        setDateError(null);
      }
    }
  };

  // ฟังก์ชันจำลองวันหยุดนักขัตฤกษ์
  const isHoliday = (date: Date) => {
    const holidays = [
      // วันหยุดปี 2024
      new Date("2024-01-01"), // วันขึ้นปีใหม่
      new Date("2024-02-10"), // วันมาฆบูชา
      new Date("2024-04-06"), // วันจักรี
      new Date("2024-04-13"), // วันสงกรานต์
      new Date("2024-04-14"), // วันสงกรานต์
      new Date("2024-04-15"), // วันสงกรานต์
      new Date("2024-05-01"), // วันแรงงาน
      new Date("2024-05-06"), // วันฉัตรมงคล (ชดเชย)
      new Date("2024-05-22"), // วันวิสาขบูชา
      new Date("2024-07-19"), // วันเข้าพรรษา
      new Date("2024-08-12"), // วันแม่แห่งชาติ
      new Date("2024-10-14"), // วันคล้ายวันสวรรคต ร.9
      new Date("2024-12-05"), // วันพ่อแห่งชาติ
      new Date("2024-12-10"), // วันรัฐธรรมนูญ
      new Date("2024-12-31"), // วันสิ้นปี

      // วันหยุดปี 2025
      new Date("2025-01-01"), // วันขึ้นปีใหม่
      new Date("2025-02-19"), // วันมาฆบูชา
      new Date("2025-04-06"), // วันจักรี
      new Date("2025-04-13"), // วันสงกรานต์
      new Date("2025-04-14"), // วันสงกรานต์
      new Date("2025-04-15"), // วันสงกรานต์
      new Date("2025-05-01"), // วันแรงงาน
      new Date("2025-05-05"), // วันฉัตรมงคล
      new Date("2025-05-12"), // วันวิสาขบูชา
      new Date("2025-07-07"), // วันอาสาฬหบูชา
      new Date("2025-07-08"), // วันเข้าพรรษา
      new Date("2025-08-12"), // วันแม่แห่งชาติ
      new Date("2025-10-13"), // วันคล้ายวันสวรรคต ร.9
      new Date("2025-12-05"), // วันพ่อแห่งชาติ
      new Date("2025-12-10"), // วันรัฐธรรมนูญ
      new Date("2025-12-31"), // วันสิ้นปี
    ];

    // ตรวจสอบว่า date ที่เลือกตรงกับวันหยุดหรือไม่
    return holidays.some((holiday) => isSameDay(date, holiday));
  };

  useEffect(() => {
    // Load selected services from session storage
    const servicesData = sessionStorage.getItem("selectedServices");
    if (servicesData) {
      const parsedData = JSON.parse(servicesData);
      setSelectedServices(parsedData);

      // Fetch service details if not provided as props
      if (!service && parsedData.serviceId) {
        getService(parsedData.serviceId).then((result) => {
          if (result.data) {
            setService(result.data);
          }
        });
      }
    }

    // Fetch provinces data
    fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
    )
      .then((response) => response.json())
      .then((result) => {
        setProvinces(result);
      });
  }, []);

  useEffect(() => {
    if (selected.province_id) {
      const selectedProvince = provinces.find(
        (p) => p.id === selected.province_id
      );
      setAmphures(selectedProvince ? selectedProvince.amphure : []);
    }
  }, [selected.province_id, provinces]);

  useEffect(() => {
    if (selected.amphure_id) {
      const selectedAmphure = amphures.find(
        (a) => a.id === selected.amphure_id
      );
      setTambons(selectedAmphure ? selectedAmphure.tambon : []);
    }
  }, [selected.amphure_id, amphures]);

  const handleProceed = () => {
    if (canProceed) {
      const locationData = {
        province: provinces.find((p) => p.id === selected.province_id)?.name_th,
        district: amphures.find((a) => a.id === selected.amphure_id)?.name_th,
        subDistrict: tambons.find((t) => t.id === selected.tambon_id)?.name_th,
        additionalDetails,
        date: selectedDate,
        time: selectedTime,
      };
      sessionStorage.setItem("selectedLocation", JSON.stringify(locationData));
      router.push(`/servicedetail/${selectedServices.serviceId}/summary`);
    }
  };

  const TimeSelector = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (time: string) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState("00");
    const [selectedMinute, setSelectedMinute] = useState("00");

    const hours = Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, "0"));
    const minutes = Array.from({ length: 25 }, (_, i) =>
      i.toString().padStart(2, "0")
    );

    const handleTimeSelect = () => {
      if (selectedHour && selectedMinute) {
        onChange(`${selectedHour}:${selectedMinute}`);
        setIsOpen(false);
      }
    };

    return (
      <div className="relative">
        <div
          className="w-full flex justify-between items-center px-3 h-10 rounded-md border border-input bg-white shadow-sm text-sm cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{value || "เลือกเวลา"}</span>
          <Clock className="h-4 w-4" size={18} />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg overflow-hidden lg:w-48">
<MobileBottomBar
  canProceed={canProceed}
  calculateTotal={() => selectedServices?.totalAmount || 0}
  getSelectedServices={() => selectedServices?.selections || []}
  getQuantityDisplay={(id) =>
    selectedServices?.selections.find((s: any) => s.id === id)?.quantity || 0
  }
  handleProceed={handleProceed}
  locationInfo={{
    date: selectedDate,
    time: selectedTime,
    address: address,
    province: provinces.find((p) => p.id === selected.province_id)?.name_th || "",
    district: amphures.find((a) => a.id === selected.amphure_id)?.name_th || "",
    subDistrict: tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
  }}
  isServiceInfoPage={true}
/>
            <div className="flex divide-x divide-gray-200">
              {/* Hours Column */}
              <div className="flex-1 w-1/2 overflow-y-auto max-h-60">
                {hours.map((hour) => (
                  <div
                    key={`hour-${hour}`}
                    className={`h-8 flex items-center justify-center cursor-pointer text-base rounded-md
                      ${
                        selectedHour === hour
                          ? "bg-blue-500 text-white hover:bg-blue-600 round-md hover:round-md"
                          : "hover:bg-gray-100 round-md hover:round-md"
                      }`}
                    onClick={() => setSelectedHour(hour)}
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* Minutes Column */}
              <div className="flex-1 w-1/2 overflow-y-auto max-h-60">
                {minutes.map((minute) => (
                  <div
                    key={`minute-${minute}`}
                    className={`h-8 flex items-center justify-center cursor-pointer text-base rounded-md
                      ${
                        selectedMinute === minute
                          ? "bg-blue-500 text-white hover:bg-blue-600 round-md hover:round-md"
                          : "hover:bg-gray-100 round-md hover:round-md"
                      }`}
                    onClick={() => setSelectedMinute(minute)}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t flex justify-between items-center">
              <div className="text-base font-medium">
                {selectedHour
                  ? selectedMinute
                    ? `${selectedHour}:${selectedMinute}`
                    : `${selectedHour}:--`
                  : ""}
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-sm"
                onClick={handleTimeSelect}
                disabled={!selectedHour || !selectedMinute}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[168px] w-full lg:h-56">
        <img
          src={service.service_picture_url}
          alt={service.service_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#163C9366]">
          <div className="px-4 pt-9 lg:px-32 lg:mt-5">
            {/* Breadcrumb */}
            <div className="bg-white rounded-md py-2 px-4 inline-flex items-center space-x-2 lg:p-5">
              <Link
                href="/services"
                className="text-gray-500 hover:text-blue-600 text-sm"
              >
                บริการของเรา
              </Link>
              <span className="text-gray-500">&gt;</span>
              <span className="text-blue-600 font-bold text-3xl">
                {service.service_name}
              </span>
            </div>
            <ProgressSteps currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg mb-4 text-gray-500">
                  กรอกข้อมูลผู้บริการ
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>
                        วันที่สะดวกใช้บริการ
                        <span className="text-red-500">*</span>
                      </Label>
                      <Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {selectedDate
                                ? format(selectedDate, "PPP", { locale: th })
                                : "เลือกวันที่"}
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <Calendar
                              mode="single"
                              selected={selectedDate || undefined}
                              onSelect={handleDateSelect}
                              disabled={(date) => !isDateSelectable(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={isDateSelectable}
                          />
                        </PopoverContent>
                      </Popover>
                      {dateError && (
                        <p className="text-red-500 text-sm mt-1">{dateError}</p>
                      )}
                    </div>
                    <div>
                      <Label>
                        เวลาที่สะดวกใช้บริการ
                        <span className="text-red-500">*</span>
                      </Label>
                      <TimeSelector
                        value={selectedTime}
                        onChange={(time) => {
                          handleTimeChange(time);
                        }}
                      />
                      {timeError && (
                        <p className="text-red-500 text-sm mt-1">{timeError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>
                        ที่อยู่<span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        className="w-full p-2 border rounded-md text-sm"
                        rows={1}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="กรุณากรอกที่อยู่"
                      />
                    </div>
                    <div>
                      <Label>
                        จังหวัด<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selected.province_id}
                        onValueChange={(value) =>
                          setSelected({ ...selected, province_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกจังหวัด" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province.id} value={province.id}>
                              {province.name_th}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        เขต/อำเภอ<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selected.amphure_id}
                        onValueChange={(value) =>
                          setSelected({ ...selected, amphure_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกเขต / อำเภอ" />
                        </SelectTrigger>
                        <SelectContent>
                          {amphures.map((amphure) => (
                            <SelectItem key={amphure.id} value={amphure.id}>
                              {amphure.name_th}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>
                        แขวง/ตำบล <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selected.tambon_id}
                        onValueChange={(value) =>
                          setSelected({ ...selected, tambon_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกแขวง / ตำบล" />
                        </SelectTrigger>
                        <SelectContent>
                          {tambons.map((tambon) => (
                            <SelectItem key={tambon.id} value={tambon.id}>
                              {tambon.name_th}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>ระบุข้อมูลเพิ่มเติม</Label>
                    <textarea
                      className="w-full p-2 border rounded-md text-sm"
                      rows={4}
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      placeholder="กรุณากรอกรายละเอียดเพิ่มเติม"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <DesktopSummary
            getSelectedServices={() => selectedServices?.selections || []}
            getQuantityDisplay={(id: number) =>
              selectedServices?.selections.find((s) => s.id === id)?.quantity ||
              0
            }
            calculateTotal={() => {
              const total = selectedServices?.totalAmount;
              return typeof total === "number" && !isNaN(total) ? total : 0;
            }}
            getPriceDisplay={(id: number) => {
              const service = selectedServices?.selections.find(
                (s) => s.id === id
              );
              return typeof service?.price === "number" &&
                !isNaN(service?.price)
                ? service.price
                : 0;
            }}
            locationInfo={{
              province:
                provinces.find((p) => p.id === selected.province_id)?.name_th ||
                "",
              district:
                amphures.find((a) => a.id === selected.amphure_id)?.name_th ||
                "",
              subDistrict:
                tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
              address: address,
              date: selectedDate,
              time: selectedTime,
              additionalDetails:
                additionalDetails.trim() !== "" ? additionalDetails : undefined,
            }}
            isServiceInfoPage={true}
            isServiceDetailPage={true}
          />
        </div>
      </div>

      <MobileBottomBar
        canProceed={canProceed}
        calculateTotal={() => selectedServices?.totalAmount || 0}
        getSelectedServices={() => selectedServices?.selections || []}
        getQuantityDisplay={(id) =>
          selectedServices?.selections.find((s: any) => s.id === id)
            ?.quantity || 0
        }
        handleProceed={handleProceed}
        locationInfo={{
          date: selectedDate,
          time: selectedTime,
          address: address,
          province:
            provinces.find((p) => p.id === selected.province_id)?.name_th || "",
          district:
            amphures.find((a) => a.id === selected.amphure_id)?.name_th || "",
          subDistrict:
            tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
        }}
        isServiceInfoPage={true}
      />

      <NavigationButtons
        canProceed={canProceed}
        handleProceed={handleProceed}
      />
    </div>
  );
};

export default LocationPage;
