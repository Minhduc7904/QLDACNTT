import { useAppSelector, useAppDispatch } from './redux';
import {
    loginUser,
    registerUser,
    logoutUser,
    clearError,
    initializeAuth,
    getProfile
} from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, accessToken, refreshToken, isLoading, error, isAuthenticated } = useAppSelector(
        (state) => state.auth
    );

    const login = async (credentials: LoginRequest) => {
        return dispatch(loginUser(credentials));
    };

    const register = async (userData: RegisterRequest) => {
        return dispatch(registerUser(userData));
    };

    const logout = async () => {
        return dispatch(logoutUser());
    };

    const initialize = () => {
        dispatch(initializeAuth());
    };

    const fetchProfile = async () => {
        return dispatch(getProfile());
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    return {
        // State
        user,
        accessToken,
        refreshToken,
        isLoading,
        error,
        isAuthenticated,

        // Actions
        login,
        register,
        logout,
        initialize,
        fetchProfile,
        clearAuthError,
    };
};
