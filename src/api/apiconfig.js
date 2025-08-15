import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const appAxios = axios.create({
  baseURL: "http://10.246.66.48:8000",
});

appAxios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

appAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
      // Optionally redirect to login screen or clear token
    }

    // ✅ Always return or throw the error so your fetchVideos can catch it
    return Promise.reject(error);
  }
);
