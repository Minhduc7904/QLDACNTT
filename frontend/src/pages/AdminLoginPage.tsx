import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input, Card, LanguageToggle, Checkbox } from '../components';
import { BeeLogoBrand } from '../components/common';
import { useAdminAuth, useTranslation } from '../hooks';
import { validateRequired, isValidEmail } from '../utils';
import { STORAGE_KEYS } from '../constants';
import { Mail, Lock, Eye, EyeOff, User, Shield } from 'lucide-react';
import { initializeLanguage } from '../store/slices/languageSlice';

const AdminLoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginType, setLoginType] = useState<'email' | 'username'>('email');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { login, isLoading, error, user, refreshToken, accessToken } = useAdminAuth();
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        identifier: '', // Có thể là email hoặc username
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        const identifierError = validateRequired(formData.identifier, loginType === 'email' ? 'Email' : 'Username');
        if (identifierError) {
            newErrors.identifier = identifierError;
        } else if (loginType === 'email' && !isValidEmail(formData.identifier)) {
            newErrors.identifier = t('invalidEmail');
        }

        const passwordError = validateRequired(formData.password, 'Password');
        if (passwordError) {
            newErrors.password = passwordError;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // Khởi tạo ngôn ngữ từ localStorage khi component mount
        dispatch(initializeLanguage());

        // Load remembered credentials
        loadRememberedCredentials();
    }, []); // Empty dependency array to run only once

    useEffect(() => {
        if (user && accessToken && refreshToken) {
            navigate('/admin/dashboard');
        }
    }, [user, accessToken, refreshToken, navigate]);

    // Load remembered credentials from localStorage
    const loadRememberedCredentials = () => {
        const rememberedEmail = localStorage.getItem(STORAGE_KEYS.ADMIN_REMEMBER_EMAIL);
        const rememberedUsername = localStorage.getItem(STORAGE_KEYS.ADMIN_REMEMBER_USERNAME);
        const rememberedLoginType = localStorage.getItem(STORAGE_KEYS.ADMIN_REMEMBER_LOGIN_TYPE) as 'email' | 'username';

        if (rememberedEmail && rememberedLoginType === 'email') {
            setFormData(prev => ({
                ...prev,
                identifier: rememberedEmail,
                rememberMe: true
            }));
            setLoginType('email');
        } else if (rememberedUsername && rememberedLoginType === 'username') {
            setFormData(prev => ({
                ...prev,
                identifier: rememberedUsername,
                rememberMe: true
            }));
            setLoginType('username');
        }
    };

    // Save or remove remembered credentials
    const handleRememberCredentials = (identifier: string, loginType: 'email' | 'username', remember: boolean) => {
        if (remember && identifier.trim()) {
            if (loginType === 'email') {
                localStorage.setItem(STORAGE_KEYS.ADMIN_REMEMBER_EMAIL, identifier);
                localStorage.setItem(STORAGE_KEYS.ADMIN_REMEMBER_LOGIN_TYPE, 'email');
                // Clear username if switching to email
                localStorage.removeItem(STORAGE_KEYS.ADMIN_REMEMBER_USERNAME);
            } else {
                localStorage.setItem(STORAGE_KEYS.ADMIN_REMEMBER_USERNAME, identifier);
                localStorage.setItem(STORAGE_KEYS.ADMIN_REMEMBER_LOGIN_TYPE, 'username');
                // Clear email if switching to username
                localStorage.removeItem(STORAGE_KEYS.ADMIN_REMEMBER_EMAIL);
            }
        } else {
            // Clear all remembered credentials
            localStorage.removeItem(STORAGE_KEYS.ADMIN_REMEMBER_EMAIL);
            localStorage.removeItem(STORAGE_KEYS.ADMIN_REMEMBER_USERNAME);
            localStorage.removeItem(STORAGE_KEYS.ADMIN_REMEMBER_LOGIN_TYPE);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Handle remember me logic
        handleRememberCredentials(formData.identifier, loginType, formData.rememberMe);

        // Chuyển đổi formData để phù hợp với API
        const loginData = {
            email: loginType === 'email' ? formData.identifier : '',
            username: loginType === 'username' ? formData.identifier : '',
            password: formData.password
        };

        const result = await login(loginData);
        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/admin/dashboard');
        }
    };

    const toggleLoginType = () => {
        const newLoginType = loginType === 'email' ? 'username' : 'email';
        setLoginType(newLoginType);

        // Load appropriate remembered credential when switching login type
        const rememberedEmail = localStorage.getItem(STORAGE_KEYS.ADMIN_REMEMBER_EMAIL);
        const rememberedUsername = localStorage.getItem(STORAGE_KEYS.ADMIN_REMEMBER_USERNAME);
        const rememberedLoginType = localStorage.getItem(STORAGE_KEYS.ADMIN_REMEMBER_LOGIN_TYPE);

        let newIdentifier = '';
        let newRememberMe = false;

        if (newLoginType === 'email' && rememberedEmail && rememberedLoginType === 'email') {
            newIdentifier = rememberedEmail;
            newRememberMe = true;
        } else if (newLoginType === 'username' && rememberedUsername && rememberedLoginType === 'username') {
            newIdentifier = rememberedUsername;
            newRememberMe = true;
        }

        setFormData(prev => ({
            ...prev,
            identifier: newIdentifier,
            rememberMe: newRememberMe
        }));
        setErrors({});
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <LanguageToggle />

            <div className="max-w-md w-full space-y-8">
                <Card shadow='none' className="max-w-md space-y-8 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-lg">
                    <div className="text-center">
                        {/* Admin Icon & Branding */}
                        <div className="flex justify-center mb-4">
                            <BeeLogoBrand size="lg" iconVariant="gradient" />
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Shield className="h-6 w-6 text-blue-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('adminLogin')}
                            </h2>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                            {t('adminLoginSubtitle')}
                        </p>
                        
                        <div className="mt-4">
                            <Link
                                to="/student/login"
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                {t('loginAsStudent')}
                            </Link>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700">
                                    {loginType === 'email' ? t('email') : t('username')}
                                </label>
                                <button
                                    type="button"
                                    onClick={toggleLoginType}
                                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                                >
                                    {loginType === 'email' ? t('useUsername') : t('useEmail')}
                                </button>
                            </div>
                            <Input
                                type={loginType === 'email' ? 'email' : 'text'}
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleInputChange}
                                error={errors.identifier}
                                placeholder={loginType === 'email' ? t('emailPlaceholder') : t('usernamePlaceholder')}
                                required
                                leftIcon={loginType === 'email' ? <Mail className="h-4 w-4 text-muted-foreground" /> : <User className="h-4 w-4 text-muted-foreground" />}
                            />
                        </div>

                        <div className="relative">
                            <Input
                                label={t('password')}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                error={errors.password}
                                placeholder={t('passwordPlaceholder')}
                                required
                                leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 focus:outline-none"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <Checkbox
                                id="admin-remember-me"
                                name="admin-remember-me"
                                checked={formData.rememberMe}
                                onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                                label={t('rememberMe')}
                                size="md"
                            />

                            <div className="text-sm">
                                <Link
                                    to="/admin/forgot-password"
                                    className="font-medium text-blue-600 hover:text-blue-800"
                                >
                                    {t('forgotPassword')}
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {t('signInAsAdmin')}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdminLoginPage;