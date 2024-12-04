import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import type { Service, ServicesResponse } from "@/types/service";

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
      const start = (page - 1) * limit;

      // Filter params
      const search = (query.search as string) || "";
      const category = query.category as string;
      const minPrice = parseFloat((query.min_price as string) || "NaN");
      const maxPrice = parseFloat((query.max_price as string) || "NaN");
      const isRecommended = query.is_recommended === "true";
      const isPopular = query.is_popular === "true";
      const sortBy = query.sortBy as "asc" | "desc" | undefined;

      // Fetch all popularity scores
      const { data: popularityScores, error: popularityScoreError } =
        await supabase.from("services").select("popularity_score");

      if (popularityScoreError) throw popularityScoreError;

      // Calculate average popularity score
      const avgPopularityScore =
        popularityScores.reduce(
          (sum, service) => sum + (service.popularity_score || 0),
          0
        ) / popularityScores.length;
      const recommendedThreshold = avgPopularityScore * 0.6;
      const popularThreshold = avgPopularityScore * 0.8;

      // Base query
      let dbQuery = supabase
        .from("services")
        .select(
          `
          service_id,
          service_name,
          category_id,
          categories!inner(category),
          service_picture_url,
          sub_services (
            unit_price
          ),
          popularity_score
        `,
          { count: "exact" }
        )
        // .order("service_id", { ascending: true })
        .range(start, start + limit - 1);

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

      const { data: services, error, count } = await dbQuery;

      if (error) throw error;

      // Process and filter services
      let processedServices: Service[] = (services || []).map(
        (service: any) => {
          const subServices = service.sub_services || [];
          const prices = subServices.map((s: any) => s.unit_price);

          let pricing = "";
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            const formatPrice = (price: number) => {
              return price >= 1000
                ? price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : price.toFixed(2);
            };
            pricing =
              minPrice === maxPrice
                ? `${formatPrice(minPrice)} ฿`
                : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} ฿`;
          }

          return {
            service_id: service.service_id,
            service_name: service.service_name,
            category: service.categories?.category || "",
            service_picture_url: service.service_picture_url,
            service_pricing: pricing,
            is_recommended: service.popularity_score >= recommendedThreshold,
            is_popular: service.popularity_score >= popularThreshold,
            popularity_score: service.popularity_score,
          };
        }
      );

      // Apply price filtering
      if (!isNaN(minPrice) || !isNaN(maxPrice)) {
        processedServices = processedServices.filter((service) => {
          const servicePrice = service.service_pricing.replace(/[^\d.-]/g, "");
          const [servicePriceMin, servicePriceMax] = servicePrice
            .split("-")
            .map(Number);

          if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            return (
              (servicePriceMin >= minPrice && servicePriceMin <= maxPrice) ||
              (servicePriceMax >= minPrice && servicePriceMax <= maxPrice) ||
              (servicePriceMin <= minPrice && servicePriceMax >= maxPrice)
            );
          } else if (!isNaN(minPrice)) {
            return servicePriceMax >= minPrice || servicePriceMin >= minPrice;
          } else if (!isNaN(maxPrice)) {
            return servicePriceMin <= maxPrice || servicePriceMax <= maxPrice;
          }
          return true;
        });
      }

      const filteredCount = processedServices.length;
      const totalPages = Math.ceil(filteredCount / limit);
      const response: ServicesResponse = {
        data: processedServices.slice(0, limit), // Apply limit to filtered results
        totalCount: filteredCount,
        currentPage: page,
        totalPages: totalPages,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({
        data: null,
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        error: "Internal Server Error",
      } as ServicesResponse);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
