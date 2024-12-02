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
  getServicesData: () => void;
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

  const getServicesData = async () => {
    try {
      const response = await axios.get("URL_OF_YOUR_API"); // เปลี่ยนเป็น URL ของ API ที่คุณใช้
      setServicesData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
