// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Notification Types
export * from './notification';

// User Types - Based on database schema
export interface User {
  userId: number;
  oldUserId?: number;
  username: string;
  email?: string;
  passwordHash: string;
  avatarId?: number;
  avatar?: Image;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: string;
}

export interface Student extends User {
  studentId: number;
  studentPhone?: string;
  parentPhone?: string;
  grade: number;
  school?: string;
}

export interface Admin extends User {
  adminId: number;
  subjectId?: number;
  subject?: {
    subjectId: number;
    name: string;
    code?: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterStudentRequest {
  username: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  studentPhone?: string;
  parentPhone?: string;
  grade: number;
  school?: string;
}

export interface RegisterAdminRequest {
  username: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
  subjectId?: number;
}

// Legacy type for backward compatibility
export interface RegisterRequest {
  username: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface StudentAuthState extends AuthState {
  user: Student | null;
}

export interface AdminAuthState extends AuthState {
  user: Admin | null;
}

// Subject Types
export interface Subject {
  subjectId: number;
  name: string;
  code?: string;
}

// Role Types
export interface Role {
  roleId: number;
  roleName: string;
  description?: string;
  isAssignable: boolean;
  requiredByRoleId?: number;
  createdAt: string;
}

export interface UserRole {
  userId: number;
  roleId: number;
  assignedAt: string;
  expiresAt?: string;
  assignedBy?: number;
  isActive: boolean;
}

// Token Types
export interface UserRefreshToken {
  tokenId: number;
  userId: number;
  familyId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
  replacedByTokenId?: number;
  userAgent?: string;
  ipAddress?: string;
  deviceFingerprint?: string;
}

// Image Types
export interface Image {
  imageId: number;
  adminId?: number;
  url: string;
  anotherUrl?: string;
  mimeType?: string;
  storageProvider: 'LOCAL' | 'S3' | 'GCS' | 'EXTERNAL';
  createdAt: string;
  updatedAt: string;
}

// Common Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
