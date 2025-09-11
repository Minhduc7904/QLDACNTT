export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/student/login',
        REGISTER: '/auth/student/register',
        LOGOUT: '/auth/student/logout',
        REFRESH: '/auth/student/refresh',
        PROFILE: '/auth/student/profile',
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
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
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
