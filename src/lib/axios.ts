import { useUserStore } from "@/store/userStore";
import axios from "axios";
import { AxiosError } from "axios";

export type ErrorResponse = {
  logout?: boolean;
  message?: string;
  status?: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if ((status === 401 || status === 403) && data?.logout === true) {
      console.log(data);

      console.log("Logout triggered by API response");
      try {
        // Call the backend logout endpoint
        await api.post("/user/logout");
      } catch (logoutError) {
        console.error("Failed to logout on server:", logoutError);
      } finally {
        useUserStore.getState().logoutUser();
      }
    }

    return Promise.reject(error);
  },
);

export { api };
