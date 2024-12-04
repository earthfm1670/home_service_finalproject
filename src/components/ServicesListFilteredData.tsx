import React, { useState, useEffect } from "react";
import { Range } from "react-range";
import { Search } from "lucide-react";
import { useServices } from "./ServicesContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ServicesListFilteredData: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 1800]);
  const [placeholder, setPlaceholder] = useState<string>("ตามตัวอัก...");
  const [selecttedCategory, setSelecttedCategory] = useState<string>("");
  const [sortByChange, setSortByChange] = useState<string>("");
  const [searchText, setsearchText] = useState<string>("");
  const { getServicesData } = useServices(); // ดึงข้อมูลจาก Context

  const handleCategoryChange = (value: string) => {
    setSelecttedCategory(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsearchText(event.target.value);
  };

  const handleSortByChange = (value: string) => {
    setSortByChange(value);
  };

  // ส่ง parameter ไปยัง context เมื่อกด button ค้นหา
  const handleSearchSummit = () => {
    getServicesData(selecttedCategory, sortByChange, priceRange, searchText);
  };

  // เรียกใช้ handleSearchSummit เมื่อกด enter on input field
  const handelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchSummit();
    }
  };

  // ส่ง parameter ไปยัง getServicesData() ที่ ServicesContext.tsx เพื่อ request data
  useEffect(() => {
    getServicesData(selecttedCategory, sortByChange, priceRange);
  }, [selecttedCategory, sortByChange, priceRange]);

  // update ค่า setPlaceholder Dispay size มีการเปลี่ยนแปลงมากหรือน้อยกว่า 1024px
  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth >= 1024) {
        console.log("> 1024");
        setPlaceholder("ตามตัวอักษร (Ascending)");
      } else {
        console.log("> 375");
        setPlaceholder("ตามตัวอัก...");
      }
    };

    // updatePlaceholder() จะถูก excute ทุกครั้งที่ Dispay มีการเปลี่ยนแปลงขนาด
    // และ return () ทำหน้าที่ cleanup (ลบค่า event listener) เมื่อ component ถูกเลิกใช้งาน
    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, [placeholder]);

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
      <div className="relative w-full h-[168px] overflow-hidden lg:w-[1440px] lg:h-60">
        <img
          className="object-cover absolute w-full h-full object-center lg:object-[center_69%]"
          src="https://s3-alpha-sig.figma.com/img/4781/9192/da7550176bf1fa3b23732515a7292510?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=LR0zlbf73KjSRW1rDcxAOtiUNMfhQOdAGtLwEkEIxmLlwL2xbsxfKE1ASJrDfzuttYKnzxl4tyPX7~XywpZiQqMJEmMYcEAwg36hI9UkF68pATfsJtQLTku0dCKNNk8NU1TDPgw3Cuv1maZDTPaM0Hb9VH5dkvaqgEDcICmcSQum~1EpS0cW14Gmx3u1w7IDFBUVixxwPrXpn7U5pZucWIwt0SuSo~flbYAXnPI3D4MPmSfvdhBCYf8nM7o42TxBRdLOTIJcXh685hH5wv1M1J0wMYf79m1evCRC95y5uOi8WeskzzuWeVZMNUuzTF4w7SS2XWbL0OzZSLxZ9vPpGg__"
          alt="IMG Header"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[rgba(0,25,81,0.6)] to-[rgba(0,25,81,0.6)] z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 z-20 lg:w-[1440px]">
          <h1 className="max-w-[343px] text-xl font-medium text-white lg:text-[32px]">
            บริการของเรา
          </h1>
          <p className="max-w-[343px] text-sm font-normal text-center text-white lg:w-[464px] lg:text-base">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
        </div>
      </div>
      <section className="w-[375px] h-[134px] py-2 flex flex-col justify-around items-center gap-4  border-b border-gray-300  lg:relative lg:w-[1440px] lg:h-[84px]">
        <div className="relative flex justify-center items-center gap-4 h-11 w-full max-w-md lg:absolute lg:justify-start lg:left-[159px]">
          <Search
            size={20}
            className="absolute left-8 cursor-pointer text-[#b3afa8] lg:left-5 z-10"
            onClick={handleSearchSummit}
          />
          <input
            type="text"
            placeholder="ค้นหาบริการ..."
            className="w-[241px] h-11 rounded-lg py-2 pl-12 pr-4 border focus:outline-slate-300 focus:drop-shadow-sm lg:w-[350px]"
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handelKeyDown}
          />
          <button
            className="w-[86px] h-11 cursor-pointer rounded-lg text-white bg-blue-600 hover:scale-105 lg:absolute lg:left-[1043px]"
            onClick={handleSearchSummit}
          >
            ค้นหา
          </button>
        </div>
        <div className="w-full h-11 max-w-md flex justify-center gap-1 items-center lg:absolute lg:justify-start lg:left-[608px] lg:w-[583px] lg:gap-8">
          <div className="w-auto pr-1 lg:h-[42px] lg:pr-0 lg:flex flex-col lg:justify-between">
            <p className=" text-xs font-normal  text-gray-700 lg:w-[120px]">
              หมวดหมู่บริการ
            </p>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 text-gray-950 lg:text-base lg:font-medium">
                <SelectValue placeholder="บริการทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-blue-700">
                    บริการทั้งหมด
                  </SelectLabel>
                  <SelectItem className="text-gray-700" value="บริการทั่วไป">
                    บริการทั่วไป
                  </SelectItem>
                  <SelectItem className="text-gray-700" value="บริการห้องครัว">
                    บริการห้องครัว
                  </SelectItem>
                  <SelectItem className="text-gray-700" value="บริการห้องน้ำ">
                    บริการห้องน้ำ
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <span className="h-11 border-r-2"></span>
          <div className="w-auto flex flex-col pr-1 lg:h-[42px] lg:pr-0 lg:justify-between">
            <p className="text-xs font-normal text-gray-700 lg:w-[120px]">
              ราคา
            </p>
            <Select onOpenChange={toggleDropdown}>
              <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 gap-3 text-gray-950 lg:gap-5">
                <SelectValue placeholder="0-2000฿" />
              </SelectTrigger>
              {isOpen && (
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-normal text-gray-700">
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
          <span className="h-11 border-r-2"></span>
          <div className="w-auto lg:h-[42px]">
            <p className="text-xs font-normal text-gray-700 lg:max-w-[215px]">
              เรียงตาม
            </p>
            <Select onValueChange={handleSortByChange}>
              <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 gap-3 text-gray-950 lg:gap-2">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-blue-700">
                    บริการแนะนำ
                  </SelectLabel>
                  <SelectItem className="text-gray-700" value="popular">
                    บริการยอดนิยม
                  </SelectItem>
                  <SelectItem className="text-gray-700" value="asc">
                    ตามตัวอักษร (Ascending)
                  </SelectItem>
                  <SelectItem className="text-gray-700" value="desc">
                    ตามตัวอักษร (Descending)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesListFilteredData;
