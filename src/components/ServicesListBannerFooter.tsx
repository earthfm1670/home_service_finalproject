import React from "react";
import { Phone, Mail } from "lucide-react";

const ServicesListBannerFooter: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <section className="w-[375px] h-[458px] relative mt-8 px-6 py-12 overflow-hidden bg-blue-600 lg:w-[1440px] lg:h-[284px]">
        <h1 className="absolute max-w-[327px] h-[243px] text-lg font-medium text-center text-[#FFFFFF] lg:left-[315px] lg:top-[82px] lg:flex lg:max-w-[810px] lg:max-h-[120px] ">
          <p className="lg:hidden">
            เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ<br></br> 1 แบบครบวงจร
            <br></br>
            โดยทีมช่างมืออาชีพมากกว่า 100 ทีม<br></br>
            สามารถตอบโจทย์ด้านการบริการเรื่องบ้าน<br></br>ของคุณ และสร้าง
            <br></br>
            ความสะดวกสบายในการติดต่อกับทีมช่าง<br></br> ได้ทุกที่ ทุกเวลา ตลอด
            24 ชม.<br></br>
            มั่นใจ ช่างไม่ทิ้งงาน<br></br> พร้อมรับประกันคุณภาพงาน
          </p>
          <p className="hidden lg:block lg:text-center lg:text-xl">
            เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร
            โดยทีมช่างมืออาชีพมากกว่า 100 ทีม <br></br>
            สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง<br></br>
            ความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.
            <br></br>
            มั่นใจ ช่างไม่ทิ้งงาน พร้อมรับประกันคุณภาพงาน
          </p>
        </h1>

        <img
          src="https://s3-alpha-sig.figma.com/img/f2e9/bce5/f0733b5ff94a23b59fd5fccba21d7d98?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=keODkbCXtDrRpqtrJIGHKgdtmTaacAWJVSrVrVon8qwyXxaRyt0gHvn1fC9mSfFaTBGDNOttdi~DY-SwsZy3jx~EMqLHhJz35mOr~oBbI~j1KmLtx76i3HIQ1hdXU3PGqrba1qCbONhGE4mIiU6OdNNsnwVAEDE9OREYARXiZwLpP3ITdsJh1Ak~eeKBrUfJg2TVwNFi9Jt5wO1cDigam9PdPrdMWA4Eg56cVDapXmPGrvXmUwurNsF6rSR14UUyG3anToWREJx5tq3PyxHUJFh50mlAor-qdQ5eZjEDABHPWjSuaHw6mUFoDVzeTBPux06udMCZca-wMJaMJXoXDA__"
          alt="House"
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-[250px] h-[250px] opacity-20 lg:w-[416px] lg:h-[416px] lg:left-[1370px] lg:top-[-29px]"
        />
      </section>

      <footer className="w-[375px] h-[389px] flex flex-col items-center justify-center lg:w-[1440px] lg:h-[193px]">
        <div className="h-[273px] flex flex-col px-4 py-6 gap-6 lg:w-[1440px] lg:h-[151px] lg:relative">
          <div className="flex w-full h-10 items-center gap-2 lg:absolute lg:left-40 lg:top-[46px] lg:w-64 lg:h-11">
            <img
              src="https://s3-alpha-sig.figma.com/img/f2e9/bce5/f0733b5ff94a23b59fd5fccba21d7d98?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=keODkbCXtDrRpqtrJIGHKgdtmTaacAWJVSrVrVon8qwyXxaRyt0gHvn1fC9mSfFaTBGDNOttdi~DY-SwsZy3jx~EMqLHhJz35mOr~oBbI~j1KmLtx76i3HIQ1hdXU3PGqrba1qCbONhGE4mIiU6OdNNsnwVAEDE9OREYARXiZwLpP3ITdsJh1Ak~eeKBrUfJg2TVwNFi9Jt5wO1cDigam9PdPrdMWA4Eg56cVDapXmPGrvXmUwurNsF6rSR14UUyG3anToWREJx5tq3PyxHUJFh50mlAor-qdQ5eZjEDABHPWjSuaHw6mUFoDVzeTBPux06udMCZca-wMJaMJXoXDA__"
              alt="House"
              className="size-10 opacity-90"
            />
            <h1 className="text-3xl font-medium text-blue-600">HomeServices</h1>
          </div>
          <div className="flex flex-col justify-between h-[77px]">
            <h1 className="text-lg font-medium text-gray-950 lg:absolute lg:left-[495px] lg:top-[49px] lg:w-56 lg:h-7">
              บริษัท โฮมเซอร์วิสเซส จำกัด
            </h1>
            <p className="text-sm font-normal text-gray-800 lg:absolute lg:left-[495px] lg:top-[83px] lg:w-[480px] lg:h-[21px]">
              452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
            </p>
          </div>
          <div className="flex flex-col justify-between h-14 lg:absolute lg:left-[1047px] lg:top-[47px]">
            <span>
              <p className="text-base font-normal text-gray-800 flex gap-3">
                <Phone size={20} />
                080-540-6357
              </p>
            </span>
            <span>
              <p className="text-base font-normal text-gray-800 flex gap-3">
                <Mail size={20} />
                contact@homeservices.co
              </p>
            </span>
          </div>
        </div>
        <div className="h-[116px] flex flex-col p-4 gap-4 lg:w-[1440px] lg:h-[42px] lg:relative bg-gray-100">
          <span className=" w-[343px] h-[50px] flex flex-col justify-between text-sm font-normal text-gray-700 lg:absolute lg:left-[895px] lg:top-[13px] lg:flex-row lg:w-96 lg:h-[21px]">
            <p>เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์</p>
            <p>นโยบายความเป็นส่วนตัว</p>
          </span>
          <p className=" w-[343px] text-xs font-normal text-gray-500 lg:absolute lg:left-40 lg:top-3 lg:w-[372px] lg:h-[18px]">
            copyright © 2021 HomeServices.com All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ServicesListBannerFooter;
