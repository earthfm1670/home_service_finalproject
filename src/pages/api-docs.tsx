import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

// Define a type for the Swagger specification
type SwaggerSpec = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
};

type ApiDocsProps = {
  spec: SwaggerSpec;
};

const SwaggerUI = dynamic<ApiDocsProps>(
  () =>
    import("swagger-ui-react") as Promise<{
      default: React.ComponentType<ApiDocsProps>;
    }>,
  { ssr: false }
);

export default function ApiDocs({ spec }: ApiDocsProps) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps<ApiDocsProps> = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/api/docs`);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch API docs: ${res.status} ${res.statusText}`
      );
    }

    const spec: SwaggerSpec = await res.json();
    return { props: { spec }, revalidate: 3600 };
  } catch (error) {
    console.error("Error fetching API docs:", error);
    return {
      props: {
        spec: {
          openapi: "3.0.0",
          info: {
            title: "API Documentation Unavailable",
            version: "1.0.0",
            description: "There was an error loading the API documentation.",
          },
          paths: {},
        },
      },
    };
  }
};
