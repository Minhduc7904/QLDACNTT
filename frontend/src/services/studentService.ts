import { apiService } from './apiService';
import { API_ENDPOINTS } from '../constants';
import { ApiResponse, Student } from '../types';

export class StudentService {
    async getProfile(id: string): Promise<ApiResponse<Student>> {
        return apiService.get(API_ENDPOINTS.STUDENT.PROFILE(id));
    }

    async updateProfile(id: string, data: Partial<Student>): Promise<ApiResponse<Student>> {
        return apiService.put(API_ENDPOINTS.STUDENT.UPDATE(id), data);
    }
};

export const studentService = new StudentService();