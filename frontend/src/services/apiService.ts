import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS, HTTP_STATUS, API_ENDPOINTS } from '../constants';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;
  private isDevelopment: boolean;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private logRequest(config: any): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    console.group(`%c🚀 API Request [${timestamp}] %c${config.method?.toUpperCase()} %c${config.url}`,
      'color: #10B981; font-weight: bold;',
      'color: #3B82F6; font-weight: bold;',
      'color: #6366F1; font-weight: bold;'
    );
    console.log('📍 Full URL:', `${config.baseURL}${config.url}`);
    console.log('🔑 Headers:', config.headers);
    if (config.data) {
      console.log('📦 Request Data:', config.data);
    }
    if (config.params) {
      console.log('🔍 Query Params:', config.params);
    }
    console.groupEnd();
  }

  private logResponse(response: AxiosResponse): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    const statusColor = response.status >= 200 && response.status < 300 ? '#10B981' : '#EF4444';

    console.group(`%c✅ API Response [${timestamp}] %c${response.config.method?.toUpperCase()} %c${response.config.url}`,
      `color: ${statusColor}; font-weight: bold;`,
      'color: #3B82F6; font-weight: bold;',
      'color: #6366F1; font-weight: bold;'
    );
    console.log(`📊 Status: %c${response.status} ${response.statusText}`, `color: ${statusColor}; font-weight: bold;`);
    console.log('🏷️ Response Headers:', response.headers);
    console.log('📥 Response Data:', response.data);
    console.groupEnd();
  }

  private logError(error: any): void {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString();
    console.group(`%c❌ API Error [${timestamp}] %c${error.config?.method?.toUpperCase()} %c${error.config?.url}`,
      'color: #EF4444; font-weight: bold;',
      'color: #3B82F6; font-weight: bold;',
      'color: #6366F1; font-weight: bold;'
    );
    console.error('💥 Error Status:', error.response?.status);
    console.error('📄 Error Data:', error.response?.data);
    console.error('🔍 Full Error:', error);
    console.groupEnd();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData - remove Content-Type to let browser set it
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        // Log API request in development
        this.logRequest(config);

        return config;
      },
      (error) => {
        // Log request error in development
        this.logError(error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log API response in development
        this.logResponse(response);
        return response;
      },
      async (error) => {
        // Log response error in development
        this.logError(error);

        const originalRequest = error.config;

        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          // Đánh dấu request đã retry để tránh infinite loop
          originalRequest._retry = true;

          if (this.isRefreshing) {
            // Nếu đang refresh, queue request này
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Gọi API refresh token
            const refreshResponse = await this.refreshAccessToken(refreshToken);

            if (refreshResponse?.data?.accessToken) {
              const newAccessToken = refreshResponse.data.accessToken;
              const newRefreshToken = refreshResponse.data.refreshToken;

              // Lưu tokens mới
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
              localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

              // Retry tất cả requests trong queue
              this.processQueue(null, newAccessToken);

              // Retry original request với token mới
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.api(originalRequest);
            } else {
              throw new Error('Invalid refresh response');
            }

          } catch (refreshError) {
            // Refresh token thất bại, clear tất cả và redirect
            this.processQueue(refreshError, null);
            this.clearAuthData();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  // Upload file method
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.api.post<T>(url, formData, config);
    return response.data;
  }

  // Set auth token
  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  // Remove auth token
  removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Toggle development logging (useful for debugging in production)
  toggleDevLogging(enable?: boolean): void {
    this.isDevelopment = enable !== undefined ? enable : !this.isDevelopment;
    console.log(`🔧 API Logging ${this.isDevelopment ? 'enabled' : 'disabled'}`);
  }

  // Get current logging status
  isLoggingEnabled(): boolean {
    return this.isDevelopment;
  }

  // Refresh access token using refresh token
  private async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      // Gọi API refresh token trực tiếp không qua interceptor để tránh loop
      const axiosInstance = axios.create({
        baseURL: this.baseURL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.COMMON.REFRESH, {
        refreshToken: refreshToken
      });

      return response.data;
    } catch (error) {
      console.error('Refresh token failed:', error);
      throw error;
    }
  }

  // Process queued requests after token refresh
  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Clear all authentication data
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USER_DATA);
  }
}

export const apiService = new ApiService();
export default apiService;
