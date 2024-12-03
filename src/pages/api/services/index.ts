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

interface DatabaseService {
  service_id: number;
  service_name: string;
  categories: {
    category: string;
  }[];
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
    const sortBy = (req.query.sortBy as string) || "default";

    let query = supabase.from("services").select(
      `
        service_id, 
        service_name, 
        categories(category), 
        service_picture_url, 
        service_pricing,
        is_recommended,
        is_popular,
        popularity_score
      `,
      { count: "exact" }
    );

    // Apply filters and sorting based on sortBy parameter
    if (sortBy === "recommended") {
      query = query.eq("is_recommended", true);
    } else if (sortBy === "popular") {
      query = query.eq("is_popular", true);
    }

    // Apply ordering
    if (sortBy === "asc" || sortBy === "recommended") {
      query = query.order("service_name", { ascending: true });
    } else if (sortBy === "desc") {
      query = query.order("service_name", { ascending: false });
    } else if (sortBy === "popular") {
      query = query.order("popularity_score", { ascending: false });
    } else {
      // Default ordering
      query = query.order("service_id");
    }

    // Apply pagination
    const { data, error, count } = await query.range(start, start + limit - 1);

    if (error) {
      console.error("Error fetching services:", error);
      return res
        .status(500)
        .json({ data: null, error: "An unexpected error occurred" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ data: null, error: "No services found" });
    }

    const formattedData: Service[] = (data as DatabaseService[]).map((item) => {
      let category = "";
      if (Array.isArray(item.categories) && item.categories.length > 0) {
        category = item.categories[0].category || "";
      } else if (
        typeof item.categories === "object" &&
        item.categories !== null &&
        "category" in item.categories
      ) {
        category = (item.categories as { category: string }).category || "";
      }

      return {
        service_id: item.service_id,
        service_name: item.service_name,
        category: category,
        service_picture_url: item.service_picture_url,
        service_pricing: item.service_pricing,
        is_recommended: item.is_recommended,
        is_popular: item.is_popular,
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
