import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

interface Service {
  service_id: number;
  service_name: string;
  service_picture_url: string;
  sub_services: {
    sub_service_id: number;
    description: string;
    unit: string;
    unit_price: number;
  }[];
}

interface DatabaseService {
  service_id: number;
  service_name: string;
  service_picture_url: string;
  sub_services: {
    service_id: number;
    description: string;
    unit: string;
    unit_price: number;
  }[];
}

type ServiceResponse = {
  data: Service | null;
  error?: string;
};

export default async function getServiceById(
  req: NextApiRequest,
  res: NextApiResponse<ServiceResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ data: null, error: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    const { data, error } = await supabase
      .from("services")
      .select(
        `
        service_id,
        service_name,
        service_picture_url,
        sub_services (
          service_id,
          description,
          unit,
          unit_price
        )
      `
      )
      .eq("service_id", id)
      .single();

    if (error) {
      console.error("Error fetching service:", error);
      return res
        .status(500)
        .json({ data: null, error: "An unexpected error occurred" });
    }

    if (!data) {
      return res.status(404).json({ data: null, error: "Service not found" });
    }

    const databaseService = data as DatabaseService;

    const formattedService: Service = {
      service_id: databaseService.service_id,
      service_name: databaseService.service_name,
      service_picture_url: databaseService.service_picture_url,
      sub_services: databaseService.sub_services.map((sub) => ({
        sub_service_id: sub.service_id,
        description: sub.description,
        unit: sub.unit,
        unit_price: sub.unit_price,
      })),
    };

    return res.status(200).json({ data: formattedService });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ data: null, error: "An unexpected error occurred" });
  }
}
