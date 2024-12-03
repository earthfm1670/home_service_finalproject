import { NextApiRequest, NextApiResponse } from "next";
import { connectionPool } from "@/utils/db";

// interface QueryParams {
//   deleteSubId: string | string[];
// }

export default async function adminDelete(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  //access params
  const { deleteSubId } = req.query;
  if (!deleteSubId) {
    return res.status(400).json({ error: "Service id is missing " });
  }
  //validate params id
  const subSevicesIdFromClient: string = Array.isArray(deleteSubId)
    ? deleteSubId[0]
    : deleteSubId;

  if (isNaN(Number(subSevicesIdFromClient))) {
    return res
      .status(400)
      .json({ error: "Invalid service id format. Id must be number." });
  }

  const parsedId = parseInt(subSevicesIdFromClient, 10);

  try {
    //query for delete
    const result = await connectionPool.query(
      `DELETE FROM sub_services WHERE id=$1`,
      [parsedId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Service not found." });
    }
    //return
    return res.status(201).json({ message: "Delete service successfully." });
  } catch (error) {
    console.log(`error during delete. see detail: ${error}`);
    return res.status(500).json({ error: "Internal server error." });
  }
}
