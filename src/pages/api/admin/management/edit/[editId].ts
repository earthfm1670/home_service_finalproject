import { NextApiRequest, NextApiResponse } from "next";
import { adminSupabase } from "@/utils/supabase";
import { connectionPool } from "@/utils/db";

interface SubSeviceBody {
  subId?: number;
  description: string;
  unit: string;
  pricePerUnit: number;
  updated_at?: string;
}

interface EditRequestBody {
  title: string;
  categoryId: number;
  image: string;
  subServices: SubSeviceBody[];
  updated_at?: string;
}

export default async function adminEdit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  // protect admin

  // access params id
  const { editId } = req.query;
  if (!editId) {
    return res.status(400).json({ error: "Srvice id is missing." });
  }
  const serviceIdFromClient: string = Array.isArray(editId)
    ? editId[0]
    : editId;

  if (isNaN(Number(serviceIdFromClient))) {
    return res
      .status(400)
      .json({ error: "Invalid service id format. Id must be number." });
  }
  const parsedId = parseInt(serviceIdFromClient, 10);

  //access req body
  const { title, categoryId, image, subServices }: EditRequestBody = req.body;

  try {
    // query edit
    //มีการ update 2 ครั้ง คือ
    // 1.update main
    //----------------------------------------------
    const { data: updatedMainService, error: updatedMainServiceError } =
      await adminSupabase
        .from("services")
        .update({
          service_name: title,
          category_id: categoryId,
          service_picture_url: image, //FIXME image
          updated_at: new Date().toISOString(),
        })
        .eq("service_id", parsedId);

    //   let mainQuery = `
    // UPDATE services
    // SET service_name=$1, category_id=$2, service_picture_url=$3, updated_at=$4
    // WHERE service_id=$5
    // `;
    //   const mainValues = [title, categoryId, image, new Date(), parsedId];

    //   const result = await connectionPool.query(mainQuery, mainValues);
    console.log(`PASS main query`);
    //----------------------------------------------

    // 2.update sub services
    for (const subService of subServices) {
      // --ถ้า sub มีไอดี update
      if (subService.subId) {
        const subQuery = `
      UPDATE sub_services
      SET description=$1, unit=$2, unit_price=$3, updated_at=$4
      WHERE id=$5
      `;
        const subValues = [
          subService.description,
          subService.unit,
          subService.pricePerUnit,
          new Date(),
          subService.subId,
        ];
        const result = await connectionPool.query(subQuery, subValues);
      } else if (!subService.subId) {
        // --ถ้า sub ไม่มีไอดี insert
        // console.log(`INSIDE if NOT subID`);
        const subQuery = `
      INSERT INTO sub_services (service_id, description, unit, unit_price, created_at)
      VALUES ($1,$2,$3,$4,$5)
      `;
        const subValues = [
          parsedId,
          subService.description,
          subService.unit,
          subService.pricePerUnit,
          new Date(),
        ];
        await connectionPool.query(subQuery, subValues);
      }
    }
    return res.status(201).json({ message: "Services update successfully" });
  } catch (error: any) {
    console.log(
      `Internal error occur during update, see detail: ${error.message}`
    );
    return res
      .status(500)
      .json({ error: `Internal server error during update data.` });
  }
}
