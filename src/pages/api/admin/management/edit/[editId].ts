import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

export default async function adminEdit(req: NextApiRequest, res: NextApiResponse) {
  // protect admin

  // access body
  const serviceIdFromClient = req.query;
  // query edit

  try {
    //finally begin transaction
    const { data, error } = await connectionPool.query(
      `
    TRANSACTION BEGIN
    UPDATE services 
    SET bla bla bla 
    VALUES $1,$1,$1,$1,$1
    UPSERT INTO sub_services (bla bla bla)
    VALUES ($1,$1,$1,$1,$1)
    COMMIT
    `,
      []
    );
    if (error) {
      console.log(`Update error, see detail: ${error.message}`);
      return res.status(400).json({ error: "Data invalid format" });
    }
    console.log(data);
    return res.status(200).json({ message: "Services update successfully" });
  } catch (error: unknown) {
    console.log(
      `Internal error during update data, see detail: ${error.message}`
    );
    return res.status(500).json({
      error: "Internal error during update data. Fail to update data",
    });
  }
}
