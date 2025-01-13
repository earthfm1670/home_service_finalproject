import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Home Service API Documentation",
      version: "1.0.0",
      description: "API documentation for your Home Service application",
    },
  },
  apis: ["./src/pages/api/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
