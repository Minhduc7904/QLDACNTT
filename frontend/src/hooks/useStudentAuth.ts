import { useAppSelector, useAppDispatch } from './redux';
import {
    loginStudent,
    registerStudent,
    logoutStudent,
    logoutStudentAllDevices,
    clearStudentError,
    initializeStudentAuth,
    setStudentAccessToken,
    setStudentRefreshToken,
    setStudentUser
} from '../store/slices/studentAuthSlice';
import { LoginRequest, RegisterStudentRequest } from '../types';

export const useStudentAuth = () => {
    const dispatch = useAppDispatch();
    const { user, accessToken, refreshToken, isLoading, error, isAuthenticated } = useAppSelector(
        (state) => state.studentAuth
    );

    const login = async (credentials: LoginRequest) => {
        return dispatch(loginStudent(credentials));
    };

    const register = async (userData: RegisterStudentRequest) => {
        return dispatch(registerStudent(userData));
    };

    const logout = async () => {
        return dispatch(logoutStudent());
    };

    const logoutAllDevices = async () => {
        return dispatch(logoutStudentAllDevices());
    };

    const initialize = () => {
        dispatch(initializeStudentAuth());
    };

    const clearAuthError = () => {
        dispatch(clearStudentError());
    };

    const setAccessToken = (token: string) => {
        dispatch(setStudentAccessToken(token));
    };

    const setRefreshToken = (token: string) => {
        dispatch(setStudentRefreshToken(token));
    };

    const setStudent = (user: any) => {
        dispatch(setStudentUser(user));
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
        clearAuthError,
        setAccessToken,
        setRefreshToken,
        setStudent
    };
};
