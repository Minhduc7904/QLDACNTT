import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input, Card, LanguageToggle, Checkbox, RadioButton } from '../components';
import { useAuth, useTranslation, useNotification } from '../hooks';
import { validateRequired, isValidEmail } from '../utils';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { initializeLanguage } from '../store/slices/languageSlice';

const RegisterPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loginType, setLoginType] = useState<'email' | 'username'>('email');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, isLoading, error } = useAuth();
    const { t } = useTranslation();
    const { showSuccess, showError } = useNotification();

    const [formData, setFormData] = useState({
        fullName: '',
        identifier: '', // Có thể là email hoặc username
        password: '',
        confirmPassword: '',
        gender: '', // male, female, other
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Khởi tạo ngôn ngữ từ localStorage khi component mount
        dispatch(initializeLanguage());
    }, []); // Empty dependency array to run only once

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

        const fullNameError = validateRequired(formData.fullName, 'Full Name');
        if (fullNameError) {
            newErrors.fullName = fullNameError;
        }

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

        const confirmPasswordError = validateRequired(formData.confirmPassword, 'Confirm Password');
        if (confirmPasswordError) {
            newErrors.confirmPassword = confirmPasswordError;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản dịch vụ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            // Chuyển đổi formData để phù hợp với API
            const registerData = {
                name: formData.fullName,
                email: loginType === 'email' ? formData.identifier : `${formData.identifier}@example.com`, // Tạm thời cho username
                username: loginType === 'username' ? formData.identifier : '',
                password: formData.password,
                confirmPassword: formData.confirmPassword
            };
            
            const result = await register(registerData);
            if (result.meta.requestStatus === 'fulfilled') {
                showSuccess('Đăng ký tài khoản thành công!', 'Chào mừng');
                navigate('/dashboard');
            }
        } catch (error) {
            showError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.', 'Lỗi đăng ký');
            console.error('Register failed:', error);
        }
    };

    const toggleLoginType = () => {
        setLoginType(prev => prev === 'email' ? 'username' : 'email');
        setFormData(prev => ({ ...prev, identifier: '' }));
        setErrors({});
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <LanguageToggle />

            <div className="max-w-md w-full space-y-8">
                <Card shadow='none' className="max-w-md space-y-8 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            {t('registerTitle')}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {t('or')}{' '}
                            <Link
                                to="/login"
                                className="font-medium text-gray-900 hover:text-black"
                            >
                                {t('haveAccount')}
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <Input
                            label={t('fullName')}
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            error={errors.fullName}
                            placeholder={t('fullNamePlaceholder')}
                            required
                            leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                        />

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
                                className="absolute right-3 top-8 focus:outline-none hover:bg-gray-100 p-1 rounded transition-colors"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4 text-black" /> : <Eye className="h-4 w-4 text-black" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label={t('confirmPassword')}
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                error={errors.confirmPassword}
                                placeholder={t('confirmPasswordPlaceholder')}
                                required
                                leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 focus:outline-none hover:bg-gray-100 p-1 rounded transition-colors"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-black" /> : <Eye className="h-4 w-4 text-black" />}
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Giới tính
                            </label>
                            <div className="flex gap-6">
                                <RadioButton
                                    id="gender-male"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                    label="Nam"
                                    size="md"
                                />
                                <RadioButton
                                    id="gender-female"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                    label="Nữ"
                                    size="md"
                                />
                                <RadioButton
                                    id="gender-other"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === 'other'}
                                    onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                    label="Khác"
                                    size="md"
                                />
                            </div>
                            {errors.gender && (
                                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Checkbox
                                id="agree-to-terms"
                                name="agree-to-terms"
                                checked={formData.agreeToTerms}
                                onChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
                                label={
                                    <span className="text-sm text-gray-700">
                                        Tôi đồng ý với <Link to="/terms" className="text-black hover:underline font-medium">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-black hover:underline font-medium">Chính sách bảo mật</Link>
                                    </span>
                                }
                                size="md"
                            />
                            {errors.agreeToTerms && (
                                <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading || !formData.agreeToTerms}
                        >
                            {t('signUp')}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">{t('or')}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => {/* TODO: Implement Google register */}}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            {t('signInWithGoogle')}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
