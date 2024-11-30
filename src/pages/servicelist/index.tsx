import React from "react";
import ServicesListBannerFooter from "@/components/ServicesListBannerFooter";
import ServicesListRendering from "@/components/ServicesListRendering";
import ServicesListFilteredData from "@/components/ServicesListFilteredData";

const ServicesList: React.FC = () => {
  return (
    <>
      <ServicesListFilteredData />
      <ServicesListRendering />
      <ServicesListBannerFooter />
    </>
  );
};

export default ServicesList;
