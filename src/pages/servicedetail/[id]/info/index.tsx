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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [subDistricts, setSubDistricts] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [canProceed, setCanProceed] = useState(false);
  const currentStep = 2;

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
  }, []);

  const handleProceed = () => {
    if (canProceed) {
      const locationData = {
        province: provinces.find((p) => p.id === selectedProvince)?.name_th,
        district: districts.find((d) => d.id === selectedDistrict)?.name_th,
        subDistrict: subDistricts.find((s) => s.id === selectedSubDistrict)
          ?.name_th,
        additionalDetails,
        date: selectedDate,
        time: selectedTime,
      };
      sessionStorage.setItem("selectedLocation", JSON.stringify(locationData));
      router.push(`/servicedetail/${selectedServices.serviceId}/summary`);
    }
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
                      <Label>วันที่สะดวกใช้บริการ*</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? format(selectedDate, "PPP", { locale: th })
                              : "เลือกวันที่"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>เวลาที่สะดวกใช้บริการ*</Label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>จังหวัด*</Label>
                      <Select
                        value={selectedProvince}
                        onValueChange={setSelectedProvince}
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
                      <Label>เขต/อำเภอ*</Label>
                      <Select
                        value={selectedDistrict}
                        onValueChange={setSelectedDistrict}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกเขต / อำเภอ" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name_th}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>แขวง/ตำบล*</Label>
                      <Select
                        value={selectedDistrict}
                        onValueChange={setSelectedDistrict}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกแขวง / ตำบล" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name_th}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>ที่อยู่*</Label>
                      <textarea
                        className="w-full p-1 border rounded-md"
                        rows={1}
                        value={additionalDetails}
                        onChange={(e) => setAdditionalDetails(e.target.value)}
                        placeholder="กรุณากรอกที่อยู่"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>ระบุข้อมูลเพิ่มเติม</Label>
                    <textarea
                      className="w-full p-2 border rounded-md"
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
            getQuantityDisplay={(id) =>
              selectedServices?.selections.find((s: any) => s.id === id)
                ?.quantity || 0
            }
            calculateTotal={() => selectedServices?.totalAmount || 0}
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
      />

      <NavigationButtons
        canProceed={canProceed}
        handleProceed={handleProceed}
      />
    </div>
  );
};

export default LocationPage;
