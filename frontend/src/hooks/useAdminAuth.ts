import { useAppSelector, useAppDispatch } from './redux';
import {
    loginAdmin,
    registerAdmin,
    logoutAdmin,
    logoutAdminAllDevices,
    clearAdminError,
    initializeAdminAuth,
    getAdminProfile
} from '../store/slices/adminAuthSlice';
import { LoginRequest, RegisterAdminRequest } from '../types';

export const useAdminAuth = () => {
    const dispatch = useAppDispatch();
    const { user, accessToken, refreshToken, isLoading, error, isAuthenticated } = useAppSelector(
        (state) => state.adminAuth
    );

    const login = async (credentials: LoginRequest) => {
        return dispatch(loginAdmin(credentials));
    };

    const register = async (userData: RegisterAdminRequest) => {
        return dispatch(registerAdmin(userData));
    };

    const logout = async () => {
        return dispatch(logoutAdmin());
    };

    const logoutAllDevices = async () => {
        return dispatch(logoutAdminAllDevices());
    };

    const initialize = () => {
        dispatch(initializeAdminAuth());
    };

    const fetchProfile = async () => {
        return dispatch(getAdminProfile());
    };

    const clearAuthError = () => {
        dispatch(clearAdminError());
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
        logoutAllDevices,
        initialize,
        fetchProfile,
        clearAuthError,
    };
};
