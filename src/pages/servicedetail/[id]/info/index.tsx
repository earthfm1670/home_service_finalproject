import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import DesktopSummary from "@/components/service-detail/DesktopSummary";
import MobileBottomBar from "@/components/service-detail/MobileBottomBar";
import NavigationButtons from "@/components/service-detail/NavigationButtons";
import type { Service } from "@/types/service";
import { ServiceInfoSkeleton } from "@/components/service-detail/ServiceInfoSkeleton";
import ServiceHero from "@/components/service-detail/ServiceHero";
import { ServiceHeroSkeleton } from "@/components/service-detail/ServiceHeroSkeleton";
import LocationForm from "@/components/service-detail/LocationForm";
import {
  isWeekend,
  isAfter,
  isBefore,
  isSameDay,
  startOfToday,
  addDays,
  isSaturday,
  isSunday,
} from "date-fns";

async function getService(
  id: string
): Promise<{ data: Service | null; error?: string }> {
  try {
    const res = await fetch(`/api/services/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch service");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching service:", error);
    return { data: null, error: "Failed to fetch service" };
  }
}

interface ServiceInfoPageProps {
  initialService?: Service | null;
}

interface Selection {
  id: number;
  quantity: number;
}
interface Tambon {
  id: string;
  name_th: string;
  name_en: string;
  zip_code: string;
}

interface Amphure {
  id: string;
  name_th: string;
  name_en: string;
  tambon: Tambon[];
}

interface Province {
  id: string;
  name_th: string;
  name_en: string;
  amphure: Amphure[];
}

interface SelectedService {
  id: number;
  sub_service_id: number;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
}

interface SelectedServicesData {
  serviceId: string;
  serviceName: string;
  selections: SelectedService[];
  totalAmount: number;
}
const ServiceInfoPage = ({ initialService }: ServiceInfoPageProps) => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(
    initialService || null
  );
  const [selectedServices, setSelectedServices] =
    useState<SelectedServicesData | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [amphures, setAmphures] = useState<Amphure[]>([]);
  const [tambons, setTambons] = useState<Tambon[]>([]);
  const [selected, setSelected] = useState({
    province_id: "",
    amphure_id: "",
    tambon_id: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [timeError, setTimeError] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
    setIsCalendarOpen(false);
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
        setSelectedDate(null); // เซ็ตเป็น null เมื่อวันที่ไม่ถูกต้อง
      } else {
        setSelectedDate(date);
        setDateError(null);
      }
    } else {
      setSelectedDate(null); // เซ็ตเป็น null เมื่อไม่มีวันที่ถูกเลือก
      setDateError(null);
    }
  };

  // ฟังก์ชันวันหยุดนักขัตฤกษ์
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
      .then((result: Province[]) => {
        setProvinces(result);
      });
  }, [service]);

  useEffect(() => {
    if (selected.province_id) {
      const selectedProvince = provinces.find(
        (p) => p.id === selected.province_id
      );
      setAmphures(selectedProvince ? selectedProvince.amphure : []);
      setSelected((prev) => ({ ...prev, amphure_id: "", tambon_id: "" }));
    }
  }, [selected.province_id, provinces]);

  useEffect(() => {
    if (selected.amphure_id) {
      const selectedAmphure = amphures.find(
        (a) => a.id === selected.amphure_id
      );
      setTambons(selectedAmphure ? selectedAmphure.tambon : []);
      setSelected((prev) => ({ ...prev, tambon_id: "" }));
    }
  }, [selected.amphure_id, amphures]);

  useEffect(() => {
    setIsFormComplete(
      !!selectedDate &&
        !!selectedTime &&
        !!address &&
        !!selected.province_id &&
        !!selected.amphure_id &&
        !!selected.tambon_id &&
        !!selectedServices?.selections &&
        Array.isArray(selectedServices.selections) &&
        selectedServices.selections.length > 0
    );
  }, [selectedDate, selectedTime, address, selected, selectedServices]);

  if (!service) {
    return (
      <>
        <Navbar />
        <ServiceHeroSkeleton />
        <ServiceInfoSkeleton />
      </>
    );
  }

  const handleProceed = () => {
    if (isFormComplete && service) {
      const paymentData = {
        serviceId: service.id,
        serviceName: service.title,
        selectedServices: selectedServices,
        date: selectedDate,
        time: selectedTime,
        address: address,
        province:
          provinces.find((p) => p.id === selected.province_id)?.name_th || "",
        district:
          amphures.find((a) => a.id === selected.amphure_id)?.name_th || "",
        subDistrict:
          tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
        additionalDetails: additionalDetails,
        totalAmount: selectedServices?.totalAmount || 0,
      };

      sessionStorage.setItem("paymentData", JSON.stringify(paymentData));
      router.push(`/payment`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <Navbar />
      <ServiceHero service={service} />

      {/* Main Content - Aligned with ServiceHero width */}
      <div className="container mx-auto px-4 lg:px-20 mt-14 lg:mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
          {/* Location Form */}
          <LocationForm
            isCalendarOpen={isCalendarOpen}
            setIsCalendarOpen={setIsCalendarOpen}
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
            isDateSelectable={isDateSelectable}
            dateError={dateError}
            selectedTime={selectedTime}
            handleTimeChange={handleTimeChange}
            timeError={timeError}
            address={address}
            setAddress={setAddress}
            selected={selected}
            setSelected={setSelected}
            provinces={provinces}
            amphures={amphures}
            tambons={tambons}
            additionalDetails={additionalDetails}
            setAdditionalDetails={setAdditionalDetails}
          />

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
              return typeof service?.unit_price === "number" &&
                !isNaN(service?.unit_price)
                ? service.unit_price
                : 0;
            }}
            locationInfo={{
              date: selectedDate,
              time: selectedTime,
              address: address,
              province:
                provinces.find((p) => p.id === selected.province_id)?.name_th ||
                "",
              district:
                amphures.find((a) => a.id === selected.amphure_id)?.name_th ||
                "",
              subDistrict:
                tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
              additionalDetails: additionalDetails,
            }}
            isServiceInfoPage={true}
            isServiceDetailPage={true}
          />
        </div>
      </div>

      <MobileBottomBar
        canProceed={isFormComplete}
        calculateTotal={() => selectedServices?.totalAmount || 0}
        getSelectedServices={() => selectedServices?.selections || []}
        getQuantityDisplay={(id) =>
          selectedServices?.selections.find((s: Selection) => s.id === id)
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
          additionalDetails: additionalDetails,
        }}
        isServiceInfoPage={true}
      />

      <NavigationButtons
        onBack={() => router.back()}
        handleProceed={handleProceed}
        canProceed={isFormComplete}
      />
    </div>
  );
};

export default ServiceInfoPage;
