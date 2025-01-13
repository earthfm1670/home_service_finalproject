import axios, { InternalAxiosRequestConfig } from "axios";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
//Add a request interceptor
function jwtInterceptor() {
  axios.interceptors.request.use(
    (req: InternalAxiosRequestConfig) => {
      //console.log("FROM AXIOS INTERCEPTOR");
      const token = window.localStorage.getItem("token");
      //console.log("Form Interceptor: ", token);
      if (token) {
        req.headers?.set(`Authorization`, `Bearer ${token}`);
      }
      return req;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // // Add a response interceptor | Can use to logout
  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
export default jwtInterceptor;
