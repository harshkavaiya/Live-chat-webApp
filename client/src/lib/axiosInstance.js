import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://1szcr99d-4000.inc1.devtunnels.ms",
  withCredentials: true,
});

export default axiosInstance;
