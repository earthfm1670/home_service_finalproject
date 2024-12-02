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
