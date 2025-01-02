import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

//---For creating instance---
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// export default axiosInstance;
