interface AdminServiceEditNavbarProps {
  createAt: string;
  updateAt: string;
}

export function AdminServiceEditDate({
  createAt,
  updateAt,
}: AdminServiceEditNavbarProps) {
  return (
    <>
      <div className="flex flex-row gap-5 w-[400px]">
        <div className="flex flex-col justify-between w-full gap-5 text-gray-500 font-medium">
          <div>สร้างเมื่อ</div>
          <div>แก้ไขล่าสุด</div>
        </div>
        <div className="flex flex-col justify-between w-full gap-5 ">
          <div className="flex gap-2">
            <div>
              {new Date(createAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
            {new Date(createAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
          <div className="flex gap-2 ">
            <div>
              {new Date(updateAt).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
            {new Date(updateAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </>
  );
}
