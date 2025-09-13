import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Input, Card, LanguageToggle, Checkbox, FormDropdown } from '../components';
import { BeeLogoBrand } from '../components/common';
import { useStudentAuth, useTranslation, useNotification } from '../hooks';
import { validateRequired, isValidEmail } from '../utils';
import { Mail, Lock, Eye, EyeOff, User, Phone, GraduationCap, School, Check } from 'lucide-react';
import { initializeLanguage } from '../store/slices/languageSlice';

const StudentRegisterPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, isLoading, error } = useStudentAuth();
    const { t } = useTranslation();
    const { showSuccess, showError } = useNotification();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        grade: '',
        studentPhone: '',
        parentPhone: '',
        school: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Grade options from 6 to 12
    const gradeOptions = Array.from({ length: 7 }, (_, i) => ({
        key: (i + 6).toString(),
        value: (i + 6).toString(),
        label: `Lớp ${i + 6}`
    }));

    useEffect(() => {
        // Khởi tạo ngôn ngữ từ localStorage khi component mount
        dispatch(initializeLanguage());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name?: string; value: string } }) => {
        const { name, value } = e.target;
        if (name) {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Clear error when user starts typing
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Required fields
        const usernameError = validateRequired(formData.username, t('username'));
        if (usernameError) {
            newErrors.username = usernameError;
        }

        const passwordError = validateRequired(formData.password, t('password'));
        if (passwordError) {
            newErrors.password = passwordError;
        } else if (formData.password.length < 6) {
            newErrors.password = t('passwordMinLength');
        }

        const firstNameError = validateRequired(formData.firstName, t('firstName'));
        if (firstNameError) {
            newErrors.firstName = firstNameError;
        }

        const lastNameError = validateRequired(formData.lastName, t('lastName'));
        if (lastNameError) {
            newErrors.lastName = lastNameError;
        }

        const gradeError = validateRequired(formData.grade, t('grade'));
        if (gradeError) {
            newErrors.grade = gradeError;
        }

        // Optional fields validation
        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = t('invalidEmail');
        }

        if (formData.studentPhone && !isValidPhoneNumber(formData.studentPhone)) {
            newErrors.studentPhone = t('invalidPhoneNumber');
        }

        if (formData.parentPhone && !isValidPhoneNumber(formData.parentPhone)) {
            newErrors.parentPhone = t('invalidPhoneNumber');
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = t('agreeToTermsRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidPhoneNumber = (phone: string): boolean => {
        // Vietnamese phone number regex
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    };

    // Validate specific steps
    const validateStep = (step: number) => {
        const newErrors: { [key: string]: string } = {};

        if (step === 1) {
            // Step 1: Personal Information
            const usernameError = validateRequired(formData.username, t('username'));
            if (usernameError) newErrors.username = usernameError;

            const passwordError = validateRequired(formData.password, t('password'));
            if (passwordError) {
                newErrors.password = passwordError;
            } else if (formData.password.length < 6) {
                newErrors.password = t('passwordMinLength');
            }

            const firstNameError = validateRequired(formData.firstName, t('firstName'));
            if (firstNameError) newErrors.firstName = firstNameError;

            const lastNameError = validateRequired(formData.lastName, t('lastName'));
            if (lastNameError) newErrors.lastName = lastNameError;

            if (formData.email && !isValidEmail(formData.email)) {
                newErrors.email = t('invalidEmail');
            }
        } else if (step === 2) {
            // Step 2: Academic Information
            const gradeError = validateRequired(formData.grade, t('grade'));
            if (gradeError) newErrors.grade = gradeError;
        } else if (step === 3) {
            // Step 3: Contact Information
            if (formData.studentPhone && !isValidPhoneNumber(formData.studentPhone)) {
                newErrors.studentPhone = t('invalidPhoneNumber');
            }

            if (formData.parentPhone && !isValidPhoneNumber(formData.parentPhone)) {
                newErrors.parentPhone = t('invalidPhoneNumber');
            }

            if (!formData.agreeToTerms) {
                newErrors.agreeToTerms = t('agreeToTermsRequired');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 3) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const getStepTitle = (step: number) => {
        switch (step) {
            case 1: return t('stepPersonalInfo');
            case 2: return t('stepAcademicInfo');
            case 3: return t('stepContactInfo');
            default: return '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const registerData = {
                username: formData.username,
                email: formData.email || undefined,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                grade: parseInt(formData.grade),
                studentPhone: formData.studentPhone || undefined,
                parentPhone: formData.parentPhone || undefined,
                school: formData.school || undefined,
            };

            const result = await register(registerData);
            if (result.meta.requestStatus === 'fulfilled') {
                showSuccess(
                    t('currentLanguage') === 'vi' 
                        ? 'Đăng ký tài khoản học sinh thành công! Vui lòng đăng nhập để tiếp tục.' 
                        : 'Student account registration successful! Please login to continue.', 
                    t('currentLanguage') === 'vi' ? 'Đăng ký thành công' : 'Registration Successful'
                );
                navigate('/student/login');
            }
        } catch (error) {
            showError(
                t('currentLanguage') === 'vi' 
                    ? 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.' 
                    : 'Registration failed. Please check your information.',
                t('currentLanguage') === 'vi' ? 'Lỗi đăng ký' : 'Registration Error'
            );
            console.error('Register failed:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
            <LanguageToggle />

            <div className="max-w-lg w-full space-y-8">
                <Card shadow='none' className="max-w-lg space-y-8 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-lg">
                    <div className="text-center">
                        {/* Student Branding */}
                        <div className="flex justify-center mb-4">
                            <BeeLogoBrand size="lg" iconVariant="hexagon" />
                        </div>

                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <GraduationCap className="h-6 w-6 text-yellow-600" />
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('studentRegisterTitle')}
                            </h2>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                            {t('haveAccount')}{' '}
                            <Link
                                to="/student/login"
                                className="font-medium text-yellow-600 hover:text-yellow-800"
                            >
                                {t('signIn')}
                            </Link>
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`
                                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                                    ${currentStep === step ? 'bg-yellow-500 text-white' :
                                        currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                                `}>
                                    {currentStep > step ? <Check className="h-4 w-4" /> : step}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${currentStep === step ? 'text-yellow-600' :
                                        currentStep > step ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                    {getStepTitle(step)}
                                </span>
                                {step < 3 && (
                                    <div className={`ml-4 w-8 h-0.5 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Step Content */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                                    <User className="h-5 w-5 text-yellow-600 mr-2" />
                                    {t('stepPersonalInfo')}
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label={`${t('firstName')} *`}
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        error={errors.firstName}
                                        placeholder={t('firstNamePlaceholder')}
                                        required
                                        leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                                    />

                                    <Input
                                        label={`${t('lastName')} *`}
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        error={errors.lastName}
                                        placeholder={t('lastNamePlaceholder')}
                                        required
                                        leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                                    />
                                </div>

                                <Input
                                    label={`${t('username')} *`}
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    error={errors.username}
                                    placeholder={t('usernamePlaceholder')}
                                    required
                                    leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                                />

                                <Input
                                    label={t('email')}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                    placeholder={t('emailPlaceholder')}
                                    leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                                />

                                <div className="relative">
                                    <Input
                                        label={`${t('password')} *`}
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
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                                    <GraduationCap className="h-5 w-5 text-yellow-600 mr-2" />
                                    {t('stepAcademicInfo')}
                                </h3>

                                <FormDropdown
                                    label={`${t('grade')} *`}
                                    name="grade"
                                    value={formData.grade}
                                    placeholder={t('gradePlaceholder')}
                                    options={gradeOptions}
                                    onChange={handleInputChange}
                                    error={errors.grade}
                                    required
                                    leftIcon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                                />

                                <Input
                                    label={t('school')}
                                    type="text"
                                    name="school"
                                    value={formData.school}
                                    onChange={handleInputChange}
                                    error={errors.school}
                                    placeholder={t('schoolPlaceholder')}
                                    leftIcon={<School className="h-4 w-4 text-muted-foreground" />}
                                />
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center">
                                    <Phone className="h-5 w-5 text-yellow-600 mr-2" />
                                    {t('stepContactInfo')}
                                </h3>

                                <Input
                                    label={t('studentPhone')}
                                    type="tel"
                                    name="studentPhone"
                                    value={formData.studentPhone}
                                    onChange={handleInputChange}
                                    error={errors.studentPhone}
                                    placeholder={t('studentPhonePlaceholder')}
                                    leftIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                                />

                                <Input
                                    label={t('parentPhone')}
                                    type="tel"
                                    name="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={handleInputChange}
                                    error={errors.parentPhone}
                                    placeholder={t('parentPhonePlaceholder')}
                                    leftIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                                />

                                <div className="space-y-2">
                                    <Checkbox
                                        id="agree-to-terms"
                                        name="agree-to-terms"
                                        checked={formData.agreeToTerms}
                                        onChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
                                        label={
                                            <span className="text-sm text-gray-700">
                                                {t('agreeToTerms')} <Link to="/terms" className="text-yellow-600 hover:underline font-medium">{t('termsOfService')}</Link> và <Link to="/privacy" className="text-yellow-600 hover:underline font-medium">{t('privacyPolicy')}</Link>
                                            </span>
                                        }
                                        size="md"
                                    />
                                    {errors.agreeToTerms && (
                                        <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step Navigation */}
                        <div className="flex justify-between space-x-4">
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    className="flex-1"
                                >
                                    ← {t('previous')}
                                </Button>
                            )}

                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                    className={`bg-yellow-500 hover:bg-yellow-600 ${currentStep === 1 ? 'w-full' : 'flex-1'}`}
                                >
                                    {t('next')} →
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                                    isLoading={isLoading}
                                    disabled={isLoading || !formData.agreeToTerms}
                                >
                                    {t('register')}
                                </Button>
                            )}
                        </div>

                        {/* Google OAuth - Only show on first step */}
                        {currentStep === 1 && (
                            <>
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
                                    onClick={() => {
                                        // Redirect to Google OAuth endpoint for student
                                        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
                                        window.location.href = `${backendUrl}/auth/google/student`;
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    {t('signUpWithGoogle')}
                                </Button>
                            </>
                        )}
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default StudentRegisterPage;