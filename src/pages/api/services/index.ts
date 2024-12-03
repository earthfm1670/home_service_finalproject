import { supabase } from "@/utils/supabase";
import { NextApiRequest, NextApiResponse } from "next";

interface Service {
  service_id: number;
  service_name: string;
  category: string;
  service_picture_url: string;
  service_pricing: string;
  is_recommended: boolean;
  is_popular: boolean;
  popularity_score: number;
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

    // Fetch data from Supabase
    const { data, error, count } = await supabase
      .from("services")
      .select(
        `
          service_id, 
          service_name, 
          categories(category), 
          service_picture_url, 
          service_pricing,
          popularity_score
        `,
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

    // คำนวณค่า is_recommended และ is_popular ในโค้ด
    const formattedData: Service[] = data.map((item) => {
      const isRecommended = item.popularity_score >= 60; // Threshold for "recommended"
      const isPopular = item.popularity_score >= 80; // Threshold for "popular"

      return {
        service_id: item.service_id,
        service_name: item.service_name,
        category:
          item.categories?.length > 0 ? item.categories[0].category : "",
        service_picture_url: item.service_picture_url,
        service_pricing: item.service_pricing,
        is_recommended: isRecommended, // คำนวณจาก popularity_score
        is_popular: isPopular, // คำนวณจาก popularity_score
        popularity_score: item.popularity_score,
      };
    });

    return res.status(200).json({
      data: formattedData,
      totalCount: count ?? undefined,
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
