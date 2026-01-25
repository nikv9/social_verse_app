import axios from "axios";
import { baseUrl } from "../config/api_config";
import Cookies from "js-cookie";

const apiInstance = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
});

// API request interceptor → attach Authorization token
apiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("tokenId");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API response interceptor
apiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // Handle response error here
    // let message = error?.response?.data?.message || error?.response?.data;
    let message = error?.response?.data;
    return Promise.reject(message);
  }
);

export default apiInstance;
