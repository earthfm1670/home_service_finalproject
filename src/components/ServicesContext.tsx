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

  const getServicesData = async (
    selectCategory = "",
    sortBy = "",
    priceRange: [Number, Number] = [0, 2000],
    searchValue = ""
  ) => {
    try {
      console.log(
        `Seleted = ${selectCategory}, Sort By = ${sortBy}, Price Range Min = ${priceRange[0]} Max= ${priceRange[1]} SearchText = ${searchValue}`
      );
      const response = await axios.get(
        `api/services?limit=100&category=${selectCategory}&sortBy=${sortBy}`
      );
      setServicesData(response.data.data);
      console.log("API response:", response.data.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getServicesData();
  }, []);

  return (
    <ServicesContext.Provider value={{ servicesData, getServicesData }}>
      {children}
    </ServicesContext.Provider>
  );
};
