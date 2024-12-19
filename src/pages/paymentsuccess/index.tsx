import { Navbar } from "@/components/navbar";

function PaymentSuccess() {
  return (
    <>
      <Navbar />
      <div className="h-[475px] border border-black mx-4 my-8">
        <div className="border border-black h-[118px] mx-4 flex flex-col justify-center items-center">
          <div className="">
            <img
              src="/image/paymentsuccess.svg"
              alt="checkmarkicon"
              className="w-[64px] h-[64px]"
            ></img>
          </div>
          <p className="text-blue-950 font-medium text-[20px]">
            ชำระเงินเรียบร้อย !
          </p>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
