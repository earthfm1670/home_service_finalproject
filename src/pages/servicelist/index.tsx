import React, { useState } from "react";
import { Range } from "react-range";
import { Search, Phone, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ServicesList: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 1800]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSliderChange = (value: number[]) => {
    if (value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-[168px] overflow-hidden">
        <img
          className="object-cover object-center"
          src="https://s3-alpha-sig.figma.com/img/4781/9192/da7550176bf1fa3b23732515a7292510?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LR0zlbf73KjSRW1rDcxAOtiUNMfhQOdAGtLwEkEIxmLlwL2xbsxfKE1ASJrDfzuttYKnzxl4tyPX7~XywpZiQqMJEmMYcEAwg36hI9UkF68pATfsJtQLTku0dCKNNk8NU1TDPgw3Cuv1maZDTPaM0Hb9VH5dkvaqgEDcICmcSQum~1EpS0cW14Gmx3u1w7IDFBUVixxwPrXpn7U5pZucWIwt0SuSo~flbYAXnPI3D4MPmSfvdhBCYf8nM7o42TxBRdLOTIJcXh685hH5wv1M1J0wMYf79m1evCRC95y5uOi8WeskzzuWeVZMNUuzTF4w7SS2XWbL0OzZSLxZ9vPpGg__"
          alt="IMG Header"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[rgba(0,25,81,0.6)] to-[rgba(0,25,81,0.6)] z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 z-20">
          <h1 className="max-w-[343px] text-xl font-medium text-white">
            บริการของเรา
          </h1>
          <p className="max-w-[343px] text-sm font-normal text-center text-white">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
        </div>
      </div>
      <section className="w-full h-36 py-2 flex flex-col justify-around items-center gap-4 border-b border-[#CCD0D7]">
        <div className="relative flex justify-center items-center gap-4 h-11 w-full max-w-md">
          <Search className="absolute left-14 text-[#b3afa8]" />
          <input
            type="text"
            placeholder="ค้นหาบริการ..."
            className="w-[241px] h-11 rounded-lg py-2 pl-12 pr-4 border"
          />
          <button className="w-[86px] h-11 rounded-lg text-white bg-[#336DF2]">
            ค้นหา
          </button>
        </div>
        <div className="w-full h-11 max-w-md flex justify-center gap-4 items-center">
          <div className="w-auto pr-1 border-r-2">
            <p className=" text-xs font-normal  text-[#646C80]">
              หมวดหมู่บริการ
            </p>
            <Select>
              <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 text-[#232630]">
                <SelectValue placeholder="บริการทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-[#1852D6]">
                    บริการทั้งหมด
                  </SelectLabel>
                  <SelectItem className="text-[#646c80]" value="apple">
                    บริการทั่วไป
                  </SelectItem>
                  <SelectItem className="text-[#646c80]" value="banana">
                    บริการห้องครัว
                  </SelectItem>
                  <SelectItem className="text-[#646c80]" value="blueberry">
                    บริการห้องน้ำ
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-auto pr-1 border-r-2">
            <div className="flex flex-col">
              <p className="text-xs font-normal text-[#646C80]">ราคา</p>
              <Select onOpenChange={toggleDropdown}>
                <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 text-[#232630]">
                  <SelectValue placeholder="0 - 2000฿" />
                </SelectTrigger>
                {isOpen && (
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-sm font-normal text-[#646C80]">
                        0 - 2000฿
                      </SelectLabel>
                      <div className="p-4 w-56 h-24">
                        <Range
                          values={priceRange}
                          step={1}
                          min={0}
                          max={2000}
                          onChange={handleSliderChange}
                          renderTrack={({ props, children }) => (
                            <div
                              {...props}
                              className="w-full h-2 bg-gray-300 rounded relative"
                            >
                              {" "}
                              <div
                                className="absolute h-full bg-blue-500 rounded"
                                style={{
                                  left: `${
                                    ((priceRange[0] - 0) / (2000 - 0)) * 100
                                  }%`,
                                  width: `${
                                    ((priceRange[1] - priceRange[0]) /
                                      (2000 - 0)) *
                                    100
                                  }%`,
                                }}
                              />
                              {children}
                            </div>
                          )}
                          renderThumb={({ props }) => (
                            <div
                              {...props}
                              className="h-4 w-4 bg-white border-solid border-4 border-blue-700 rounded-full"
                            />
                          )}
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>{priceRange[0]}</span>
                          <span>{priceRange[1]}</span>
                        </div>
                      </div>
                    </SelectGroup>
                  </SelectContent>
                )}
              </Select>
            </div>
          </div>
          <div className="w-auto">
            <p className="text-xs font-normal text-[#646C80]">เรียงตาม</p>
            <Select>
              <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 text-[#232630]">
                <SelectValue placeholder="ตามตัวอัก..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-[#1852D6]">
                    บริการแนะนำ
                  </SelectLabel>
                  <SelectItem className="text-[#646c80]" value="apple">
                    บริการยอดนิยม
                  </SelectItem>
                  <SelectItem className="text-[#646c80]" value="banana">
                    ตามตัวอักษร (Ascending)
                  </SelectItem>
                  <SelectItem className="text-[#646c80]" value="blueberry">
                    ตามตัวอักษร (Descending)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
      {/*End section IMG + Category */}
      <section className="w-full h-auto bg-slate-200">
        <div className="w-[349px] grig grid-cols-1 justify-self-center mt-6">
          <div className="w-full h-[350px] flex flex-col items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <img
              src="https://s3-alpha-sig.figma.com/img/0f61/5676/862aef146f752c8fc736725679ace39d?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=g6dbXariHeVQfbrF04xCbf9j5DPLPL150CyuBazZBUyg~spWUF9Ds9KsUhm-SCjmU6AioYoWjb7RvXrEBCOhMKR7uScNA0dL2hFN5tpjPhACL76HTrCC9-JLYm36K-dZe5pTRUlTEb25wU8-F19Qas2TndeC~PGWGEur0p6iNQd8XYW8RJOGV6~BZKdGPpwr1n51Q4h6jfjJUuylUyp0lAfUA1VW1tJMn~aVoGViwpFhc~1o8Q18NF3SJsz3Ttoi4nVIiHhDvdOo6fmc-bCoqj5iOQmOiMWZTw9GM3lbWdqnrtlouBFdW2XwIgyQ64lATQ563ckAnuhOQ6~9JzTTZw__"
              alt="Air_conditioning_cleaning"
              className="w-full h-[200px]"
            />
            <div className="flex flex-col items-start justify-center p-4 gap-2 w-full h-[150px]">
              <p className="w-20 h-7 flex items-center justify-center rounded-lg text-xs font-normal text-blue-800 bg-blue-100">
                บริการทั่วไป
              </p>
              <h1 className="text-lg font-medium text-gray-950">ล้างแอร์</h1>
              <h2 className="text-sm font-normal text-gray-700">
                ค่าบริการประมาณ 500.00 - 1,0000.00 ฿
              </h2>
              <button className="text-base font-semibold underline underline-offset-1 text-blue-600">
                เลือกบริการ
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-[375px] h-[458px] relative mt-8 px-6 py-12 overflow-hidden bg-blue-600">
        <h1 className="absolute w-[327px] h-[243] text-lg font-medium text-center text-[#FFFFFF]">
          <p>เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร</p>
          <p>
            โดยทีมช่างมืออาชีพมากกว่า 100 ทีม
            สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง
          </p>
          <p>
            ความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.
          </p>
          <p>มั่นใจ ช่างไม่ทิ้งงาน</p>
          <p>พร้อมรับประกันคุณภาพงาน</p>
        </h1>

        <img
          src="https://s3-alpha-sig.figma.com/img/f2e9/bce5/f0733b5ff94a23b59fd5fccba21d7d98?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=keODkbCXtDrRpqtrJIGHKgdtmTaacAWJVSrVrVon8qwyXxaRyt0gHvn1fC9mSfFaTBGDNOttdi~DY-SwsZy3jx~EMqLHhJz35mOr~oBbI~j1KmLtx76i3HIQ1hdXU3PGqrba1qCbONhGE4mIiU6OdNNsnwVAEDE9OREYARXiZwLpP3ITdsJh1Ak~eeKBrUfJg2TVwNFi9Jt5wO1cDigam9PdPrdMWA4Eg56cVDapXmPGrvXmUwurNsF6rSR14UUyG3anToWREJx5tq3PyxHUJFh50mlAor-qdQ5eZjEDABHPWjSuaHw6mUFoDVzeTBPux06udMCZca-wMJaMJXoXDA__"
          alt="House"
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 size-[250px] opacity-20"
        />
      </section>
      <footer className="w-[375px] h-[389px] flex flex-col items-center justify-center">
        <div className="h-[273px] flex flex-col px-4 py-6 gap-6">
          <div className="flex w-full h-10 items-center gap-2">
            <img
              src="https://s3-alpha-sig.figma.com/img/f2e9/bce5/f0733b5ff94a23b59fd5fccba21d7d98?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=keODkbCXtDrRpqtrJIGHKgdtmTaacAWJVSrVrVon8qwyXxaRyt0gHvn1fC9mSfFaTBGDNOttdi~DY-SwsZy3jx~EMqLHhJz35mOr~oBbI~j1KmLtx76i3HIQ1hdXU3PGqrba1qCbONhGE4mIiU6OdNNsnwVAEDE9OREYARXiZwLpP3ITdsJh1Ak~eeKBrUfJg2TVwNFi9Jt5wO1cDigam9PdPrdMWA4Eg56cVDapXmPGrvXmUwurNsF6rSR14UUyG3anToWREJx5tq3PyxHUJFh50mlAor-qdQ5eZjEDABHPWjSuaHw6mUFoDVzeTBPux06udMCZca-wMJaMJXoXDA__"
              alt="House"
              className="size-10 opacity-90"
            />
            <h1 className="text-3xl font-medium text-blue-600">HomeServices</h1>
          </div>
          <div className="flex flex-col justify-between h-[77px]">
            <h1 className="text-lg font-medium text-gray-950">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h1>
            <p className="text-sm font-normal text-gray-800">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="flex flex-col justify-between h-14">
            <span>
              <p className="text-base font-normal text-gray-800 flex gap-3">
                <Phone size={20} />
                080-540-6357
              </p>
            </span>
            <span>
              <p className="text-base font-normal text-gray-800 flex gap-3">
                <Mail size={20} />
                contact@homeservices.co
              </p>
            </span>
          </div>
        </div>
        <div className="h-[116px] flex flex-col p-4 gap-4 bg-gray-100">
          <span className=" w-[343px] h-[50px] flex flex-col justify-between text-sm font-normal text-gray-700">
            <p>เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์</p>
            <p>นโยบายความเป็นส่วนตัว</p>
          </span>
          <p className=" w-[343px] text-xs font-normal text-gray-500">
            copyright © 2021 HomeServices.com All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServicesList;
