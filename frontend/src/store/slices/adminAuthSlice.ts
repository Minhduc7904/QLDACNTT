import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminAuthState, Admin, LoginRequest, RegisterAdminRequest } from '../../types';
import { authAdminService } from '../../services';
import { STORAGE_KEYS } from '../../constants';
import { createAuthThunkHandler, createAsyncThunkHandler } from '../../utils';

// Storage keys specific to admin
const ADMIN_STORAGE_KEYS = {
    ACCESS_TOKEN: STORAGE_KEYS.ACCESS_TOKEN,
    REFRESH_TOKEN: STORAGE_KEYS.REFRESH_TOKEN,
};

// Initial state
const initialState: AdminAuthState = {
    user: null,
    accessToken: localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN),
    isLoading: false,
    error: null,
    isAuthenticated: (!!localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN) &&
        !!localStorage.getItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN)
    ),
};

// Async thunks
export const loginAdmin = createAsyncThunk<
    { user: Admin; token: string },
    LoginRequest
>(
    'adminAuth/login',
    createAuthThunkHandler(
        (credentials: LoginRequest) => authAdminService.login(credentials),
        'Đăng nhập admin thất bại',
        {
            successMessage: 'Đăng nhập thành công!',
            successTitle: 'Chào mừng admin',
            onSuccess: (response) => {
                console.log(response);
                localStorage.setItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken);
                localStorage.setItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken);
                return response.data;
            }
        }
    )
);

export const registerAdmin = createAsyncThunk<
    { user: Admin; token: string },
    RegisterAdminRequest
>(
    'adminAuth/register',
    createAuthThunkHandler(
        (userData: RegisterAdminRequest) => authAdminService.register(userData),
        'Đăng ký admin thất bại',
        {
            successMessage: 'Đăng ký thành công!',
            successTitle: 'Chào mừng admin',
            onSuccess: (response) => {
                localStorage.setItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
                localStorage.setItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                return response.data;
            }
        }
    )
);

export const logoutAdmin = createAsyncThunk(
    'adminAuth/logout',
    createAsyncThunkHandler(
        async () => {
            try {
                await authAdminService.logout();
            } finally {
                // Always clear localStorage, even if server logout fails
                localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
            }
            return null;
        },
        'Đăng xuất admin thất bại'
    )
);

export const logoutAdminAllDevices = createAsyncThunk(
    'adminAuth/logoutAllDevices',
    createAsyncThunkHandler(
        async () => {
            try {
                await authAdminService.logoutAllDevices();
            } finally {
                localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
            }
            return null;
        },
        'Đăng xuất khỏi tất cả thiết bị thất bại'
    )
);

export const refreshAdminToken = createAsyncThunk<string>(
    'adminAuth/refreshToken',
    createAuthThunkHandler(
        () => authAdminService.refreshToken(),
        'Làm mới token admin thất bại',
        {
            showSuccessNotification: false,
            onSuccess: (response) => {
                localStorage.setItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
                localStorage.setItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                return response.data.token;
            }
        }
    )
);

export const getAdminProfile = createAsyncThunk<Admin>(
    'adminAuth/getProfile',
    createAuthThunkHandler(
        () => authAdminService.getProfile(),
        'Lấy thông tin admin thất bại',
        {
            showSuccessNotification: false,
            onSuccess: (response) => {
                return response.data;
            }
        }
    )
);

// Admin Auth slice
const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        },
        setAdminUser: (state, action: PayloadAction<Admin>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearAdminAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
        },
        initializeAdminAuth: (state) => {
            const accessToken = localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);

            if (accessToken) {
                try {
                    state.accessToken = accessToken;
                    state.refreshToken = refreshToken;
                    state.isAuthenticated = true;
                } catch (error) {
                    localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(registerAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Logout
        builder
            .addCase(logoutAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutAdmin.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });

        // Logout All Devices
        builder
            .addCase(logoutAdminAllDevices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutAdminAllDevices.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutAdminAllDevices.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });

        // Refresh Token
        builder
            .addCase(refreshAdminToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshAdminToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload;
                state.error = null;
            })
            .addCase(refreshAdminToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });

        // Get Profile
        builder
            .addCase(getAdminProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAdminProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getAdminProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearAdminError, setAdminUser, clearAdminAuth, initializeAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
