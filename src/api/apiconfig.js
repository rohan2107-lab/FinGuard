import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create axios instance with base configuration
export const appAxios = axios.create({
  baseURL: "http://172.23.247.48:8000/",
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
appAxios.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
appAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - token may be expired');
      
      // Clear the expired token
      try {
        await AsyncStorage.removeItem('authToken');
      } catch (storageError) {
        console.error('Error clearing auth token:', storageError);
      }
      
      // Optional: You can add navigation logic here
      // For example, if you have access to navigation:
      // NavigationService.navigate('Login');
    }
    
    // Always reject the error so components can handle it
    return Promise.reject(error);
  }
);

export default appAxios;