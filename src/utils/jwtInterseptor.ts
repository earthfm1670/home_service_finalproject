import axios, { InternalAxiosRequestConfig } from "axios";
//Solution
/**
 * 1. Create new axios interceptor
 * - Pros: Solid solution for current practics (jwt token, verify token per req, etc.)
 * - Cons: Have to change all axios across entire wep app.
 * 
 * 2. Verify token via cookies
 * - Pros: Fast and seem to be potential solution for current practics
 * - Cons: Have to research agin, might have to change auth system (token storing? only?)
 * 
 * 3. High Order Function
 * - Pros: Have solid example, can discus with other group
 * - Cons: New practics, might have to change auth system (unknow)
 */

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
