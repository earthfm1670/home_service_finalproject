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
  subServiceEmpty: boolean;
}

export function AddSubService({
  index,
  subservice,
  deleteSubservice,
  updateSubservice,
  subServiceEmpty,

}: AddSubServiceProps) {


  // // ฟังก์ชันจัดการการกรอกชื่อบริการ
  // const cancleActionEmpty = (field: string, value: string | number) => {
  //   // ตรวจสอบว่าได้กรอกข้อมูลครบทั้ง 3 ฟิลด์หรือไม่
  //   const updatedSubservice = {
  //     description: field === "description" ? value : subservice.description,
  //     unit: field === "unit" ? value : subservice.unit,
  //     pricePerUnit: field === "pricePerUnit" ? value : subservice.pricePerUnit,
  //   };

  //   // หากกรอกข้อมูลครบแล้วให้ set subserviceEmpty เป็น false
  //   if (
  //     updatedSubservice.description !== "" &&
  //     updatedSubservice.unit !== "" &&
  //     updatedSubservice.pricePerUnit !== 0
  //   ) {
  //     setSubserviceEmpty(false);
  //   } 
  // };

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
            className="text-sm text-gray-600"
          >
            ชื่อบริการ
            {index === 0 && (
              <span className="text-red-600 text-base absolute top-5 font-medium">
                *
              </span>
            )}
          </label>
          {/* {subserviceEmpty && <p className="text-red-500">กรอกข้อมูลไม่ครบ</p>} */}
          <input
            type="text"
            id={`subserviceName-${index}`}
            value={subservice.description}
            onChange={(e) => {
              updateSubservice(index, "description", e.target.value);
              // cancleActionEmpty("description", e.target.value)
            }}
            className="border border-gray-300 h-11 rounded-lg w-[422px] pl-5 "
            />
            {/* {index === 0 &&subserviceEmpty && (
              <p className="text-red-500 text-sm  absolute bottom-0 font-medium">กรุณากรอกข้อมูลให้ถูกต้อง</p> */}
          {index === 0 && subServiceEmpty && (
            <p className="text-red-500 text-sm  absolute bottom-0 font-medium">
              กรุณากรอกข้อมูลให้ถูกต้อง
            </p>
          )}
        </div>
        <div className="flex flex-col py-6 relative">
          <label
            htmlFor={`subservicePrice-${index}`}
            className="text-sm text-gray-600 "
          >
            ค่าบริการ / 1 หน่วย
          </label>
          {index === 0 && (
            <span className="text-red-600 text-base absolute left-[115] top-5 font-medium">
              *
            </span>
          )}
          <input
            type="number"
            id={`subservicePrice-${index}`}
            // value={subservice.pricePerUnit}
            onChange={(e) => {
              updateSubservice(index, "pricePerUnit", e.target.value);
              // cancleActionEmpty("pricePerUnit", e.target.value)
            }}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <div className="flex flex-col py-6 relative">
          <label
            htmlFor={`subserviceUnit-${index}`}
            className="text-sm text-gray-600"
          >
            หน่วยการบริการ
          </label>
          {index === 0 && (
            <span className="text-red-600 text-base absolute left-[94] top-5 font-medium">*</span>
          )}
          <input
            type="text"
            id={`subserviceUnit-${index}`}
            value={subservice.unit}
            onChange={(e) => {
              updateSubservice(index, "unit", e.target.value);
              // cancleActionEmpty("unit", e.target.value)
            }}
            className="border border-gray-300 h-11 rounded-lg w-[240px] pl-5"
          />
        </div>
        <h1
          className="mt-[52px] cursor-pointer text-blue-500 hover:text-blue-700 underline font-medium"
          onClick={() => deleteSubservice(index)}
        >
          ลบรายการ
        </h1>
      </div>
    </>
  );
}
