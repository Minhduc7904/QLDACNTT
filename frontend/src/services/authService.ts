import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { User, LoginRequest, RegisterRequest, ApiResponse } from '../types';

export class AuthService {
    async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    }

    async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    }

    async logout(): Promise<ApiResponse> {
        return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    }

    async refreshToken(): Promise<ApiResponse<{ token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.REFRESH);
    }

    async getProfile(): Promise<ApiResponse<User>> {
        return apiService.get(API_ENDPOINTS.AUTH.PROFILE);
    }
}

export const authService = new AuthService();
