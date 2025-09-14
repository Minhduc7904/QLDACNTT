export const API_ENDPOINTS = {
    AUTH: {
        STUDENT: {
            LOGIN: '/auth/student/login',
            REGISTER: '/auth/student/register',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh',
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
        },
        EMAIL_VERIFICATION: {
            SEND: '/auth/send-verification-email',
            VERIFY: '/auth/verify-email',
        }
    },
    STUDENT: {
        PROFILE: (id: string) => `/students/profile/${id}`,
        PROFILE_ME: '/students/profile/me',
        UPDATE: (id: string) => `/students/update/${id}`,
    },
    USERS: {
        LIST: '/users',
        DETAIL: (id: string) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id: string) => `/users/${id}`,
        DELETE: (id: string) => `/users/${id}`,
        AVATAR: '/users/avatar',
    },
} as const;

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login', // Legacy - redirects to student login
    STUDENT_LOGIN: '/student/login',
    ADMIN_LOGIN: '/admin/login',
    REGISTER: '/register', // Legacy - redirects to student register
    STUDENT_REGISTER: '/student/register',
    DASHBOARD: '/dashboard',
    ADMIN_DASHBOARD: '/admin/dashboard',
    PROFILE: '/profile',
    USERS: '/users',
    NOT_FOUND: '/404',
} as const;

export const STORAGE_KEYS = {
    // Legacy keys (for backward compatibility)
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',

    // General keys
    THEME: 'theme',
    LANGUAGE: 'language',

    // Student remember me keys
    REMEMBER_EMAIL: 'rememberedEmail',
    REMEMBER_USERNAME: 'rememberedUsername',
    REMEMBER_LOGIN_TYPE: 'rememberedLoginType',

    // Admin remember me keys
    ADMIN_REMEMBER_EMAIL: 'adminRememberedEmail',
    ADMIN_REMEMBER_USERNAME: 'adminRememberedUsername',
    ADMIN_REMEMBER_LOGIN_TYPE: 'adminRememberedLoginType',
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
