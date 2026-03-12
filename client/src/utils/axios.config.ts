import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`${config.method?.toUpperCase()} to: ${config.url}`);
    return config;
  },
  (error) => {
    console.log("Request error:", error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("API Error:", error.message);

    if (!error.response) {
      console.log("Network Error - Server is not running");
      return Promise.reject(
        new Error("Cannot connect to server. Please try again later."),
      );
    }

    console.log("Status Code:", error.response.status);

    if (error.response.status === 401) {
      window.location.href = "/login";
      return Promise.reject( new Error("Session Expired"));
    }

    const errorMessage =
      error.response.data?.error ||
      error.response.data?.message ||
      "Something went wrong";

    return Promise.reject(new Error(errorMessage));
  },
);

export default axiosInstance;
