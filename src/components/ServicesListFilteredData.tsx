import React, { useState, useEffect, useRef, useCallback } from "react";
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

// ฟังก์ชัน debounce เพื่อหน่วงการเรียก fetch ข้อมูล
type TimerId = ReturnType<typeof setTimeout>;
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timerId: TimerId;
  return (...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const ServicesListFilteredData: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 9900]);
  const [placeholder, setPlaceholder] = useState<string>("ตามตัวอัก...");
  const [selecttedCategory, setSelecttedCategory] =
    useState<string>("บริการทั้งหมด");
  const [selecttedSortBy, setSelecttedSortBy] = useState<string>("popular");
  const [searchText, setsearchText] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<any>(0);
  const [isSuggestionSelected, setIsSuggestionSelected] =
    useState<boolean>(false);
  const suggestionRefs = useRef<any>([]);

  const { allServiceNames, getServicesData } = useServices(); // ดึงข้อมูลจาก Context
  const handleCategoryChange = (value: string) => {
    setSelecttedCategory(value);
  };

  const handleSortByChange = (value: string) => {
    setSelecttedSortBy(value);
  };

  // ส่ง parameter ไปยัง context เมื่อกด button ค้นหา
  const handleSearchSubmit = (updatedSearchText: string) => {
    getServicesData(
      selecttedCategory,
      selecttedSortBy,
      priceRange,
      updatedSearchText
    );
  };

  const handleButtonClick = () => {
    handleSearchSubmit(searchText);
  };

  // ส่ง parameter ไปยัง getServicesData() ที่ ServicesContext.tsx เพื่อ request data
  useEffect(() => {
    getServicesData(selecttedCategory, selecttedSortBy, priceRange, searchText);
  }, [selecttedCategory, selecttedSortBy]);

  // update ค่า setPlaceholder Dispay size มีการเปลี่ยนแปลงมากหรือน้อยกว่า 1024px
  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 1024) {
        if (selecttedSortBy === "asc" || selecttedSortBy === "desc") {
          setPlaceholder("ตามตัวอัก...");
        } else if (selecttedSortBy === "recommended") {
          setPlaceholder("บริการแนะ..");
        } else if (selecttedSortBy === "popular") {
          setPlaceholder("บริการยอด..");
        }
      } else {
        if (selecttedSortBy === "asc") {
          setPlaceholder("ตามตัวอักษร (Ascending)");
        } else if (selecttedSortBy === "desc") {
          setPlaceholder("ตามตัวอักษร (Descending)");
        } else if (selecttedSortBy === "recommended") {
          setPlaceholder("บริการแนะนำ");
        } else if (selecttedSortBy === "popular") {
          setPlaceholder("บริการยอดนิยม");
        }
      }
    };

    // updatePlaceholder() จะถูก excute ทุกครั้งที่ Dispay มีการเปลี่ยนแปลงขนาด
    // และ return () ทำหน้าที่ cleanup (ลบค่า event listener) เมื่อ component ถูกเลิกใช้งาน

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, [selecttedSortBy]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSliderChange = (value: number[]) => {
    if (value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
    //เรียกใช้ debouncedFetchData เพื่อกำหนด delay ในการส่ง parameter ไปยัง fetchPriceRangeData เพื่อ get data from api
    debouncedFetchData(selecttedCategory, selecttedSortBy, value, searchText);
  };

  // ฟังก์ชัน fetch ข้อมูล
  const fetchPriceRangeData = (
    category: string,
    sortBy: string,
    range: [number, number],
    text: string
  ) => {
    getServicesData(category, sortBy, range, text);
  };

  // ใช้ debounce สำหรับฟังก์ชัน fetchData
  const debouncedFetchData = useCallback(
    debounce(fetchPriceRangeData, 1000),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setsearchText(event.target.value);
    if (searchText.length >= 2) {
      const filteredSuggestions: string[] = allServiceNames.filter((item) =>
        item.toLowerCase().includes(searchText.toLocaleLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setActiveSuggestion(0);
    } else {
      setSuggestions([]);
    }
  };

  // ใช้ปุ่ม ArrowUp และ ArrowDown เพื่อนเลื่อน auto cpmplete
  const handelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      setActiveSuggestion((prevActive: any) => {
        const newActive =
          prevActive + 1 < suggestions.length ? prevActive + 1 : prevActive;
        scrollIntoView(newActive);
        return newActive;
      });
    } else if (event.key === "ArrowUp") {
      setActiveSuggestion((prevActive: any) => {
        const newActive = prevActive - 1 >= 0 ? prevActive - 1 : prevActive;
        scrollIntoView(newActive);
        return newActive;
      });
    }
    // ตรวจการกด Enter เพื่อเลือก auto complete และ ส่ง parameter ไปยัง API เพื่อขอข้อมูล
    else if (event.key === "Enter") {
      if (suggestions[activeSuggestion]) {
        const selectedSuggestion = suggestions[activeSuggestion];
        setsearchText(selectedSuggestion);
        setSuggestions([]);
        handleSearchSubmit(selectedSuggestion);
      } else if (isSuggestionSelected) {
        handleSearchSubmit(searchText);
        setIsSuggestionSelected(false);
      } else if (
        (!suggestions.length && searchText.length === 0) ||
        (!isSuggestionSelected && searchText.length > 1)
      ) {
        handleSearchSubmit(searchText);
      }
    } else if (
      (event.key === "Backspace" && searchText.length < 2) ||
      event.key === "Escape"
    ) {
      // กด ESC หรือลบข้อความค้นหา เพื่อปิดรายการ auto complete และ ขอข้อมูลใหม่จาก API
      setSuggestions([]);
      getServicesData(selecttedCategory, selecttedSortBy, priceRange, "");
    }
  };

  // เลื่อน scroll ได้เมื่อมี auto complete หลายรายการ
  const scrollIntoView = (index: any) => {
    if (suggestionRefs.current[index]) {
      suggestionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // ตรวจสอบการคลิก mouse นอก field auto complete เพื่อยกเลิก auto complete
  const handleClickOutside = (event: any) => {
    if (
      suggestionRefs.current &&
      !suggestionRefs.current.contains(event.target)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //-------------------------------- End Function Suggestions --------------------------------------//

  return (
    <>
      <div className="flex flex-col items-center mx-auto">
        <div className="relative w-full h-[168px] overflow-hidden lg:h-60">
          <img
            className="object-cover w-full h-full object-center lg:object-[center_69%]"
            src="image/servicelistbanner.jpg"
            alt="Servicelist-banner"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[rgba(0,25,81,0.6)] to-[rgba(0,25,81,0.6)] z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-5 items-center justify-center lg:gap-7 z-20">
            <h1 className="w-[343px] text-xl font-medium text-center text-white lg:text-[32px]">
              บริการของเรา
            </h1>
            <p className="w-[343px] text-sm font-normal text-center text-white lg:w-[464px] lg:text-base">
              ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย
              โดยพนักงานแม่บ้าน และช่างมืออาชีพ
            </p>
          </div>
        </div>
      </div>
      <section className="sticky top-0 z-10 bg-white min-w-[375px] h-[134px] w-full py-2 flex flex-col justify-around items-center gap-4 mx-auto border-b border-gray-300 lg:max-w-[1440px] lg:flex-row lg:justify-start lg:h-[84px]">
        <div className="relative flex justify-center items-center gap-4 h-11 w-full max-w-md lg:justify-start lg:pl-[159px]">
          <span className="relative w-[241px] lg:w-[350px] flex justify-center items-center gap-4 ">
            <Search
              size={20}
              className="absolute left-5 cursor-pointer text-[#b3afa8] lg:left-5 z-10"
              onClick={handleButtonClick}
            />
            <div ref={suggestionRefs}>
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                className="w-full h-11 rounded-lg py-2 pl-12 pr-4 border focus:outline-slate-300 focus:drop-shadow-sm xl:w-[350px]"
                value={searchText}
                onChange={handleInputChange}
                onKeyDown={handelKeyDown}
              />
              {suggestions.length > 0 && (
                <ul className="absolute top-11 w-full bg-white border- border-gray-300 rounded-lg mt-1 z-10 max-h-52 overflow-y-auto">
                  {suggestions.map((suggestion: any, index: any) => (
                    <li
                      key={index}
                      ref={(el) => (suggestionRefs.current[index] = el)}
                      className={`p-2 cursor-pointer hover:bg-blue-700 hover:font-medium hover:text-slate-50 hover:rounded-lg ${
                        index === activeSuggestion
                          ? "bg-blue-700 font-medium text-slate-50 rounded-lg"
                          : ""
                      }`}
                      onClick={() => {
                        setsearchText(suggestion);
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </span>
          <button
            className="w-[86px] h-11 cursor-pointer rounded-lg flex-shrink-0 text-white bg-blue-600 hover:scale-105 lg:absolute lg:left-[940px] xl:left-[1203px]"
            onClick={handleButtonClick}
          >
            ค้นหา
          </button>
        </div>
        <div className="w-full h-11 flex justify-center gap-1 items-center lg:justify-start lg:max-w-[583px] xl:gap-8">
          <div className="w-auto pr-1 lg:h-[42px] xl:pl-36 lg:pr-0 lg:flex flex-col lg:justify-between">
            <p className=" text-xs font-normal  text-gray-700 lg:w-[120px]">
              หมวดหมู่บริการ
            </p>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="py-0 px-0 h-auto border-none shadow-none text-base font-medium focus:ring-0 text-gray-950 lg:text-base lg:font-medium">
                <SelectValue placeholder="บริการทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="บริการทั้งหมด"
                    className={`text-gray-700 ${
                      selecttedCategory === "บริการทั้งหมด"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    บริการทั้งหมด
                  </SelectItem>
                  <SelectItem
                    value="บริการทั่วไป"
                    className={`text-gray-700 ${
                      selecttedCategory === "บริการทั่วไป"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    บริการทั่วไป
                  </SelectItem>
                  <SelectItem
                    value="บริการห้องครัว"
                    className={`text-gray-700 ${
                      selecttedCategory === "บริการห้องครัว"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    บริการห้องครัว
                  </SelectItem>
                  <SelectItem
                    value="บริการห้องน้ำ"
                    className={`text-gray-700 ${
                      selecttedCategory === "บริการห้องน้ำ"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
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
                <SelectValue
                  placeholder={`${priceRange[0]}-${priceRange[1]}฿`}
                />
              </SelectTrigger>
              {isOpen && (
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-sm font-normal text-gray-700">
                      0 - 10000฿
                    </SelectLabel>
                    <div className="p-4 w-56 h-24">
                      <Range
                        values={priceRange}
                        step={100}
                        min={0}
                        max={10000}
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
                                  ((priceRange[0] - 0) / (10000 - 0)) * 100
                                }%`,
                                width: `${
                                  ((priceRange[1] - priceRange[0]) /
                                    (10000 - 0)) *
                                  100
                                }%`,
                              }}
                            />
                            {children}
                          </div>
                        )}
                        renderThumb={({ props, index }) => {
                          const { key, ...otherProps } = props;
                          return (
                            <div
                              key={index}
                              {...otherProps}
                              className="h-4 w-4 bg-white border-solid border-4 border-blue-700 rounded-full"
                            />
                          );
                        }}
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
                <p>{placeholder}</p>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="recommended"
                    className={`text-gray-700 ${
                      selecttedSortBy === "recommended"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    บริการแนะนำ
                  </SelectItem>
                  <SelectItem
                    value="popular"
                    className={`text-gray-700 ${
                      selecttedSortBy === "popular"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    บริการยอดนิยม
                  </SelectItem>
                  <SelectItem
                    value="asc"
                    className={`text-gray-700 ${
                      selecttedSortBy === "asc"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    "ตามตัวอักษร (Ascending)"
                  </SelectItem>
                  <SelectItem
                    value="desc"
                    className={`text-gray-700 ${
                      selecttedSortBy === "desc"
                        ? "!text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    "ตามตัวอักษร (Descending)"
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesListFilteredData;
