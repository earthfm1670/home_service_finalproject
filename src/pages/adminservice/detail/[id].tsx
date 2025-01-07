import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AdminserviceDetailNavbar } from "@/components/adminservice/detail/adminserviceDetailNavbar";
import { AdminserviceDetailService } from "@/components/adminservice/detail/adminserviceDetailService";

interface SubService {
  description: string;
  unit: string;
  unit_price: number;
}

export default function AdminserviceDetailIndex() {
  const [inputSubservice, setInputSubservice] = useState<SubService[]>([]);
  // console.log(
  //   "check subservice id and value of subservice when refresh window",
  //   inputSubservice
  // );
  const [inputTitle, setInputTitle] = useState<string>("");
  const [inputCat, setInputCat] = useState<number | undefined>();
  // console.log("this test for receive value inputCat", inputCat);
  const [inputImage, setInputImage] = useState<File>();
  // console.log("check image when update", inputImage);
  const [nameTopic, setNameTopic] = useState<string>("loading");
  const [URLimage, setURLimage] = useState<String>();
  // const [changeImage,setChangeImage] = useState<Boolean>(false)
  const [showPopUpDeleteImg, setShowPopUpDeleteImg] = useState<Boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <div className="flex flex-row w-full">
        <div>
          <AdminSidebar />
        </div>
        <div className="w-full flex flex-col">
          {/* navbar for admin page */}
          <AdminserviceDetailNavbar nameTopic={nameTopic} id={id} />
          <AdminserviceDetailService
            setInputSubservice={setInputSubservice}
            setInputTitle={setInputTitle}
            setInputCat={setInputCat}
            setNameTopic={setNameTopic}
            inputTitle={inputTitle}
          />
        </div>
      </div>
    </>
  );
}
