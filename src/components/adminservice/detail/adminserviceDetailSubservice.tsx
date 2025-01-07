export function AdminserviceDetailSubservice({
    index,
    subservice,
  }: {
    index: number;
    subservice: {
      description: string;
      unit: string;
      unit_price: number;
    };
  }) {
    return (
      <>
        {/* sub service */}
        <div className="flex flex-row justify-between w-[980px]">
          <div className="flex flex-col py-6">
            <label
              htmlFor={`subserviceName-${index}`}
              className="text-sm text-gray-600"
            >
              ชื่อบริการ
            </label>
            <div className="border-gray-300 h-11 rounded-lg w-[422px] items-center flex">
              {subservice.description}
            </div>
          </div>
          <div className="flex flex-col py-6">
            <label
              htmlFor={`subservicePrice-${index}`}
              className="text-sm text-gray-600"
            >
              ค่าบริการ / 1 หน่วย
            </label>
            <div className="border-gray-300 h-11 rounded-lg w-[240px] items-center flex">
              {subservice.unit_price}
            </div>
          </div>
          <div className="flex flex-col py-6">
            <label
              htmlFor={`subserviceUnit-${index}`}
              className="text-sm text-gray-600"
            >
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
  