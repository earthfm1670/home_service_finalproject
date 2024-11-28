import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

interface Service {
  service_id: number;
  service_name: string;
  category_id: number;
  service_picture_url: string;
  service_pricing: string;
}

type ServicesResponse = {
  data: Service[] | null;
  error?: string;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
};

export default async function getAllServices(
  req: NextApiRequest,
  res: NextApiResponse<ServicesResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ data: null, error: "Method Not Allowed" });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const start = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from("services")
      .select(
        "service_id, service_name, category_id, service_picture_url, service_pricing",
        { count: "exact" }
      )
      .range(start, start + limit - 1);

    if (error) {
      console.error("Error fetching services:", error);
      return res
        .status(500)
        .json({ data: null, error: "An unexpected error occurred" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ data: null, error: "No services found" });
    }

    return res.status(200).json({
      data: data as Service[],
      totalCount: count,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json({ data: null, error: "An unexpected error occurred" });
  }
}
