import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { Student, LoginRequest, RegisterStudentRequest, ApiResponse } from '../types';

export class AuthStudentService {
    async login(credentials: LoginRequest): Promise<ApiResponse<{ user: Student; token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.STUDENT.LOGIN, credentials);
    }

    async register(userData: RegisterStudentRequest): Promise<ApiResponse<{ user: Student; token: string }>> {
        return apiService.post(API_ENDPOINTS.AUTH.STUDENT.REGISTER, userData);
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

    async sendVerificationEmail(userId: number): Promise<ApiResponse<{ emailSent: boolean; expiresAt: string }>> {
        return apiService.post(`${API_ENDPOINTS.AUTH.EMAIL_VERIFICATION.SEND}/${userId}`);
    }

}

export const authStudentService = new AuthStudentService();
