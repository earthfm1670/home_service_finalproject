import React, { useState, useEffect, useMemo } from "react";
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

// Types
interface ServiceInfoPageProps {
  initialService?: Service | null;
}
type SelectedServicesData = {
  serviceId: number;
  selections: Array<{
    id: number;
    description: string;
    unit?: string;
    unit_price: number;
    discount: number;
    quantity: number;
    totalAmount: number;
    canProceed: boolean;
    handleProceed: () => void;
  }>;
  totalAmount: number;
};
type Province = {
  id: string;
  name_th: string;
  name_en: string;
  amphure: Array<{
    id: string;
    name_th: string;
    name_en: string;
    tambon: Array<{
      id: string;
      name_th: string;
      name_en: string;
    }>;
  }>;
};

interface LocationInfo {
  date: Date | null;
  time: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  additionalDetails: string;
}

// API Functions
const getService = async (
  id: string
): Promise<{ data: Service | null; error?: string }> => {
  try {
    const res = await fetch(`/api/services/${id}`);
    if (!res.ok) throw new Error("Failed to fetch service");
    return res.json();
  } catch (error) {
    console.error("Error fetching service:", error);
    return { data: null, error: "Failed to fetch service" };
  }
};

// Holiday Data
const THAI_HOLIDAYS_2024_2025 = [
  "2024-01-01",
  "2024-02-10",
  "2024-04-06",
  "2024-04-13",
  "2024-04-14",
  "2024-04-15",
  "2024-05-01",
  "2024-05-06",
  "2024-05-22",
  "2024-07-19",
  "2024-08-12",
  "2024-10-14",
  "2024-12-05",
  "2024-12-10",
  "2024-12-31",
  "2025-01-01",
  "2025-02-19",
  "2025-04-06",
  "2025-04-13",
  "2025-04-14",
  "2025-04-15",
  "2025-05-01",
  "2025-05-05",
  "2025-05-12",
  "2025-07-07",
  "2025-07-08",
  "2025-08-12",
  "2025-10-13",
  "2025-12-05",
  "2025-12-10",
  "2025-12-31",
].map((date) => new Date(date));

const ServiceInfoPage = ({ initialService }: ServiceInfoPageProps) => {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(
    initialService || null
  );
  const [selectedServices, setSelectedServices] =
    useState<SelectedServicesData | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selected, setSelected] = useState({
    province_id: "",
    amphure_id: "",
    tambon_id: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [address, setAddress] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [timeError, setTimeError] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Memoized derived state
  const amphures = useMemo(() => {
    const selectedProvince = provinces.find(
      (p) => p.id === selected.province_id
    );
    return selectedProvince?.amphure || [];
  }, [selected.province_id, provinces]);

  const tambons = useMemo(() => {
    const selectedAmphure = amphures.find((a) => a.id === selected.amphure_id);
    return selectedAmphure?.tambon || [];
  }, [selected.amphure_id, amphures]);

  const isFormComplete = useMemo(() => {
    return !!(
      selectedDate &&
      selectedTime &&
      address &&
      selected.province_id &&
      selected.amphure_id &&
      selected.tambon_id &&
      selectedServices?.selections?.length
    );
  }, [selectedDate, selectedTime, address, selected, selectedServices]);

  // Date validation functions
  const isDateSelectable = (date: Date) => {
    const today = startOfToday();
    const now = new Date();
    const maxDate = calculateMaxSelectableDate(today, 30);

    if (isBefore(date, today)) return false;
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
    if (isSaturday(date) || isSunday(date)) return false;
    if (isAfter(date, maxDate)) return false;
    if (THAI_HOLIDAYS_2024_2025.some((holiday) => isSameDay(date, holiday)))
      return false;

    return true;
  };

  const calculateMaxSelectableDate = (startDate: Date, days: number) => {
    let count = 0;
    let currentDate = startDate;

    while (count < days) {
      currentDate = addDays(currentDate, 1);
      if (
        !isWeekend(currentDate) &&
        !THAI_HOLIDAYS_2024_2025.some((holiday) =>
          isSameDay(currentDate, holiday)
        )
      ) {
        count++;
      }
    }

    return currentDate;
  };

  // Event handlers
  const handleTimeChange = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    const selectedTime = hours + (minutes === 30 ? 0.5 : 0);

    if (selectedTime >= 9 && selectedTime <= 18) {
      setSelectedTime(value);
      setTimeError("");
    } else {
      setTimeError("โปรดเลือกเวลาทำการ 09:00 - 18:00 น.");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setIsCalendarOpen(false);
    if (!date) {
      setSelectedDate(null);
      setDateError(null);
      return;
    }

    if (!isDateSelectable(date)) {
      const errorMessages = {
        past: "กรุณาเลือกวันที่ใหม่ (ไม่สามารถเลือกวันที่ผ่านมาแล้วได้)",
        weekend:
          "วันที่เลือกไม่สามารถให้บริการได้ เนื่องจากเป็นวันหยุดสุดสัปดาห์ (วันจันทร์-ศุกร์เท่านั้น)",
        tooFar:
          "กรุณาเลือกวันที่ใหม่ (เลือกได้เฉพาะวันที่ภายใน 30 วันทำการจากวันนี้)",
        holiday:
          "วันที่เลือกไม่สามารถให้บริการได้ เนื่องจากเป็นวันหยุดนักขัตฤกษ์",
        afterHours:
          "วันนี้ไม่สามารถเลือกได้ เนื่องจากเวลาที่เลือกเกิน 18:00 น.",
      };

      let errorMessage = "วันที่เลือกไม่สามารถให้บริการได้ กรุณาเลือกวันใหม่";
      if (isBefore(date, startOfToday())) errorMessage = errorMessages.past;
      else if (isWeekend(date)) errorMessage = errorMessages.weekend;
      else if (isAfter(date, calculateMaxSelectableDate(startOfToday(), 30)))
        errorMessage = errorMessages.tooFar;
      else if (
        THAI_HOLIDAYS_2024_2025.some((holiday) => isSameDay(date, holiday))
      )
        errorMessage = errorMessages.holiday;
      else if (
        isSameDay(date, startOfToday()) &&
        isAfter(new Date(), new Date(startOfToday().setHours(18, 0, 0, 0)))
      ) {
        errorMessage = errorMessages.afterHours;
      }

      setDateError(errorMessage);
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
      setDateError(null);
    }
  };

  const handleProceed = () => {
    if (!isFormComplete || !service) return;

    const paymentData = {
      serviceId: service.id,
      serviceName: service.title,
      selectedServices,
      date: selectedDate,
      time: selectedTime,
      address,
      province:
        provinces.find((p) => p.id === selected.province_id)?.name_th || "",
      district:
        amphures.find((a) => a.id === selected.amphure_id)?.name_th || "",
      subDistrict:
        tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
      additionalDetails,
      totalAmount: selectedServices?.totalAmount || 0,
    };

    // Save both payment data and form data
    sessionStorage.setItem("paymentData", JSON.stringify(paymentData));
    const formData = {
      selectedDate,
      selectedTime,
      address,
      selected,
      additionalDetails,
    };
    sessionStorage.setItem("serviceInfoFormData", JSON.stringify(formData));
    router.push("/payment");
  };

  // Load data effects
  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        // Load services data
        const servicesData = sessionStorage.getItem("selectedServices");
        if (servicesData) {
          const parsedServices = JSON.parse(servicesData);
          setSelectedServices(parsedServices);

          if (!service && parsedServices.serviceId) {
            const result = await getService(parsedServices.serviceId);
            if (result.data) setService(result.data);
          }
        }

        // Load form data with priority given to payment data
        const paymentData = sessionStorage.getItem("paymentData");
        const formData = sessionStorage.getItem("serviceInfoFormData");

        if (paymentData) {
          const parsedPaymentData = JSON.parse(paymentData);
          setSelectedDate(
            parsedPaymentData.date ? new Date(parsedPaymentData.date) : null
          );
          setSelectedTime(parsedPaymentData.time);
          setAddress(parsedPaymentData.address);
          setAdditionalDetails(parsedPaymentData.additionalDetails);
        } else if (formData) {
          const parsedFormData = JSON.parse(formData);
          setSelectedDate(
            parsedFormData.selectedDate
              ? new Date(parsedFormData.selectedDate)
              : null
          );
          setSelectedTime(parsedFormData.selectedTime);
          setAddress(parsedFormData.address);
          setAdditionalDetails(parsedFormData.additionalDetails);
          setSelected(parsedFormData.selected);
        }

        // Load provinces data
        const response = await fetch(
          "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
        );
        const provinceData = await response.json();
        setProvinces(provinceData);

        // If we have payment data, we need to match location names with IDs
        if (paymentData) {
          const parsedPaymentData = JSON.parse(paymentData);
          const province = provinceData.find(
            (p: Province) => p.name_th === parsedPaymentData.province
          );

          if (province) {
            const amphure = province.amphure.find(
              (a) => a.name_th === parsedPaymentData.district
            );
            const tambon = amphure?.tambon.find(
              (t) => t.name_th === parsedPaymentData.subDistrict
            );

            setSelected({
              province_id: province.id,
              amphure_id: amphure?.id || "",
              tambon_id: tambon?.id || "",
            });
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadDataFromStorage();
  }, [service]);

  // Auto-save form data effect
  useEffect(() => {
    if (
      selectedDate ||
      selectedTime ||
      address ||
      selected.province_id ||
      additionalDetails
    ) {
      const formData = {
        selectedDate,
        selectedTime,
        address,
        selected,
        additionalDetails,
      };
      sessionStorage.setItem("serviceInfoFormData", JSON.stringify(formData));
    }
  }, [selectedDate, selectedTime, address, selected, additionalDetails]);

  if (!service) {
    return (
      <>
        <Navbar />
        <ServiceHeroSkeleton />
        <ServiceInfoSkeleton />
      </>
    );
  }

  const locationInfo: LocationInfo = {
    date: selectedDate,
    time: selectedTime,
    address,
    province:
      provinces.find((p) => p.id === selected.province_id)?.name_th || "",
    district: amphures.find((a) => a.id === selected.amphure_id)?.name_th || "",
    subDistrict:
      tambons.find((t) => t.id === selected.tambon_id)?.name_th || "",
    additionalDetails,
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <Navbar />
      <ServiceHero service={service} />

      <div className="container mx-auto px-4 lg:px-20 mt-14 lg:mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-9">
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

          <DesktopSummary
            getSelectedServices={() => selectedServices?.selections || []}
            getQuantityDisplay={(id) =>
              selectedServices?.selections.find((s) => s.id === id)?.quantity ||
              0
            }
            calculateTotal={() => {
              const total = selectedServices?.totalAmount;
              return typeof total === "number" && !isNaN(total) ? total : 0;
            }}
            getPriceDisplay={(id) => {
              const service = selectedServices?.selections.find(
                (s) => s.id === id
              );
              return typeof service?.unit_price === "number" &&
                !isNaN(service.unit_price)
                ? service.unit_price
                : 0;
            }}
            locationInfo={locationInfo}
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
          selectedServices?.selections.find((s) => s.id === id)?.quantity || 0
        }
        handleProceed={handleProceed}
        locationInfo={locationInfo}
        isServiceInfoPage={true}
      />

      <NavigationButtons
        onBack={() => {
          const formData = {
            selectedDate,
            selectedTime,
            address,
            selected,
            additionalDetails,
          };
          sessionStorage.setItem(
            "serviceInfoFormData",
            JSON.stringify(formData)
          );
          router.back();
        }}
        handleProceed={handleProceed}
        canProceed={isFormComplete}
      />
    </div>
  );
};

export default ServiceInfoPage;
