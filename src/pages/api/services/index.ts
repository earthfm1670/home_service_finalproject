import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import type { Service, ServicesResponse } from "@/types/service";

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { query } = req;

      // Pagination params
      const page = parseInt((query.page as string) || "1");
      const limit = parseInt((query.limit as string) || "13");

      // Filter params
      const search = (query.search as string) || "";
      const category = query.category as string;
      const minPrice = parseFloat((query.min_price as string) || "0");
      const maxPrice = parseFloat((query.max_price as string) || "Infinity");
      const isRecommended = query.is_recommended === "true";
      const isPopular = query.is_popular === "true";
      const sortBy = query.sortBy as "asc" | "desc" | undefined;

      // Fetch all popularity scores
      const { data: popularityScores, error: popularityScoreError } =
        await supabase.from("services").select("popularity_score");

      if (popularityScoreError) throw popularityScoreError;

      const avgPopularityScore =
        popularityScores.reduce((sum, service) => {
          const score = parseFloat(service.popularity_score);
          return sum + (isNaN(score) ? 0 : score);
        }, 0) / popularityScores.length;
      const recommendedThreshold = avgPopularityScore * 0.4;
      const popularThreshold = avgPopularityScore * 0.9;

      // Base query
      let dbQuery = supabase.from("services").select(
        `
          service_id,
          service_name,
          category_id,
          categories (
            category
          ),
          service_picture_url,
          sub_services (
            unit_price
          ),
          popularity_score
        `,
        { count: "exact" }
      );

      // Apply filters
      if (search) {
        dbQuery = dbQuery.ilike("service_name", `%${search}%`);
      }

      if (category) {
        dbQuery = dbQuery.ilike("categories.category", `%${category}%`);
      }

      if (isRecommended) {
        dbQuery = dbQuery.gte("popularity_score", recommendedThreshold);
      }

      if (isPopular) {
        dbQuery = dbQuery.gte("popularity_score", popularThreshold);
      }

      if (sortBy) {
        dbQuery = dbQuery.order("service_name", {
          ascending: sortBy === "asc",
        });
      }

      const { data: services, error } = await dbQuery;

      if (error) throw error;

      // Process and filter services
      let processedServices: Service[] = (services || []).map(
        (service: {
          service_id: number;
          service_name: string;
          category_id: number;
          categories: { category: string };
          service_picture_url: string;
          sub_services: { unit_price: number }[];
          popularity_score: string | number | null;
        }) => {
          const subServices = service.sub_services || [];
          const prices = subServices
            .map((s) => s.unit_price)
            .filter((price) => !isNaN(price));
          const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
          const popularityScore =
            service.popularity_score != null &&
            !isNaN(parseFloat(service.popularity_score.toString()))
              ? parseFloat(service.popularity_score.toString())
              : 0;

          let pricing = "";
          if (prices.length > 0) {
            pricing =
              minPrice === maxPrice
                ? `${formatPrice(minPrice)} ฿`
                : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} ฿`;
          } else {
            pricing = "ราคายังไม่ระบุ";
          }

          return {
            service_id: service.service_id,
            service_name: service.service_name,
            category: service.categories?.category || "",
            service_picture_url: service.service_picture_url,
            service_pricing: pricing,
            minPrice,
            maxPrice,
            is_recommended: popularityScore >= recommendedThreshold,
            is_popular: popularityScore >= popularThreshold,
            popularity_score: popularityScore,
          };
        }
      );

      // เรียงลำดับตาม service_id
      processedServices.sort((a, b) => a.service_id - b.service_id);

      // Apply filters (if needed)
      if (minPrice > 0 || maxPrice < Infinity) {
        processedServices = processedServices.filter(
          (service) =>
            (minPrice > 0 ? service.minPrice <= minPrice : true) &&
            (maxPrice < Infinity ? service.maxPrice <= maxPrice : true)
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedServices = processedServices.slice(startIndex, endIndex);

      const totalCount = processedServices.length;
      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        data: paginatedServices,
        totalCount,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        data: null,
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        error: "Internal Server Error: " + (error as Error).message,
      } as ServicesResponse);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
