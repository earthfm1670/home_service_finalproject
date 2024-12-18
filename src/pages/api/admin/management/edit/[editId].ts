import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { adminSupabase } from "@/utils/supabase";
import { connectionPool } from "@/utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function adminEdit(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    // Parse the form data using formidable
    const fields = await new Promise<formidable.Fields>((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(fields);
        }
      });
    });

    // ตรวจสอบว่า fields.editId มีค่าและไม่เป็น undefined
    const editId = Array.isArray(fields.editId) ? fields.editId[0] : fields.editId;
    if (!editId) {
      return res.status(400).json({ error: "Service id is missing." });
    }

    const serviceIdFromClient: string = editId;

    if (isNaN(Number(serviceIdFromClient))) {
      return res
        .status(400)
        .json({ error: "Invalid service id format. Id must be number." });
    }

    const parsedId = parseInt(serviceIdFromClient, 10);

    // Access req body (fields)
    const { title, categoryId, image, subServices }: EditRequestBody = req.body;

    // Proceed with your existing logic...
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

    // Update sub services logic...
    for (const subService of subServices) {
      // Update or insert sub services based on subId
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
        await connectionPool.query(subQuery, subValues);
      } else if (!subService.subId) {
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

    return res.status(200).json({ message: "Service updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Internal error occurred during update: ${error.message}`);
    } else {
      console.log('An unknown error occurred');
    }
    return res.status(500).json({ error: "Internal server error." });
  }
}
