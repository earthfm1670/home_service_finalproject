export interface SubService {
  sub_service_id: number;
  id: number;
  description: string;
  unit: string;
  unit_price: number;
}

export interface Service {
  service_id: number;
  id: number;
  service_name: string;
  service_picture_url: string;
  sub_services: SubService[];
}
export interface Service {
  service_id: number;
  service_name: string;
  category: string;
  service_picture_url: string;
  service_pricing: string;
  is_recommended: boolean;
  is_popular: boolean;
  popularity_score: number;
}

export interface ServicesResponse {
  data: Service[] | null;
  error?: string;
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}
