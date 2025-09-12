import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { Admin, LoginRequest, RegisterAdminRequest, ApiResponse } from '../types';

export class AuthAdminService {
    async login(credentials: LoginRequest): Promise<ApiResponse<{ user: Admin; token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.ADMIN.LOGIN, credentials);
    }

    async register(userData: RegisterAdminRequest): Promise<ApiResponse<{ user: Admin; token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.ADMIN.REGISTER, userData);
    }

    async logout(): Promise<ApiResponse> {
        return apiService.post(API_ENDPOINTS.AUTH.COMMON.LOGOUT);
    }

    async logoutAllDevices(): Promise<ApiResponse> {
        return apiService.post(API_ENDPOINTS.AUTH.COMMON.LOGOUT_ALL_DEVICES);
    }

    async refreshToken(): Promise<ApiResponse<{ token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.COMMON.REFRESH);
    }

    async getProfile(): Promise<ApiResponse<Admin>> {
        return apiService.get(API_ENDPOINTS.AUTH.ADMIN.PROFILE);
    }
}

export const authAdminService = new AuthAdminService();
