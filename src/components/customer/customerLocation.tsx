import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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

interface CustomerLocationProps {
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  additionalDetails: string;
  fullAddress: string;

  // State setter functions
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setProvince: React.Dispatch<React.SetStateAction<string>>;
  setDistrict: React.Dispatch<React.SetStateAction<string>>;
  setSubDistrict: React.Dispatch<React.SetStateAction<string>>;
  setAdditionalDetails: React.Dispatch<React.SetStateAction<string>>;
  setFullAddress: React.Dispatch<React.SetStateAction<string>>;
}
export const CustomerLocation: React.FC<CustomerLocationProps> = ({
  address,
  province,
  district,
  subDistrict,
  additionalDetails,
  fullAddress,
  setAddress,
  setProvince,
  setDistrict,
  setSubDistrict,
  setAdditionalDetails,
  setFullAddress,
}) => {
  const [provincesData, setProvincesData] = useState<Province[]>([]); //ข้อมูลจังหวัดทั้งหมด
  //----for stringdify------------------
  //const [address, setAddress] = useState<string>("");
  //   const [province, setProvince] = useState<string>("");
  //   const [district, setDistrict] = useState<string>("");
  //   const [subDistrict, setSubDistrict] = useState<string>("");
  //   const [additionalDetails, setAdditionalDetails] = useState<string>("");
  //   const [fullAddress, setFullAddress] = useState<string>("");
  //----Set selecte menu-----------------------------------
  const [selectedAddress, setSelectedAddress] = useState({
    province_name: "",
    amphure_name: "",
    tambon_name: "",
  });
  //---Lock district and sub district--------------------
  const amphures = useMemo(() => {
    const selectedadProvince = provincesData.find(
      (p) => p.name_th === selectedAddress.province_name
    );
    return selectedadProvince?.amphure || [];
  }, [selectedAddress.province_name, provincesData]);

  const tambons = useMemo(() => {
    const selectedAmphure = amphures.find(
      (a) => a.name_th === selectedAddress.amphure_name
    );
    return selectedAmphure?.tambon || [];
  }, [selectedAddress.amphure_name, amphures]);

  //---set all province---
  const loadProvinceData = async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json"
    );
    const provinceData = await response.json();
    setProvincesData(provinceData);
    //---set selected province---
  };
  const handleConsoleLog = () => {
    console.log("Test addres values");
    console.log("selected address: ", selectedAddress);
    console.log("province: ", province);
    console.log("district: ", district);
    console.log("subDistrict: ", subDistrict);
    console.log("additional detai: ", additionalDetails);
    console.log("full address: ", fullAddress);
    console.log("------_________-------------__________-----------");
  };
  const handleSetFullAddress = () => {
    const fa = `${address} ${subDistrict} ${district} ${province} 
    ${additionalDetails}
    `;
    setFullAddress(fa);
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
                value={selectedAddress.province_name}
                onValueChange={(value) => {
                  setSelectedAddress({
                    ...selectedAddress,
                    province_name: value,
                  });
                  setProvince(value);
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  {provincesData.map((province) => (
                    <SelectItem key={province.id} value={province.name_th}>
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
                value={selectedAddress.amphure_name}
                onValueChange={(value) => {
                  setSelectedAddress({
                    ...selectedAddress,
                    amphure_name: value,
                  });
                  setDistrict(value);
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกเขต / อำเภอ" />
                </SelectTrigger>
                <SelectContent>
                  {amphures.map((amphure) => (
                    <SelectItem key={amphure.id} value={amphure.name_th}>
                      {amphure.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Tambon */}
            <div className="sub-district-box">
              <Label>
                แขวง/ตำบล <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedAddress.tambon_name}
                onValueChange={(value) => {
                  setSelectedAddress({
                    ...selectedAddress,
                    tambon_name: value,
                  });
                  setSubDistrict(value);
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแขวง / ตำบล" />
                </SelectTrigger>
                <SelectContent>
                  {tambons.map((tambon) => (
                    <SelectItem key={tambon.id} value={tambon.name_th}>
                      {tambon.name_th}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="additional-box mt-5">
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
