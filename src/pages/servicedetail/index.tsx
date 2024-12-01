import { GetServerSideProps, NextPage } from "next";
import MyCard from "../../components/card";

interface SubService {
  sub_service_id: number;
  description: string;
  unit: string;
  unit_price: number;
}

interface Service {
  service_id: number;
  service_name: string;
  service_picture_url: string;
  sub_services: SubService[];
}

interface ServiceDetailProps {
  service: Service | null;
}

const ServiceDetailPage: NextPage<ServiceDetailProps> = ({ service }) => {
  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{service.service_name}</h1>
      <img
        src={service.service_picture_url}
        alt={service.service_name}
        className="w-full max-w-md mb-4 rounded-lg"
      />
      <h2 className="text-xl font-semibold mb-2">Sub Services:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {service.sub_services.map((subService) => (
          <MyCard
            key={subService.sub_service_id}
            title={subService.description}
            description={`Unit: ${subService.unit} - Price: ฿${subService.unit_price}`}
            imageUrl={service.service_picture_url} // Adjust this if different per sub-service
          />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  try {
    const res = await fetch(`http://localhost:3000/api/services/${id}`);
    const data = await res.json();

    if (!data.data) {
      return {
        props: {
          service: null,
        },
      };
    }

    return {
      props: {
        service: data.data,
      },
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    return {
      props: {
        service: null,
      },
    };
  }
};

export default ServiceDetailPage;
