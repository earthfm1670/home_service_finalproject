import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ProgressStepsNew } from "./ProgressSteps";

interface ServiceHeroProps {
  service: {
    service_picture_url: string;
    service_name: string;
  };
}

export default function ServiceHero({ service }: ServiceHeroProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const path = router.pathname;
    if (path.includes("/detail")) {
      setCurrentStep(1);
    } else if (path.includes("/info")) {
      setCurrentStep(2);
    } else if (path.includes("/payment")) {
      setCurrentStep(3);
    }
  }, [router.pathname]);

  return (
    <div className="relative h-[168px] w-full lg:h-56">
      <Image
        src={service.service_picture_url}
        alt={service.service_name}
        layout="fill"
        objectFit="cover"
        priority
      />
      <div className="absolute inset-0 bg-[#163C9366]">
        <div className="px-4 pt-9 lg:px-32 lg:mt-5">
          {/* Breadcrumb */}
          <div className="bg-white rounded-md py-2 px-4 inline-flex items-center space-x-2 lg:p-5 lg:ml-8">
            <Link
              href="/services"
              className="text-gray-500 hover:text-blue-600 text-sm"
            >
              บริการของเรา
            </Link>
            <span className="text-gray-500">&gt;</span>
            <span className="text-blue-600 font-bold text-2xl lg:text-3xl">
              {service.service_name}
            </span>
          </div>
          <ProgressStepsNew currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
}
