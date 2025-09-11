import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoadingSpinner } from '../components';
import { useNotification } from '../hooks';
import { setUser } from '../store/slices/authSlice';
import { STORAGE_KEYS } from '../constants';

const AuthCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showSuccess, showError } = useNotification();
    const [isProcessed, setIsProcessed] = React.useState(false);

    useEffect(() => {
        if (isProcessed) return; // Tránh xử lý nhiều lần

        const handleAuthCallback = () => {
            setIsProcessed(true);

            const token = searchParams.get('token');
            const refreshToken = searchParams.get('refresh');
            const userDataBase64 = searchParams.get('userData');
            const error = searchParams.get('error');

            // Nếu có lỗi từ backend
            if (error) {
                console.error('Google OAuth error from backend:', error);
                const errorMessage = decodeURIComponent(error);
                
                // Hiển thị thông báo lỗi cụ thể
                if (errorMessage.includes('Username đã tồn tại')) {
                    showError('Username đã tồn tại. Vui lòng thử lại hoặc liên hệ admin.', 'Lỗi đăng nhập');
                } else if (errorMessage.includes('không phải tài khoản sinh viên')) {
                    showError('Tài khoản này không phải tài khoản sinh viên. Vui lòng sử dụng đăng nhập cho admin.', 'Lỗi phân quyền');
                } else if (errorMessage.includes('Email đã được sử dụng')) {
                    showError('Email này đã được sử dụng bởi tài khoản khác.', 'Lỗi đăng nhập');
                } else {
                    showError(errorMessage, 'Lỗi đăng nhập Google');
                }
                
                navigate('/login', { replace: true });
                return;
            }

            // Nếu có thông tin auth
            if (token && refreshToken && userDataBase64) {
                try {
                    // Decode Base64 user data
                    const decodedUserData = atob(userDataBase64);

                    // Parse JSON
                    const user = JSON.parse(decodedUserData);

                    // Lưu vào localStorage
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
                    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

                    // Cập nhật Redux state
                    dispatch(setUser(user));

                    // Hiển thị thông báo thành công
                    showSuccess('Đăng nhập Google thành công!', 'Chào mừng');

                    // Chuyển hướng đến dashboard
                    navigate('/dashboard', { replace: true });
                } catch (parseError) {
                    console.error('Error parsing Google auth callback:', parseError);
                    console.error('Raw userDataBase64:', userDataBase64);
                    try {
                        console.error('Decoded userData:', atob(userDataBase64));
                    } catch (decodeError) {
                        console.error('Failed to decode Base64:', decodeError);
                    }
                    showError('Lỗi xử lý đăng nhập Google: ' + (parseError as Error).message);
                    navigate('/login', { replace: true });
                }
            } else {
                // Không có thông tin cần thiết
                showError('Lỗi đăng nhập Google');
                navigate('/login', { replace: true });
            }
        };

        handleAuthCallback();

        // Timeout fallback - nếu sau 10 giây vẫn chưa xử lý xong
        const timeout = setTimeout(() => {
            if (!isProcessed) {
                showError('Timeout xử lý đăng nhập Google');
                navigate('/login', { replace: true });
            }
        }, 10000);

        return () => clearTimeout(timeout);
    }, [searchParams, dispatch, navigate, showSuccess, showError, isProcessed]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="flex flex-col items-center">
                    <LoadingSpinner size="lg" />
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        Đang xử lý đăng nhập...
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Vui lòng chờ trong giây lát
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
