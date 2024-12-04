import React from "react";
import ServicesListBannerFooter from "@/components/ServicesListBannerFooter";
import ServicesListRendering from "@/components/ServicesListRendering";
import ServicesListFilteredData from "@/components/ServicesListFilteredData";
import { ServicesProvider } from "@/components/ServicesContext";

const ServicesList: React.FC = () => {
  return (
    <ServicesProvider>
      <ServicesListFilteredData />
      <ServicesListRendering />
      <ServicesListBannerFooter />
    </ServicesProvider>
  );
};

export default ServicesList;
