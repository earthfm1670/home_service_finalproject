import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Home Service API Documentation",
      version: "1.0.0",
      description: `
Welcome to the Home Service API Documentation. This API provides endpoints for managing various aspects of a home service application, including services, bookings, users, and more.

Getting Started:
1. Authentication: Most endpoints require authentication. Use the /api/auth endpoints to obtain and manage access tokens.
2. Explore Services: Use the /api/services endpoints to browse and search for available services.
3. Make Bookings: Once authenticated, use the /api/bookings endpoints to schedule and manage service appointments.
4. User Profile: Manage user information using the /api/users endpoints.

For detailed information on each endpoint, including required parameters and response formats, please refer to the individual endpoint documentation below.

Note: Ensure you have the necessary permissions before accessing admin-only endpoints.
If you encounter any issues or have questions, please contact our support team at support@homeservice.com.
      `,
    },
    servers: [
      {
        description: "Production server",
        url: "https://home-service-finalproject.vercel.app/",
      },
      {
        description: "Local development server",
        url: "http://localhost:3000",
      },
    ],
  },

  apis: [
    "./src/pages/api/**/*.ts",
    "./pages/api/**/*.ts",
    "./src/pages/api/**/*.js", 
    "./pages/api/**/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
