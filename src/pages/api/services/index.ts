import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import type { Service, ServicesResponse } from "@/types/service";

const formatPrice = (price: number): string => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         service_id:
 *           type: integer
 *         service_name:
 *           type: string
 *         category:
 *           type: string
 *         service_picture_url:
 *           type: string
 *         service_pricing:
 *           type: string
 *         minPrice:
 *           type: number
 *         maxPrice:
 *           type: number
 *         total_usage:
 *           type: integer
 *         promotionsAndOffers:
 *           type: boolean
 *         sub_services:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               sub_service_id:
 *                 type: integer
 *               id:
 *                 type: integer
 *               description:
 *                 type: string
 *               unit:
 *                 type: string
 *               unit_price:
 *                 type: number
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     ServicesResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 *         allServiceNames:
 *           type: array
 *           items:
 *             type: string
 *         totalCount:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: null
 *         totalCount:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         error:
 *           type: string
 *
 * /api/services:
 *   get:
 *     summary: Get services with filtering and pagination
 *     description: Retrieves services based on various filters and pagination parameters
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering services
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [asc, desc, popular, recommended]
 *         description: Sorting option
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicesResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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

      // Base query
      let dbQuery = supabase.from("services").select(
        `
        service_id,
        service_name,
        category_id,
        categories!inner(category),
        service_picture_url,
        sub_services(unit_price)
      `,
        { count: "exact" }
      );

      // Fetch usage counts for each service
      const { data: subServicesData, error: subServicesDataError } =
        await supabase
          .from("sub_services")
          .select("service_id, unit_price, usage_count, promotions_and_offers");
      if (subServicesDataError) throw subServicesDataError;

      // category filters
      if (category != "บริการทั้งหมด") {
        dbQuery = dbQuery.eq("categories.category", category);
      } else {
        dbQuery = dbQuery.not("categories.category", "is", null);
      }

      const { data: services, error } = await dbQuery;

      if (error) throw error;

      // Array service_name from services
      const serviceName = services.map((service) => service.service_name);

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

      let processedServices: Service[] = (services || []).map(
        (service: {
          service_id: number;
          service_name: string;
          category_id: number;
          categories: { category: string } | { category: string }[];
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
            sub_services: service.sub_services.map((subService, index) => ({
              sub_service_id: index + 1,
              id: index + 1,
              description: `Sub-service ${index + 1}`,
              unit: "unit",
              unit_price: subService.unit_price,
            })),
            id: service.service_id,
            title: service.service_name,
          };
        }
      );

      //  minPrice & maxPrice filters
      if (minPrice || (maxPrice && maxPrice != 0)) {
        processedServices = processedServices.filter(
          (service) =>
            Number(service.minPrice) >= Number(minPrice) &&
            Number(service.maxPrice) <= Number(maxPrice)
        );
      }

      // search filters
      if (search) {
        processedServices = processedServices.filter((service) =>
          service.service_name.toLowerCase().includes(search.toLowerCase())
        );
      }

      //  sort_By filters
      if (sortBy === "recommended") {
        processedServices = processedServices.filter(
          (service) => service.promotionsAndOffers
        );
        processedServices.sort((a, b) => a.service_id - b.service_id);
      } else if (sortBy === "popular") {
        processedServices.sort((a, b) => b.total_usage - a.total_usage);
      } else if (sortBy === "asc" || sortBy === "desc") {
        processedServices.sort((a, b) =>
          sortBy === "asc"
            ? a.service_name.localeCompare(b.service_name, "en")
            : b.service_name.localeCompare(a.service_name, "en")
        );
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
        allServiceNames: serviceName,
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
