import React from "react";
import ServicesListRendering from "@/components/ServicesListRendering";
import ServicesListFilteredData from "@/components/ServicesListFilteredData";
import { ServicesProvider } from "@/components/ServicesContext";
import { Navbar } from "@/components/navbar";
import HomeFooter from "@/components/homefooter";

const ServicesList: React.FC = () => {
  return (
    <ServicesProvider>
      <Navbar />
      <ServicesListFilteredData />
      <ServicesListRendering />
      <HomeFooter />
    </ServicesProvider>
  );
};

export default ServicesList;
