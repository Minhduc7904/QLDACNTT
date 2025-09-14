import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse, Student } from '../types';

export class StudentService {
    async getProfile(id: string): Promise<ApiResponse<Student>> {
        return apiService.get(API_ENDPOINTS.STUDENT.PROFILE(id));
    }

    async getCurrentProfile(): Promise<ApiResponse<Student>> {
        return apiService.get(API_ENDPOINTS.STUDENT.PROFILE_ME);
    }

    async updateProfile(id: string, data: Partial<Student>): Promise<ApiResponse<Student>> {
        return apiService.put(API_ENDPOINTS.STUDENT.UPDATE(id), data);
    }

    async updateAvatar(
        file: File
    ): Promise<ApiResponse<{ imageId: number; avatarUrl: string; oldAvatarUrl?: string }>> {
        const formData = new FormData();
        formData.append('avatar', file);

        // Debug xem FormData đã có gì
        for (const [key, value] of formData.entries()) {
            console.log('FormData entry:', key, value);
        }

        // Không set Content-Type thủ công, Axios sẽ tự thêm boundary cho FormData
        return apiService.post(API_ENDPOINTS.USERS.AVATAR, formData);
    }

};

export const studentService = new StudentService();