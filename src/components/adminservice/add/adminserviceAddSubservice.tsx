import IconDrag from "@/components/ui/IconDragAddAdmin";

// ประกาศ interface สำหรับ props ของ AddSubService
interface AddSubServiceProps {
  index: number;
  subservice: { description: string; unit: string; pricePerUnit: number };
  deleteSubservice: (index: number) => void;
  updateSubservice: (
    index: number,
    field: "description" | "unit" | "pricePerUnit",
    value: string | number
  ) => void;
  subserviceEmpty: boolean[];
  setSubserviceEmpty: (value: boolean[]) => void;
}

export function AddSubService({
  index,
  subservice,
  deleteSubservice,
  updateSubservice,
  subserviceEmpty,
  setSubserviceEmpty
}: AddSubServiceProps) {
  return (
    <>
      {/* sub service */}
      <div className="flex flex-row justify-between">
        <div className="mt-14">
          <IconDrag />
        </div>

        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceName-${index}`}
            className="text-sm text-gray-600"
          >
            ชื่อบริการ
          </label>
          {subserviceEmpty && <p className="text-red-500">กรอกข้อมูลไม่ครบ</p>}
          <input
            type="text"
            id={`subserviceName-${index}`}
            value={subservice.description}
            onChange={(e) =>
              updateSubservice(index, "description", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[422px] pl-5"
          />
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subservicePrice-${index}`}
            className="text-sm text-gray-600"
          >
            ค่าบริการ / 1 หน่วย
          </label>
          <input
            type="number"
            id={`subservicePrice-${index}`}
            // value={subservice.pricePerUnit}
            onChange={(e) =>
              updateSubservice(index, "pricePerUnit", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceUnit-${index}`}
            className="text-sm text-gray-600"
          >
            หน่วยการบริการ
          </label>
          <input
            type="text"
            id={`subserviceUnit-${index}`}
            value={subservice.unit}
            onChange={(e) => updateSubservice(index, "unit", e.target.value)}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <h1
          className="mt-[52px] active:text-[#FF6347] cursor-pointer underline font-semibold text-gray-400"
          onClick={() => deleteSubservice(index)}
        >
          ลบรายการ
        </h1>
      </div>
    </>
  );
}
