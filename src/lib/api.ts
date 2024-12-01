import { getService, Service } from "@/lib/api";
import axios, { AxiosError } from "axios";

// Define the types for your service data
export interface SubService {
  sub_service_id: number;
  description: string;
  unit: string;
  unit_price: number;
}

export interface Service {
  service_id: number;
  service_name: string;
  description: string;
  sub_services: SubService[];
}

interface ServiceResponse {
  data: Service | null;
  error?: string;
}

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
});

export async function getService(id: string): Promise<ServiceResponse> {
  try {
    const response = await api.get<Service>(`/services/${id}`);
    return { data: response.data };
  } catch (error) {
    console.error("Error fetching service:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        data: null,
        error:
          axiosError.response?.data?.message ||
          "An error occurred while fetching the service.",
      };
    }
    return { data: null, error: "An unexpected error occurred." };
  }
}

// You can add more API functions here as needed
// For example:
// export async function getAllServices(): Promise<ServiceResponse[]> { ... }
// export async function createBooking(bookingData: BookingData): Promise<BookingResponse> { ... }
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.params as { id: string };
  const serviceResponse = await getService(id);

  if (!serviceResponse.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { initialService: serviceResponse.data },
  };
}
interface ServiceDetailProps {
  initialService: Service;
}

export default function ServiceDetail({ initialService }: ServiceDetailProps) {
  // ... rest of your component code
}
