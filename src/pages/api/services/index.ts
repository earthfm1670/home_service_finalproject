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

      const sortBy = query.sort_by as
        | "asc"
        | "desc"
        | "popular"
        | "recommended"
        | undefined;

      // Fetch usage counts for each service
      const { data: subServicesData, error: subServicesDataError } =
        await supabase
          .from("sub_services")
          .select("service_id, unit_price, usage_count, promotions_and_offers");
      if (subServicesDataError) throw subServicesDataError;

      // Base query
      let dbQuery = supabase.from("services").select(
        `
        service_id,
        service_name,
        category_id,
        categories!inner(category),
        service_picture_url,
        sub_services(unit_price),
        popularity_score
      `,
        { count: "exact" }
      );

      // Apply filters
      if (search) {
        dbQuery = dbQuery.ilike("service_name", `%${search}%`);
      }

      if (category != "บริการทั้งหมด") {
        dbQuery = dbQuery.eq("categories.category", category);
      } else {
        dbQuery = dbQuery.not("categories.category", "is", null);
      }

      if (sortBy) {
        if (sortBy === "popular") {
          console.log("popular logic");
        } else if (sortBy === "recommend") {
          console.log("recommend logic");
        }
        dbQuery = dbQuery.order("service_name", {
          ascending: sortBy === "asc",
        });
      }

      const { data: services, error } = await dbQuery;

      if (error) throw error;

      // Calculate total_usage from sub_services
      const serviceUsageMap = subServicesData.reduce((map, subService) => {
        if (!map[subService.service_id]) {
          map[subService.service_id] = 0;
        }
        map[subService.service_id] += subService.usage_count;
        return map;
      }, {} as Record<number, number>);

      // Calculate promotions_and_offers from sub_services
      const promotionsMap = subServicesData.reduce((map, subService) => {
        if (subService.promotions_and_offers) {
          map[subService.service_id] = true;
        }
        return map;
      }, {} as Record<number, boolean>);

      // Process and filter services
      let processedServices: Service[] = (services || []).map(
        (service: {
          service_id: number;
          service_name: string;
          category_id: number;
          categories: { category: string } | { category: string }[]; // รองรับ object หรือ array
          service_picture_url: string;
          sub_services: { unit_price: number }[];
        }) => {
          const subServices = service.sub_services || [];
          const prices = subServices
            .map((s) => s.unit_price)
            .filter((price) => !isNaN(price));
          const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
          const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

          let pricing = "";
          if (prices.length > 0) {
            pricing =
              minPrice === maxPrice
                ? `ค่าบริการประมาณ ${formatPrice(minPrice)} ฿`
                : `ค่าบริการประมาณ ${formatPrice(minPrice)} - ${formatPrice(
                    maxPrice
                  )} ฿`;
          } else {
            pricing = "ราคายังไม่ระบุ";
          }

          // ตรวจสอบว่า categories เป็น array หรือ object เดี่ยว

          const category =
            Array.isArray(service.categories) && service.categories.length > 0
              ? service.categories[0].category
              : "category" in service.categories
              ? service.categories.category
              : "ไม่มีหมวดหมู่";

          return {
            service_id: service.service_id,
            service_name: service.service_name,
            category,
            service_picture_url: service.service_picture_url,
            service_pricing: pricing,
            minPrice,
            maxPrice,
            total_usage: serviceUsageMap[service.service_id] || 0,
            promotionsAndOffers: promotionsMap[service.service_id] || false,
          };
        }
      );

      if (minPrice > 0 || maxPrice < Infinity) {
        processedServices = processedServices.filter((service) => {
          const serviceMinPrice = service.minPrice;
          const serviceMaxPrice = service.maxPrice;

          const minPriceCondition =
            minPrice == 0 || serviceMinPrice <= maxPrice;
          const maxPriceCondition =
            maxPrice >= Infinity || serviceMaxPrice >= minPrice;

          return minPriceCondition && maxPriceCondition;
        });
      }

      // // เรียงลำดับตาม service_id เมื่อไม่มีการใช้งาน sort_by asc & desc
      // if (sortBy != "asc" && sortBy != "desc" && sortBy != "popular") {
      //   processedServices.sort((a, b) => a.service_id - b.service_id);
      // }
      // // Sort by popularity (total_usage) if sortBy is popular
      // if (sortBy === "popular") {
      //   processedServices.sort((a, b) => b.total_usage - a.total_usage);
      // }

      // กรองข้อมูลตาม promotions_and_offers เมื่อ sort_by = "recommend"
      if (sortBy === "recommended") {
        processedServices = processedServices.filter(
          (service) => service.promotionsAndOffers
        );
        processedServices.sort((a, b) => a.service_id - b.service_id);
      } else if (sortBy === "popular") {
        processedServices.sort((a, b) => b.total_usage - a.total_usage);
      } else {
        processedServices.sort((a, b) => a.service_id - b.service_id);
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
