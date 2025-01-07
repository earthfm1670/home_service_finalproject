import IconPlusDefaultColor from "../ui/IconPluseDefaultColor";

interface AdminButtonAddSubService {
    addSubService:() => void;
}

export function AdminButtonAddSubService({addSubService,}:AdminButtonAddSubService) {
  return (
    <>
      <button
        type="button"
        className="bg-white text-defaultColor text-base h-10 flex items-center justify-center gap-3 rounded-lg border border-defaultColor px-7 mt-7"
        onClick={addSubService}
      >
        เพิ่มรายการ
        <span>
          <IconPlusDefaultColor />
        </span>
      </button>
    </>
  );
}
