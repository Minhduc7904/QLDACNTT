export const API_ENDPOINTS = {
    AUTH: {
        STUDENT: {
            LOGIN: '/auth/student/login',
            REGISTER: '/auth/student/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            PROFILE: '/auth/student/profile',
        },
        ADMIN: {
            LOGIN: '/auth/admin/login',
            REGISTER: '/auth/admin/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
            PROFILE: '/auth/admin/profile',
        },
        COMMON: {
            LOGOUT: '/auth/logout',
            LOGOUT_ALL_DEVICES: '/auth/logout/all-devices',
            REFRESH: '/auth/refresh',
        }
    },
    USERS: {
        LIST: '/users',
        DETAIL: (id: string) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id: string) => `/users/${id}`,
        DELETE: (id: string) => `/users/${id}`,
    },
} as const;

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    USERS: '/users',
    NOT_FOUND: '/404',
} as const;

export const STORAGE_KEYS = {
    // Legacy keys (for backward compatibility)
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    
    // Student specific keys
    STUDENT_ACCESS_TOKEN: 'student_access_token',
    STUDENT_REFRESH_TOKEN: 'student_refresh_token',
    STUDENT_USER_DATA: 'student_user_data',
    
    // Admin specific keys
    ADMIN_ACCESS_TOKEN: 'admin_access_token',
    ADMIN_REFRESH_TOKEN: 'admin_refresh_token',
    ADMIN_USER_DATA: 'admin_user_data',
    
    // General keys
    THEME: 'theme',
    LANGUAGE: 'language',
    REMEMBER_EMAIL: 'rememberedEmail',
    REMEMBER_USERNAME: 'rememberedUsername',
    REMEMBER_LOGIN_TYPE: 'rememberedLoginType',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const QUERY_KEYS = {
    AUTH: ['auth'],
    USER: ['user'],
    USERS: ['users'],
} as const;
