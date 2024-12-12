"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import ProgressSteps from "@/components/service-detail/ProgressSteps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Location {
  id: string;
  name_th: string;
}

export default function LocationPage() {
  const router = useRouter();
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [subDistricts, setSubDistricts] = useState<Location[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");

  const currentStep = 2;

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("/api/provinces");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(`/api/districts/${selectedProvince}`);
          const data = await response.json();
          setDistricts(data);
          setSelectedDistrict("");
          setSubDistricts([]);
          setSelectedSubDistrict("");
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  // Fetch sub-districts when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchSubDistricts = async () => {
        try {
          const response = await fetch(`/api/subdistricts/${selectedDistrict}`);
          const data = await response.json();
          setSubDistricts(data);
          setSelectedSubDistrict("");
        } catch (error) {
          console.error("Error fetching sub-districts:", error);
        }
      };
      fetchSubDistricts();
    }
  }, [selectedDistrict]);

  const handleBack = () => {
    router.back();
  };

  const handleProceed = () => {
    if (
      selectedProvince &&
      selectedDistrict &&
      selectedSubDistrict &&
      date &&
      time
    ) {
      const locationData = {
        province: provinces.find((p) => p.id === selectedProvince)?.name_th,
        district: districts.find((d) => d.id === selectedDistrict)?.name_th,
        subDistrict: subDistricts.find((s) => s.id === selectedSubDistrict)
          ?.name_th,
        date: format(date, "dd MMMM yyyy", { locale: th }),
        time: time,
      };
      sessionStorage.setItem("selectedLocation", JSON.stringify(locationData));
      router.push(`/servicedetail/${id}/summary`);
    }
  };

  const canProceed =
    selectedProvince && selectedDistrict && selectedSubDistrict && date && time;

  return (
    <div className="min-h-screen bg-gray-100 pb-32">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[168px] w-full lg:h-56">
        <div className="absolute inset-0 bg-[#163C9366]">
          <div className="px-4 pt-9 lg:px-32 lg:mt-5">
            <ProgressSteps currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mt-4 lg:mt-16 lg:px-32">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <Select
                  value={selectedProvince}
                  onValueChange={setSelectedProvince}
                >
                  <SelectTrigger id="province">
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

              <div className="space-y-2">
                <Label htmlFor="district">อำเภอ / เขต</Label>
                <Select
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                  disabled={!selectedProvince}
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder="เลือกอำเภอ / เขต" />
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

              <div className="space-y-2">
                <Label htmlFor="subdistrict">ตำบล / แขวง</Label>
                <Select
                  value={selectedSubDistrict}
                  onValueChange={setSelectedSubDistrict}
                  disabled={!selectedDistrict}
                >
                  <SelectTrigger id="subdistrict">
                    <SelectValue placeholder="เลือกตำบล / แขวง" />
                  </SelectTrigger>
                  <SelectContent>
                    {subDistricts.map((subDistrict) => (
                      <SelectItem key={subDistrict.id} value={subDistrict.id}>
                        {subDistrict.name_th}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">วันที่สะดวกรับบริการ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !date && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: th })
                      ) : (
                        <span>เลือกวันที่</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={th}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">เวลาที่สะดวก</Label>
                <div className="flex">
                  <Input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" size="icon" className="ml-2">
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-2xl mx-auto flex justify-between gap-4">
          <Button variant="outline" onClick={handleBack} className="w-full">
            ย้อนกลับ
          </Button>
          <Button
            onClick={handleProceed}
            disabled={!canProceed}
            className="w-full"
          >
            ดำเนินการต่อ
          </Button>
        </div>
      </div>
    </div>
  );
}
