import { authStudentService } from './authStudentService';
import { authAdminService } from './authAdminService';

// Re-export specialized auth services
export { authStudentService } from './authStudentService';
export { authAdminService } from './authAdminService';

// Legacy export for backward compatibility
// You should use authStudentService or authAdminService instead
export const authService = authStudentService;
