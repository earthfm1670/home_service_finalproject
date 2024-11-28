import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

interface Service {
  service_id: number;
  service_name: string;
  category_id: number;
  service_picture_url: string;
  service_pricing: string;
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
        "service_id, service_name, category_id, service_picture_url, service_pricing"
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

    return res.status(200).json({ data: data as Service });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ data: null, error: "An unexpected error occurred" });
  }
}
