import React from "react";
import { Button } from "@/components/ui/button";

function Registration() {
  return (
    <div className="flex justify-between items-center border shadow-lg px-2">
      <div>
        <img src="/image/homeservicelogo.svg"></img>
      </div>
      <div className="flex items-center gap-2">
        <div>บริการของเรา</div>
        <div>
          <ButtonLogin />
        </div>
      </div>
    </div>
  );
}

export function ButtonLogin() {
  return (
    <Button className="text-[#336DF2] bg-white border border-blue-600 px-2">
      เข้าสู่ระบบ
    </Button>
  );
}

export default Registration;
