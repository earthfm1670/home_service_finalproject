import axios, { InternalAxiosRequestConfig } from "axios";

//Add a request interceptor
axios.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      //config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },

  function (error) {
    // Do something with request error
    error = { ...error, MESSAGE: "error from interceptor" };
    return Promise.reject(error);
  }
);

// // Add a response interceptor | Can use to logout
axios.interceptors.response.use(
  function (response) {
    console.log("Interceptor Work");
    console.log("************************************************");
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("Interceptor Error");
    console.log("************************************************");
    return Promise.reject(error);
  }
);

export default axios;
//*---TechUp-------------------------------------- */
// axios.interceptors.request.use((req) => {
//   const token = Boolean(window.localStorage.getItem("token"));
//   if (token) {
//     req.headers = {
//       ...req.headers,
//       Authorization: `Bearer ${token}`,
//     };
//     return req;
//   }
// });
