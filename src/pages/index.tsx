import HomeHero from "@/components/homehero";
import HomeService from "@/components/homeservice";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <HomeService />
    </>
  );
}
