import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

interface SubServiceFromAdmin {
  description: string;
  unit: string;
  pricePerUnit: number;
}

interface PostRequestBody {
  title: string;
  category_id: number;
  image: string;
  subService: Array<SubServiceFromAdmin>; //[{}, {}, {}];
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
    const serviceQuery: string = `
      INSERT INTO services (service_name, category_id)
      VALUES ($1,$2)`;
    const serviceValues: (string | number)[] = [
      newServices.title,
      newServices.category_id,
    ];
    await connectionPool.query(serviceQuery, serviceValues);

    //2.ดึง service_id ออกมา
    const servicerIdAfterCreate = await connectionPool.query(
      `
        SELECT service_id FROM services WHERE service_name=$1`,
      [newServices.title]
    );

    //3.ลูปเพื่อใส่ sub service ใน table
    for (let i = 0; i < newServices.subService.length; i++) {
      await connectionPool.query(
        `
    INSERT INTO sub_services (service_id ,description, unit, unit_price, created_at, update_at)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
        [
          Number(servicerIdAfterCreate.rows[0].service_id),
          newServices.subService[i].description,
          newServices.subService[i].unit,
          newServices.subService[i].pricePerUnit,
          newServices.created_at,
          newServices.updated_at,
        ]
      );
    }
    // console.log(newServices.title);
    console.log(servicerIdAfterCreate);

    return res.status(201).json({ message: "Insert data successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}

/** DEMO
 *   //3.ลูปเพื่อใส่ sub service ใน table
    for (let i = 0; i < newServices.subService.length; i++) {
      await connectionPool.query(
        `
        INSERT INTO sub_services (service_id ,description, unit, unit_price, created_at, update_at)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          servicerIdAfterCreate,
          newServices.subService[i].description,
          newServices.subService[i].unit,
          newServices.subService[i].pricePerUnit,
          newServices.created_at,
          newServices.updated_at,
        ]
      );
    }
 */

// const subQuery = `
// INSERT INTO sub_services (service_id ,description, unit, unit_price, created_at, update_at)
// VALUES ($1,$2,$3,$4,$5,$6)
// `;
//   const subValues = [
//     Number(servicerIdAfterCreate.rows[0].service_id),
//     newServices.subService[0].description,
//     newServices.subService[0].unit,
//     newServices.subService[0].pricePerUnit,
//     newServices.created_at,
//     newServices.updated_at,
//   ];
