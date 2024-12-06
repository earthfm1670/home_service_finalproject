// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import axios from "axios";


// interface AdminContextProps {
//     servicesData: any[];
//     getServicesData: (
//       selecttedCategory?: string,
//       sortBy?: string,
//       priceRange?: [number, number],
//       searchValue?: string
//     ) => void;
//   }
  
//   const ServicesContext = createContext<AdminContextProps | undefined>(
//     undefined
//   );
  
//   export const useServices = () => {
//     const context = useContext(ServicesContext);
//     if (!context) {
//       throw new Error("useServices must be used within a ServicesProvider");
//     }
//     return context;
//   };