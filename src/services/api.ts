import axios from "axios";
import * as SecureStore from "expo-secure-store";
import store from "../store/store";
import { logout } from "../store/slices/authSlice";

const API_URL = "https://directus-production-9104.up.railway.app";

export const api = axios.create({
  baseURL: `${API_URL}/items`,
  headers: {
    "Content-Type": "application/json",
  },
});
export const authApi = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("access_token");
      delete api.defaults.headers.Authorization;
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
