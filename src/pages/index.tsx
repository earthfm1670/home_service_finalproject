import HomeFooter from "@/components/homefooter";
import HomeHero from "@/components/homehero";
import HomeJoinUs from "@/components/homejoinus";
import HomeService from "@/components/homeservice";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <HomeService />
      <HomeJoinUs />
      <HomeFooter />
    </>
  );
}
