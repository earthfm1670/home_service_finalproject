import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useServices } from "@/components/ServicesContext";
import axios from "axios";
import { useRouter } from "next/router";
import IconWarning from "@/components/ui/Iconwarning";
import IconX from "@/components/ui/IconX";
import { AdminPromotionIndexNavbar } from "@/components/admin-promotion/page-index/adminPromotionIndexNavbar";
import IconTrash from "@/components/ui/IconTrash";
import IconTrashRed from "@/components/ui/IconTrashRed";
import { IconEditBlue } from "@/components/ui/IconEditBlue";
import { IconEditDeepBlue } from "@/components/ui/IconEditDeepBlue";

export default function AdminNavbar() {
  const [input, setInput] = useState("");
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const router = useRouter();

  return (
    <>
      <div className="flex flex-row w-full">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full flex flex-col">
          <AdminPromotionIndexNavbar handleInputChange={handleInputChange} />
          <AdminPromotionIndex input={input} />
        </div>
      </div>
    </>
  );
}

export const AdminPromotionIndex = ({ input }: { input: string | null }) => {
  interface Promotion {
    id: string;
    created_at: string;
    end_at: string;
    discount_value: number;
    promotion_code: string;
    promotion_id: number;
    promotion_status: string;
    usage_limit: number;
    usage_pool: number;
  }

  const router = useRouter();

  const [promotionCodeList, setPromotionCodeList] = useState<Promotion[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(
    null
  );

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/admin/promotions?search=${input}`);
      setPromotionCodeList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (promotionId: number) => {
    try {
      const response = await axios.delete(
        `/api/admin/promotions/delete/${promotionId}`
      );
      console.log("Promotion deleted", response.data);
      fetchUser();
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [input]);

  return (
    <>
      <div className="">
        <div className="flex flex-row w-full">
          <div className="w-full flex flex-col">
            <div className="min-h-screen w-full flex justify-center items-start py-12 min-w-[1200px]  bg-gray-100">
              <div className="flex max-w-[1120px] border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-gray-500">
                  <thead>
                    <tr className="h-10 bg-gray-200 text-gray-500">
                      <th className="w-[166px] text-start pl-6 font-normal text-sm">
                        Promotion Code
                      </th>
                      <th className="w-[105px] text-start pl-6 font-normal text-sm">
                        ประเภท
                      </th>
                      <th className="w-[140px] text-start pl-6 font-normal text-sm">
                        โควต้าการใช้(ครั้ง)
                      </th>
                      <th className="w-[145px] text-start pl-6 font-normal text-sm">
                        ราคาที่ลด
                      </th>
                      <th className="w-[209px] text-start pl-6 font-normal text-sm">
                        สร้างเมื่อ
                      </th>
                      <th className="w-[209px] text-start pl-6 font-normal text-sm">
                        วันหมดอายุ
                      </th>
                      <th className="w-[120px] text-center font-normal text-sm">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(promotionCodeList) &&
                    promotionCodeList.length > 0 ? (
                      promotionCodeList
                        .sort(
                          (a: Promotion, b: Promotion) =>
                            a.promotion_id - b.promotion_id
                        ) // เรียงลำดับตาม id
                        .map((promotionCode: Promotion, index: number) => (
                          <tr
                            key={promotionCode.promotion_id}
                            className="border-t bg-white h-20 text-black"
                          >
                            <td className="px-auto text-start pl-6">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/adminpromotioncode/detail/${promotionCode.promotion_id}`
                                  )
                                }
                              >
                                {promotionCode.promotion_code}
                              </button>
                            </td>
                            <td className="px-auto text-start pl-6">
                              {promotionCode.usage_pool === 0 ||
                              promotionCode.usage_pool === null
                                ? `Unabailable`
                                : `Percent`}
                            </td>
                            <td className="px-auto text-start pl-6">
                              {promotionCode.usage_pool != null &&
                              promotionCode.usage_limit != null
                                ? `${promotionCode.usage_pool}/${promotionCode.usage_limit}`
                                : `0/0`}
                            </td>
                            <td className="px-auto text-start pl-6 text-red-600">
                              {promotionCode.promotion_status === "fixed"
                                ? `-${promotionCode.discount_value}฿`
                                : `-${(
                                    promotionCode.discount_value * 100
                                  ).toFixed(2)}%`}
                            </td>
                            <td className="px-auto text-start pl-6">
                              {new Date(
                                promotionCode.created_at
                              ).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}{" "}
                              {new Date(
                                promotionCode.created_at
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>
                            <td className="px-auto text-start pl-6">
                              {new Date(
                                promotionCode.end_at
                              ).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              })}{" "}
                              {new Date(
                                promotionCode.end_at
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </td>
                            <td className="flex flex-row items-center justify-center gap-7 py-7">
                              <button
                                className="flex flex-row items-center gap-2 font-medium underline cursor-pointer text-gray-500 group"
                                type="button"
                                onClickCapture={() => {
                                  setPromotionToDelete(promotionCode);
                                  setShowPopup(true);
                                }}
                              >
                                <div className="group-active:hidden">
                                  <IconTrash />
                                </div>
                                <div className="hidden group-active:inline">
                                  <IconTrashRed />
                                </div>
                              </button>

                              <button
                                className="flex flex-row items-center gap-2 font-medium underline cursor-pointer text-gray-500 group"
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/adminpromotioncode/edit/${promotionCode.promotion_id}`
                                  )
                                }
                              >
                                <div className="group-active:hidden">
                                  <IconEditBlue />
                                </div>
                                <div className="hidden group-active:inline">
                                  <IconEditDeepBlue />
                                </div>
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <div className="w-full py-10 flex justify-center items-center text-3xl gap-3">
                            <div>Loading</div>
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-transparent border-gray-800"></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPopup && promotionToDelete && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[360px] h-auto flex flex-col items-center rounded-xl p-4 gap-3">
            <div className="w-full">
              <button
                type="button"
                className="ml-auto flex justify-end items-end"
                onClick={() => {
                  setShowPopup(false);
                  setPromotionToDelete(null);
                }}
              >
                <IconX />
              </button>
              <div className="flex justify-center">
                <IconWarning />
              </div>
            </div>
            <h1 className="font-medium text-xl ">ยืนยันการลบรายการ ?</h1>
            <h1 className="text-center text-gray-500">
              คุณต้องการลบรายการ '{promotionToDelete.promotion_code}' <br />
              ใช่หรือไม่
            </h1>
            <div className="flex flex-row gap-3">
              <button
                className="bg-defaultColor text-white w-28 py-2 rounded-lg font-medium"
                onClick={() => {
                  handleDelete(promotionToDelete.promotion_id);
                  setShowPopup(false);
                  setPromotionToDelete(null);
                }}
              >
                ลบรายการ
              </button>
              <button
                className="bg-white text-defaultColor border-[1px] border-defaultColor w-28 py-2 rounded-lg font-medium"
                onClick={() => {
                  setShowPopup(false);
                  setPromotionToDelete(null);
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
