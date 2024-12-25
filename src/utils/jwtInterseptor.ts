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
 *
 * 4. create funtion for interceptor
 * - Pros: check if function work
 */

//Add a request interceptor
function jwtInterceptor() {
  axios.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      req.headers?.set(`Authorization`, `Bearer ${token}`);
    }
    return req;
  });

  // // Add a response interceptor | Can use to logout
  axios.interceptors.response.use(
    (res) => {
      console.log("Interceptor Work");
      console.log("************************************************");
      return res;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
export default jwtInterceptor;
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
