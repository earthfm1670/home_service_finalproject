import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";

interface SubServiceFromAdmin {
  description: string;
  unit: string;
  pricePerUnit: number;
}

interface PostRequestBody {
  title: string;
  category_id: number;
  image: string;
  subService: Array<SubServiceFromAdmin>;
  created_at?: string;
  updated_at?: string;
}

// ทำฟังก์ชั่น create
export default async function adminCreate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Method not allow." });
  }
  // check credential

  // create data chunk
  const newServices: PostRequestBody = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    // 1.คิวรี่เพื่อใส่ main service
    const { data: insertedMainService, error: insertError } =
      await adminSupabase.from("services").insert([
        {
          service_name: newServices.title,
          category_id: newServices.category_id,
        },
      ]);
    if (insertError) {
      console.error(insertError);
      return res
        .status(400)
        .json({ error: "Error occor during insert main service" });
    } else {
      console.log(insertedMainService);
      console.log("Main service inserted");
    }

    //2.ดึง service_id ออกมา
    const { data: serviceId, error: fetchServiceIdError } = await adminSupabase
      .from("services")
      .select("service_id")
      .eq("service_name", newServices.title)
      .single();

    if (fetchServiceIdError) {
      console.error("Error fetching service_id:", fetchServiceIdError.message);
    } else {
      console.log(`service_id fetched: ${serviceId.service_id}`);
    }

    //3.ลูปเพื่อใส่ sub service ใน table
    if (newServices.subService.length > 0) {
      const subInsert = [];
      for (let i = 0; i < newServices.subService.length; i++) {
        subInsert.push({
          service_id: Number(serviceId?.service_id),
          description: newServices.subService[i].description,
          unit: newServices.subService[i].unit,
          unit_price: newServices.subService[i].pricePerUnit,
          created_at: newServices.created_at,
          updated_at: newServices.updated_at,
        });
      }

      const { data: subInsertedData, error: subInsertedError } =
        await adminSupabase.from("sub_services").insert(subInsert).select();
      if (subInsertedError) {
        console.log(subInsertedError);
        return res.status(400).json({
          message: "Error occur during insert sub services",
          detail: subInsertedError,
        });
      }
      if (subInsertedData) {
        return res.status(201).json({ message: "Insert data successfully" });
      }
    }
    return res.status(201).json({ message: "Insert data successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unexpected error occur during data insert",
    });
  }
}
