import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";

interface SubServiceFromAdmin {
  description: string;
  unit: string;
  pricePerUnit: number;
}

interface PostRequestBody {
  title: string;
  category_id: number;
  image: File | null;
  subServices: Array<SubServiceFromAdmin>;
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
  const newService: PostRequestBody = {
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    // 1.คิวรี่เพื่อใส่ main service + ใส่ image url
    const { data: serviceId, error: insertError } = await adminSupabase
      .from("services")
      .insert([
        {
          service_name: newService.title,
          category_id: newService.category_id,
        },
      ])
      .select("service_id");
    if (insertError) {
      console.log("Error occor during insert main service.");
      console.error(insertError);
      return res.status(400).json({ error: "Service already exit." });
    } else {
      console.log("Main service inserted.");
    }

    //2.5 Image Upload
    if (newService.image) {
      const imageFileName = serviceId[0].service_id + "/" + uuidv4();

      const { error: insertedImageError } = await adminSupabase.storage
        .from("service_pictures")
        .upload(imageFileName, newService.image);
      //0.1 ยัด url ลง database
      if (insertedImageError) {
        console.log("Error occor during image upload.");
        console.log(insertedImageError);
        return res
          .status(400)
          .json({ error: "Error occor during image upload." });
      } else {
        const { error: insertedImageUrlError } = await adminSupabase
          .from("services")
          .insert([{ imageUrl: `URL/${imageFileName}` }]) //***************ADD URL
          .eq("service_id", serviceId[0].service_id);
        if (insertedImageUrlError) {
          console.log("Error occor during inser image url.");
          console.log(insertedImageUrlError);

          return res
            .status(400)
            .json({ error: "Error occor during inser image url." });
        }
      }
    }
    //---------------------------------------------

    //3.ลูปเพื่อใส่ sub service ใน table  
    if (newService.subServices.length > 0) {
      const service_id = serviceId[0].service_id;
      const subInsert = [];
      for (let i = 0; i < newService.subServices.length; i++) {
        subInsert.push({
          service_id: Number(service_id),
          description: newService.subServices[i].description,
          unit: newService.subServices[i].unit,
          unit_price: newService.subServices[i].pricePerUnit,
          created_at: newService.created_at,
          updated_at: newService.updated_at,
        });
      }

      const { data: subInsertedData, error: subInsertedError } =
        await adminSupabase.from("sub_services").insert(subInsert).select();
      if (subInsertedError) {
        console.log(subInsertedError);
        return res.status(400).json({
          message: "Error occur during insert sub services.",
          detail: subInsertedError,
        });
      }
      if (subInsertedData) {
        return res.status(201).json({ message: "Insert data successfully." });
      }
    }
    return res.status(201).json({ message: "Insert data successfully." });
  } catch (error) {
    console.log("Unexpected error occur during data insert.");
    console.log(error);
    return res.status(500).json({
      message: "Unexpected error occur during data insert.",
    });
  }
}
