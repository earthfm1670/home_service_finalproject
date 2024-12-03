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

interface RawServiceData {
  service_id: number;
  service_name: string;
  categories: {
    category: string;
  }[];
  service_picture_url: string;
  service_pricing: string;
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
    const category = req.query.category as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;

    // สร้าง query
    let query = supabase.from("services").select(
      `
          service_id, 
          service_name, 
          categories!inner(category),
          service_picture_url, 
          service_pricing,
          popularity_score
        `,
      { count: "exact" }
    );

    // ถ้ามีการระบุ category ให้เพิ่มเงื่อนไขในการค้นหา
    if (category) {
      query = query.eq("categories.category", category);
    }
    // เพิ่มการเรียงลำดับตาม service_name
    if (sortBy === "asc" || sortBy === "desc") {
      query = query.order("service_name", { ascending: sortBy === "asc" });
    }

    // ดึงข้อมูลจาก Supabase
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

    // คำนวณค่า is_recommended และ is_popular ในโค้ด
    const formattedData: Service[] = (data as RawServiceData[]).map((item) => {
      const isRecommended = item.popularity_score >= 60;
      const isPopular = item.popularity_score >= 80;

      let category = "";
      if (Array.isArray(item.categories) && item.categories.length > 0) {
        category = item.categories[0].category;
      } else if (
        typeof item.categories === "object" &&
        item.categories !== null &&
        "category" in item.categories
      ) {
        category = (item.categories as { category: string }).category;
      }

      return {
        service_id: item.service_id,
        service_name: item.service_name,
        category: category,
        service_picture_url: item.service_picture_url,
        service_pricing: item.service_pricing,
        is_recommended: isRecommended,
        is_popular: isPopular,
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
