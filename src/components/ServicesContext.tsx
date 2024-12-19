import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface ServicesContextProps {
  servicesData: any[];
  allServiceNames: string[];
  getServicesData: (
    selecttedCategory?: string,
    sortBy?: string,
    priceRange?: [number, number],
    searchValue?: string
  ) => void;
}

const ServicesContext = createContext<ServicesContextProps | undefined>(
  undefined
);

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
};

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [allServiceNames, setAllServiceNames] = useState<string[]>([]);

  const getServicesData = async (
    selectCategory = "บริการทั้งหมด",
    sortBy = "popular",
    priceRange: [Number, Number] = [0, 0],
    searchValue = ""
  ) => {
    try {
      const response = await axios.get(
        `api/services?category=${selectCategory}&sort_by=${sortBy}&min_price=${priceRange[0]}&max_price=${priceRange[1]}&search=${searchValue}`
      );
      setServicesData(response.data.data);
      setAllServiceNames(response.data.allServiceNames);
      console.log("API response:", response.data.data); // log api response จาก database
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getServicesData();
  }, []);

  return (
    <ServicesContext.Provider
      value={{ servicesData, allServiceNames, getServicesData }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
