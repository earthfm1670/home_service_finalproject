import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
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

// interface LocationFormProps {
//   isCalendarOpen: boolean;
//   setIsCalendarOpen: (open: boolean) => void;
//   selectedDate: Date | null;
//   handleDateSelect: (date: Date | undefined) => void;
//   isDateSelectable: (date: Date) => boolean;
//   dateError: string | null;
//   selectedTime: string;
//   handleTimeChange: (time: string) => void;
//   timeError: string | null;
//   address: string;
//   setAddress: (address: string) => void;
//   selected: {
//     province_id: string;
//     amphure_id: string;
//     tambon_id: string;
//   };
//   setSelected: (selected: {
//     province_id: string;
//     amphure_id: string;
//     tambon_id: string;
//   }) => void;
//   provinces: Array<{ id: string; name_th: string }>;
//   amphures: Array<{ id: string; name_th: string }>;
//   tambons: Array<{ id: string; name_th: string }>;
//   additionalDetails: string;
//   setAdditionalDetails: (details: string) => void;
// }
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

export const CustomerLocation = () => {
  const [provincesData, setProvincesData] = useState<Province[]>([]); //ข้อมูลจังหวัดทั้งหมด
  const [address, setAddress] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [subDistrict, setSubDistrict] = useState<string>("");
  const [additionalDetails, setAdditionalDetails] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState({
    province_id: "",
    amphure_id: "",
    tambon_id: "",
  });

  const loadProvinceData = async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
    );
    const provinceData = await response.json();
    //---set all province---
    setProvincesData(provinceData);
    //---set selected province---
    // const province = provinceData.find(
    //   (p: Province) => p.name_th === parsedPaymentData.province
    // );
    // if (province) {
    //   const amphure = province.amphure.find(
    //     (a: { name_th: string }) => a.name_th === parsedPaymentData.district
    //   );
    //   const tambon = amphure?.tambon.find(
    //     (t: { name_th: string }) => t.name_th === parsedPaymentData.subDistrict
    //   );
    //   setSelected({
    //     province_id: province.id,
    //     amphure_id: amphure?.id || "",
    //     tambon_id: tambon?.id || "",
    //   });
    // }
  };
  useEffect(() => {
    loadProvinceData();
  }, []);

  return (
    <div className="lg:col-span-2">
      <Card>
        <CardContent className="p-5">
          {/* Address and Location Selection */}
          <div className="main-address-box grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address */}
            <div className="address-text">
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
            <div className="province-box">
              <Label>
                จังหวัด<span className="text-red-500">*</span>
              </Label>
              <Select
              //   value={selected.province_id}
              //   onValueChange={(value) =>
              //     setSelected({ ...selected, province_id: value })
              //   }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  {provincesData.map((province) => (
                    <SelectItem key={province.id} value={province.id}>
                      {province.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Amphure */}
            <div className="district-box">
              <Label>
                เขต/อำเภอ<span className="text-red-500">*</span>
              </Label>
              <Select
              //   value={selected.amphure_id}
              //   onValueChange={(value) =>
              //     setSelected({ ...selected, amphure_id: value })
              //   }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเขต / อำเภอ" />
                </SelectTrigger>
                <SelectContent>
                  {/* {amphures.map((amphure) => (
                      <SelectItem key={amphure.id} value={amphure.id}>
                        {amphure.name_th}
                      </SelectItem>
                    ))} */}
                </SelectContent>
              </Select>
            </div>
            {/* Tambon */}
            <div className="sub-district-box">
              <Label>
                แขวง/ตำบล <span className="text-red-500">*</span>
              </Label>
              <Select
              //   value={selected.tambon_id}
              //   onValueChange={(value) =>
              //     setSelected({ ...selected, tambon_id: value })
              //   }
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแขวง / ตำบล" />
                </SelectTrigger>
                <SelectContent>
                  {/* {tambons.map((tambon) => (
                      <SelectItem key={tambon.id} value={tambon.id}>
                        {tambon.name_th}
                      </SelectItem>
                    ))} */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="additional-box">
            <Label>ระบุข้อมูลเพิ่มเติม</Label>
            <textarea
              className="w-full p-2 border rounded-md text-sm"
              rows={4}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="กรุณากรอกรายละเอียดเพิ่มเติม"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
