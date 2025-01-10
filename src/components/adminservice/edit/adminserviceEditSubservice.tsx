import IconDrag from "@/components/ui/IconDragAddAdmin";

// ประกาศ interface สำหรับ props ของ AddSubService

interface SubService {
  description: string;
  unit: string;
  unit_price: number;
}
interface AddSubServiceProps {
  index: number;
  subservice: SubService;
  deleteSubservice: (index: number) => void;
  updateSubservice: (
    index: number,
    field: "description" | "unit" | "unit_price",
    value: string | number
  ) => void;
  subServiceEmpty: boolean;
}

export function AdminserviceEditSubService({
  index,
  subservice,
  deleteSubservice,
  updateSubservice,
  subServiceEmpty,
}: AddSubServiceProps) {
  return (
    <>
      {/* sub service */}
      <div className="flex flex-row justify-between">
        <div className="mt-14">
          <IconDrag />
        </div>

        <div className="flex flex-col py-6 relative">
          <label
            htmlFor={`subserviceName-${index}`}
            className="text-sm text-gray-600">
            ชื่อบริการ
            {index === 0 && (
              <span className="text-red-600 text-base absolute top-5 font-medium">
                *
              </span>
            )}
          </label>
          <input
            type="text"
            id={`subserviceName-${index}`}
            value={subservice.description}
            onChange={(e) =>
              updateSubservice(index, "description", e.target.value)
            }
            className="border border-gray-300 h-11 rounded-lg w-[422px] pl-5"
          />
          {index === 0 && subServiceEmpty && (
            <p className="text-red-500 text-sm  absolute bottom-0 font-medium">
              กรุณากรอกข้อมูลให้ถูกต้อง
            </p>
          )}
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subservicePrice-${index}`}
            className="text-sm text-gray-600">
            ค่าบริการ / 1 หน่วย
          </label>
          <input
            type="number"
            id={`subservicePrice-${index}`}
            value={subservice.unit_price}
            onChange={(e) => {
              updateSubservice(index, "unit_price", e.target.value);
            }}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <div className="flex flex-col py-6">
          <label
            htmlFor={`subserviceUnit-${index}`}
            className="text-sm text-gray-600">
            หน่วยการบริการ
          </label>
          {index === 0 && (
            <span className="text-red-600 text-base absolute left-[94] top-5 font-medium">
              *
            </span>
          )}
          <input
            type="text"
            id={`subserviceUnit-${index}`}
            value={subservice.unit}
            onChange={(e) => updateSubservice(index, "unit", e.target.value)}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <button
          className="mt-[52px] cursor-pointer text-blue-500 hover:text-blue-700 underline font-medium flex"
          type="button"
          onClick={() => deleteSubservice(index)}>
          ลบรายการ
        </button>
      </div>
    </>
  );
}

// import IconDrag from "@/components/ui/IconDragAddAdmin";

// export function AdminserviceEditSubService({
//   index,
//   subservice,
//   deleteSubservice,
//   updateSubservice,
// }: {
//   index: number;
//   subservice: {
//     description: string;
//     unit: string;
//     unit_price: number;
//     subServiceEmpty: boolean;
//   };

//   deleteSubservice: (index: number) => void;

//   updateSubservice: (
//     index: number,
//     field: "description" | "unit" | "unit_price",
//     value: string | number
//   ) => void;
// }) {

{
  /* <div className="flex flex-col py-6">
<label
  htmlFor={`subservicePrice-${index}`}
  className="text-sm text-gray-600"
>
  ค่าบริการ / 1 หน่วย
</label>
<input
  type="number"
  id={`subservicePrice-${index}`}
  value={subservice.unit_price !== null ? subservice.unit_price : ""}
  onChange={(e) =>
    updateSubservice(index, "unit_price", e.target.value)
  }
  className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
/>
</div> */
}
