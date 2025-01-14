declare module 'swagger-ui-react' {
  import React from 'react';

  export interface SwaggerUIProps {
    spec?: any; // Change this from 'object' to 'any'
    url?: string;
    [key: string]: any;
  }

  const SwaggerUI: React.ComponentType<SwaggerUIProps>;

  export default SwaggerUI;
}
