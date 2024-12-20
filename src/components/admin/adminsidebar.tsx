import homeservicelogo from "../../../public/image/homeservicelogo.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminSidebar() {
  const [activeButton, setActiveButton] = useState("");
  const router = useRouter();

  const getButtonClass = (path: string) => {
    return router.pathname === path
      ? "bg-[#022B87]" // สีพื้นหลังของปุ่มที่เลือก
      : "hover:bg-[#022B87]"; // สีพื้นหลังปกติเมื่อไม่ได้เลือก
  };

  return (
    <>
      {/* sidebar admin */}
      <div className="flex flex-col bg-[#001C59] min-w-60 h-screen sticky top-0 justify-between text-white">
        {/* button for div top */}
        <div className="w-full">
          <div className="px-6">
            <button
              className="my-10 bg-blue-100 w-full h-11 flex justify-center items-center rounded-lg active:bg-pressedColor"
              onClick={() => router.push("/")}
            >
              <Image src={homeservicelogo} alt="Homeservice Logo" />
            </button>
          </div>
          {/* button list */}
          <div className="">
            <div className={`w-full ${getButtonClass("/admincategory")} cursor-pointer`}
            onClick={() => router.push("/admincategory")}>
              <button
                className="flex flex-row gap-4 px-6 py-4"
                
              >
                <Icon1 />
                หมวดหมู่
              </button>
            </div>
            <div className={`w-full ${getButtonClass("/adminservice")} cursor-pointer`}
            onClick={() => router.push("/adminservice")}>
              <button
                className="flex flex-row gap-4 px-6 py-4"
                
              >
                <Icon2 />
                บริการ
              </button>
            </div>
            <div
              className={`w-full ${getButtonClass("/adminpromotioncode")} cursor-pointer`}
              onClick={() => router.push("/adminpromotioncode")}
            >
              <button className="flex flex-row gap-4 px-6 py-4">
                <Icon3 />
                Promotion Code
              </button>
            </div>
          </div>
          {/* button for div tail */}
        </div>
        <div className="hover:bg-[#022B87] w-full my-16">
          <button className="flex flex-row gap-4 px-6 py-4">
            <Icon4 />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </>
  );
}

function Icon1() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8C8.53043 4 9.03914 4.21071 9.41421 4.58579C9.78929 4.96086 10 5.46957 10 6V8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10H6C5.46957 10 4.96086 9.78929 4.58579 9.41421C4.21071 9.03914 4 8.53043 4 8V6ZM14 6C14 5.46957 14.2107 4.96086 14.5858 4.58579C14.9609 4.21071 15.4696 4 16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V8C20 8.53043 19.7893 9.03914 19.4142 9.41421C19.0391 9.78929 18.5304 10 18 10H16C15.4696 10 14.9609 9.78929 14.5858 9.41421C14.2107 9.03914 14 8.53043 14 8V6ZM4 16C4 15.4696 4.21071 14.9609 4.58579 14.5858C4.96086 14.2107 5.46957 14 6 14H8C8.53043 14 9.03914 14.2107 9.41421 14.5858C9.78929 14.9609 10 15.4696 10 16V18C10 18.5304 9.78929 19.0391 9.41421 19.4142C9.03914 19.7893 8.53043 20 8 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V16ZM14 16C14 15.4696 14.2107 14.9609 14.5858 14.5858C14.9609 14.2107 15.4696 14 16 14H18C18.5304 14 19.0391 14.2107 19.4142 14.5858C19.7893 14.9609 20 15.4696 20 16V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H16C15.4696 20 14.9609 19.7893 14.5858 19.4142C14.2107 19.0391 14 18.5304 14 18V16Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Icon2() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 7V15C8 15.5304 8.21071 16.0391 8.58579 16.4142C8.96086 16.7893 9.46957 17 10 17H16M8 7V5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14.586C14.8512 3.00006 15.1055 3.10545 15.293 3.293L19.707 7.707C19.8946 7.89449 19.9999 8.1488 20 8.414V15C20 15.5304 19.7893 16.0391 19.4142 16.4142C19.0391 16.7893 18.5304 17 18 17H16M8 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H14C14.5304 21 15.0391 20.7893 15.4142 20.4142C15.7893 20.0391 16 19.5304 16 19V17"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Icon3() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5V7V5ZM15 11V13V11ZM15 17V19V17ZM5 5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V10C3.53043 10 4.03914 10.2107 4.41421 10.5858C4.78929 10.9609 5 11.4696 5 12C5 12.5304 4.78929 13.0391 4.41421 13.4142C4.03914 13.7893 3.53043 14 3 14V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V14C20.4696 14 19.9609 13.7893 19.5858 13.4142C19.2107 13.0391 19 12.5304 19 12C19 11.4696 19.2107 10.9609 19.5858 10.5858C19.9609 10.2107 20.4696 10 21 10V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Icon4() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 15.9998V16.9998C13 17.7954 12.6839 18.5585 12.1213 19.1211C11.5587 19.6837 10.7956 19.9998 10 19.9998H6C5.20435 19.9998 4.44129 19.6837 3.87868 19.1211C3.31607 18.5585 3 17.7954 3 16.9998V6.99976C3 6.20411 3.31607 5.44104 3.87868 4.87844C4.44129 4.31583 5.20435 3.99976 6 3.99976H10C10.7956 3.99976 11.5587 4.31583 12.1213 4.87844C12.6839 5.44104 13 6.20411 13 6.99976V7.99976M17 15.9998L21 11.9998L17 15.9998ZM21 11.9998L17 7.99976L21 11.9998ZM21 11.9998H7H21Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
