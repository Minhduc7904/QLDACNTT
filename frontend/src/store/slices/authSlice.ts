import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginRequest, RegisterRequest } from '../../types';
import { authService } from '../../services';
import { STORAGE_KEYS } from '../../constants';
import { createAuthThunkHandler, createAsyncThunkHandler } from '../../utils';

// Initial state
const initialState: AuthState = {
    user: null,
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
};

// Async thunks
export const loginUser = createAsyncThunk<
    { user: User; token: string },
    LoginRequest
>(
    'auth/login',
    createAuthThunkHandler(
        (credentials: LoginRequest) => authService.login(credentials),
        'Đăng nhập thất bại',
        {
            successMessage: 'Đăng nhập thành công!',
            successTitle: 'Chào mừng',
            onSuccess: (response) => {
                console.log(response);
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken);
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
                return response.data;
            }
        }
    )
);

export const registerUser = createAsyncThunk<
    { user: User; token: string },
    RegisterRequest
>(
    'auth/register',
    createAuthThunkHandler(
        (userData: RegisterRequest) => authService.register(userData),
        'Đăng ký thất bại',
        {
            successMessage: 'Đăng ký thành công!',
            successTitle: 'Chào mừng',
            onSuccess: (response) => {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
                return response.data;
            }
        }
    )
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    createAsyncThunkHandler(
        async () => {
            try {
                await authService.logout();
            } finally {
                // Always clear localStorage, even if server logout fails
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            }
            return null;
        },
        'Logout failed'
    )
);

export const refreshToken = createAsyncThunk<string>(
    'auth/refreshToken',
    createAuthThunkHandler(
        () => authService.refreshToken(),
        'Làm mới token thất bại',
        {
            showSuccessNotification: false, // Không hiển thị thông báo success cho refresh token
            onSuccess: (response) => {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                return response.data.token;
            }
        }
    )
);

export const getProfile = createAsyncThunk<User>(
    'auth/getProfile',
    createAuthThunkHandler(
        () => authService.getProfile(),
        'Lấy thông tin người dùng thất bại',
        {
            showSuccessNotification: false, // Không hiển thị thông báo success cho get profile
            onSuccess: (response) => {
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
                return response.data;
            }
        }
    )
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        },
        initializeAuth: (state) => {
            const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);

            if (accessToken && userData) {
                try {
                    state.accessToken = accessToken;
                    state.user = JSON.parse(userData);
                    state.isAuthenticated = true;
                } catch (error) {
                    // If userData is invalid, clear everything
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
                }
            }
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Logout
        builder
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });

        // Refresh Token
        builder
            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload;
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });

        // Get Profile
        builder
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setUser, clearAuth, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
