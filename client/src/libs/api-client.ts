import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { API_ROUTES, API_URL } from "../configs/api-routes.config";

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
        this.refreshPromise = axios
          .get<{ accessToken: string }>(API_URL + API_ROUTES.auth.refresh, {
            withCredentials: true,
          })
          .then(({ data }) => {
            return data.accessToken;
          })
          .finally(() => {
            this.refreshPromise = null;
          });
      }

      await this.refreshPromise;
      return this.axiosInstance.request(originalRequest);
    }
    throw error;
  };
}

const apiClient = new ApiClient();

export default apiClient;
