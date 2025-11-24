import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";

import { API_ROUTES, API_URL } from "../configs/api-routes.config";
import { ADMIN_AUTH_ROUTES } from "../configs/routes.config";

interface RetryConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

class ApiClient {
  private readonly axiosInstance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });
    this.axiosInstance.interceptors.response.use(
      this.responseInterceptor,
      this.responseErrorInterceptor,
    );
  }

  public getInstance = (): AxiosInstance => {
    return this.axiosInstance;
  };

  private responseInterceptor = async (response: AxiosResponse) => {
    return response;
  };

  private responseErrorInterceptor = async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (
      error.response?.status === 401 &&
      error.config &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      if (originalRequest?.url === API_ROUTES.auth.login) throw error;

      if (!this.refreshPromise) {
        this.refreshPromise = this.axiosInstance
          .get<{ accessToken: string }>(API_ROUTES.auth.refresh, {
            withCredentials: true,
          })
          .then(({ data }) => {
            return data.accessToken;
          })
          .finally(() => {
            this.refreshPromise = null;
          });
      }

      try {
        await this.refreshPromise;
        return this.axiosInstance.request(originalRequest);
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) {
          // toast.error("Your session has expired.");
          document.location.href = ADMIN_AUTH_ROUTES.login;
        } else {
          // toast.error("Unknown error");
        }
        throw e;
      }
    }
    throw error;
  };
}

const apiClient = new ApiClient();

export default apiClient;
