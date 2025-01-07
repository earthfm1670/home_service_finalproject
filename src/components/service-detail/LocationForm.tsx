import React from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import TimeSelector from "../TimeSelector";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface LocationFormProps {
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  selectedDate: Date | null;
  handleDateSelect: (date: Date | undefined) => void;
  isDateSelectable: (date: Date) => boolean;
  dateError: string | null;
  selectedTime: string;
  handleTimeChange: (time: string) => void;
  timeError: string | null;
  address: string;
  setAddress: (address: string) => void;
  selected: {
    province_id: string;
    amphure_id: string;
    tambon_id: string;
  };
  setSelected: (selected: {
    province_id: string;
    amphure_id: string;
    tambon_id: string;
  }) => void;
  provinces: Array<{ id: string; name_th: string }>;
  amphures: Array<{ id: string; name_th: string }>;
  tambons: Array<{ id: string; name_th: string }>;
  additionalDetails: string;
  setAdditionalDetails: (details: string) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  isCalendarOpen,
  setIsCalendarOpen,
  selectedDate,
  handleDateSelect,
  isDateSelectable,
  dateError,
  selectedTime,
  handleTimeChange,
  timeError,
  address,
  setAddress,
  selected,
  setSelected,
  provinces,
  amphures,
  tambons,
  additionalDetails,
  setAdditionalDetails,
}) => {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg mb-4 text-gray-500">กรอกข้อมูลผู้บริการ</h2>
          <div className="space-y-4">
            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Selection */}
              <div>
                <Label>
                  วันที่สะดวกใช้บริการ
                  <span className="text-red-500">*</span>
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between px-3 py-2 text-sm"
                    >
                      <span className="truncate mr-2">
                        {selectedDate
                          ? format(selectedDate, "d MMMM yyyy", {
                              locale: th,
                            })
                          : "กรุณาเลือกวันที่"}
                      </span>
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
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
                {dateError && (
                  <p className="text-red-500 text-sm mt-1">{dateError}</p>
                )}
              </div>
              {/* Time Selection */}
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
                  selectedDate={selectedDate} 
                />
                {timeError && (
                  <p className="text-red-500 text-sm mt-1">{timeError}</p>
                )}
              </div>
            </div>

            {/* Address and Location Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
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
              {/* Province */}
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
              {/* Amphure */}
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
              {/* Tambon */}
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

            {/* Additional Details */}
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
  );
};

export default LocationForm;
