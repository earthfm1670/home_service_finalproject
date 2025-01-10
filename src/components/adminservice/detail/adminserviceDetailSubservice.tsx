interface Subservice {
  id: string;
  name: string;
  unit_price: number | null;
  description: string;
  unit: string;
  pricePerUnit: number;
}
interface AdminserviceDetailSubserviceProp {
  index: number;
  subservice: Subservice;
}

export function AdminserviceDetailSubservice({
  index,
  subservice,
}: AdminserviceDetailSubserviceProp) {
  return (
    <>
      {/* sub service */}
      <div className="flex flex-row justify-between w-[980px]">
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceName-${index}`}
            className="text-sm text-gray-600">
            ชื่อบริการ
          </label>
          <div className="border-gray-300 h-11 rounded-lg w-[422px] items-center flex">
            {subservice.description}
          </div>
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subservicePrice-${index}`}
            className="text-sm text-gray-600">
            ค่าบริการ / 1 หน่วย
          </label>
          <div className="border-gray-300 h-11 rounded-lg w-[240px] items-center flex">
            {subservice.unit_price}
          </div>
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceUnit-${index}`}
            className="text-sm text-gray-600">
            หน่วยการบริการ
          </label>
          <div className="border-gray-300 h-11 rounded-lg w-[240px] items-center flex">
            {subservice.unit}
          </div>
        </div>
      </div>
    </>
  );
}
