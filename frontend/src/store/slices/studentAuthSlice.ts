import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StudentAuthState, Student, LoginRequest, RegisterStudentRequest } from '../../types';
import { authStudentService } from '../../services';
import { STORAGE_KEYS } from '../../constants';
import { createAuthThunkHandler, createAsyncThunkHandler } from '../../utils';
import { Image } from '../../types';
// Storage keys specific to student
const STUDENT_STORAGE_KEYS = {
    ACCESS_TOKEN: STORAGE_KEYS.ACCESS_TOKEN,
    REFRESH_TOKEN: STORAGE_KEYS.REFRESH_TOKEN,
};

// Initial state
const initialState: StudentAuthState = {
    user: null,
    accessToken: localStorage.getItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: localStorage.getItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN),
    isLoading: false,
    error: null,
    isAuthenticated: (!!localStorage.getItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN) &&
        !!localStorage.getItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN)
    ),
};

// Async thunks
export const loginStudent = createAsyncThunk<
    { user: Student; token: string },
    Omit<LoginRequest, 'userAgent' | 'ipAddress' | 'deviceFingerprint'>
>(
    'studentAuth/login',
    createAuthThunkHandler(
        async (credentials: Omit<LoginRequest, 'userAgent' | 'ipAddress' | 'deviceFingerprint'>) => {
            // Thu thập thông tin device
            const { collectDeviceInfo } = await import('../../utils/deviceFingerprint');
            const deviceInfo = await collectDeviceInfo();

            // Kết hợp credentials với device info
            const loginData: LoginRequest = {
                ...credentials,
                ...deviceInfo
            };

            return authStudentService.login(loginData);
        },
        'Đăng nhập học sinh thất bại',
        {
            successMessage: 'Đăng nhập thành công!',
            successTitle: 'Chào mừng học sinh',
            onSuccess: (response) => {
                console.log(response);
                localStorage.setItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken);
                localStorage.setItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken);
                return response.data;
            }
        }
    )
);

export const registerStudent = createAsyncThunk<
    { user: Student; token: string },
    RegisterStudentRequest
>(
    'studentAuth/register',
    createAuthThunkHandler(
        (userData: RegisterStudentRequest) => authStudentService.register(userData),
        'Đăng ký học sinh thất bại',
        {
            successMessage: 'Đăng ký thành công!',
            successTitle: 'Chào mừng học sinh',
            onSuccess: (response) => {
                localStorage.setItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
                localStorage.setItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                return response.data;
            }
        }
    )
);

export const logoutStudent = createAsyncThunk(
    'studentAuth/logout',
    createAsyncThunkHandler(
        async () => {
            try {
                await authStudentService.logout();
            } finally {
                // Always clear localStorage, even if server logout fails
                localStorage.removeItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN);
            }
            return null;
        },
        'Đăng xuất học sinh thất bại'
    )
);

export const logoutStudentAllDevices = createAsyncThunk(
    'studentAuth/logoutAllDevices',
    createAsyncThunkHandler(
        async () => {
            try {
                await authStudentService.logoutAllDevices();
            } finally {
                localStorage.removeItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN);
            }
            return null;
        },
        'Đăng xuất khỏi tất cả thiết bị thất bại'
    )
);

export const refreshStudentToken = createAsyncThunk<string>(
    'studentAuth/refreshToken',
    createAuthThunkHandler(
        () => authStudentService.refreshToken(),
        'Làm mới token học sinh thất bại',
        {
            showSuccessNotification: false,
            onSuccess: (response) => {
                localStorage.setItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
                localStorage.setItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
                return response.data.token;
            }
        }
    )
);



// Student Auth slice
const studentAuthSlice = createSlice({
    name: 'studentAuth',
    initialState,
    reducers: {
        clearStudentError: (state) => {
            state.error = null;
        },
        setStudentUser: (state, action: PayloadAction<Student>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearStudentAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN);
        },
        initializeStudentAuth: (state) => {
            const accessToken = localStorage.getItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN);
            const refreshToken = localStorage.getItem(STUDENT_STORAGE_KEYS.REFRESH_TOKEN);
            if (accessToken) {
                try {
                    state.accessToken = accessToken;
                    state.isAuthenticated = true;
                } catch (error) {
                    localStorage.removeItem(STUDENT_STORAGE_KEYS.ACCESS_TOKEN);
                }
            }
        },
        setStudentAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        setStudentRefreshToken: (state, action: PayloadAction<string>) => {
            state.refreshToken = action.payload;
        },
        updateUserAvatar: (state, action: PayloadAction<Image>) => {
            if (state.user) {
                if (state.user.imageUrls) {
                    state.user.imageUrls.url = action.payload.url;
                } else {
                    state.user.imageUrls = {
                        imageId: action.payload.imageId,
                        url: action.payload.url
                    };
                }
            }
        }

    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginStudent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Register
        builder
            .addCase(registerStudent.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });

        // Logout
        builder
            .addCase(logoutStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutStudent.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutStudent.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });

        // Logout All Devices
        builder
            .addCase(logoutStudentAllDevices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutStudentAllDevices.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutStudentAllDevices.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.error = null;
            });

        // Refresh Token
        builder
            .addCase(refreshStudentToken.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(refreshStudentToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload;
                state.error = null;
            })
            .addCase(refreshStudentToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearStudentError, setStudentUser, clearStudentAuth, initializeStudentAuth, setStudentAccessToken, setStudentRefreshToken, updateUserAvatar } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;
