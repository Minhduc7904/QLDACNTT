import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, FormDropdown, LoadingSpinner, Avatar } from '../components';
import { useStudent, useStudentAuth, useTranslation, useNotification } from '../hooks';
import { authStudentService, studentService } from '../services';
import { validateRequired, isValidEmail } from '../utils';
import { User, Mail, Phone, School, GraduationCap, Shield, Camera, Edit3, Save, X, MailCheck } from 'lucide-react';
import StudentPageLayout from '../layout/StudentPageLayout';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    studentPhone: string;
    parentPhone: string;
    grade: number;
    school: string;
}

const StudentProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, isLoading, isUpdating, fetchProfile, updateProfile, updateProfileAvatar } = useStudent();
    const { user: authUser, updateAvatarStudent } = useStudentAuth();
    const { t } = useTranslation();
    const { showSuccess, showError } = useNotification();
    const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        email: '',
        studentPhone: '',
        parentPhone: '',
        grade: 6,
        school: '',
    });
    const [originalData, setOriginalData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        email: '',
        studentPhone: '',
        parentPhone: '',
        grade: 6,
        school: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Grade options from 6 to 12
    const gradeOptions = Array.from({ length: 7 }, (_, i) => ({
        key: (i + 6).toString(),
        value: (i + 6).toString(),
        label: `Lớp ${i + 6}`
    }));

    // Load profile data on component mount
    useEffect(() => {
        if (authUser?.studentId) {
            fetchProfile(authUser.studentId.toString());
        }
    }, [authUser?.studentId]);

    // Update form data when profile is loaded
    useEffect(() => {
        if (profile) {
            const data = {
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                studentPhone: profile.studentPhone || '',
                parentPhone: profile.parentPhone || '',
                grade: profile.grade || 6,
                school: profile.school || '',
            };
            setFormData(data);
            setOriginalData(data);
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: string } }) => {
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

        const firstNameError = validateRequired(formData.firstName, t('firstName'));
        if (firstNameError) {
            newErrors.firstName = firstNameError;
        }

        const lastNameError = validateRequired(formData.lastName, t('lastName'));
        if (lastNameError) {
            newErrors.lastName = lastNameError;
        }

        if (formData.email && !isValidEmail(formData.email)) {
            newErrors.email = t('invalidEmail');
        }

        const gradeError = validateRequired(formData.grade.toString(), t('grade'));
        if (gradeError) {
            newErrors.grade = gradeError;
        }

        // Phone number validation
        if (formData.studentPhone && !isValidPhoneNumber(formData.studentPhone)) {
            newErrors.studentPhone = t('invalidPhoneNumber');
        }

        if (formData.parentPhone && !isValidPhoneNumber(formData.parentPhone)) {
            newErrors.parentPhone = t('invalidPhoneNumber');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidPhoneNumber = (phone: string): boolean => {
        // Vietnamese phone number regex
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        return phoneRegex.test(phone);
    };

    // Check if there are any changes
    const hasChanges = (): boolean => {
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    };

    // Handle verify email
    const handleVerifyEmail = async () => {
        try {
            if (!authUser?.userId) {
                showError(t('userNotFound'), t('error'));
                return;
            }

            const response = await authStudentService.sendVerificationEmail(authUser.userId);

            if (response.success) {
                showSuccess(t('verificationEmailSent'), t('success'));
            } else {
                showError(response.message || t('verificationEmailFailed'), t('error'));
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            showError(t('verificationEmailFailed'), t('error'));
        }
    };

    const handleSave = async () => {
        if (validateForm() && authUser?.studentId) {
            try {
                const response = await updateProfile(authUser.studentId.toString(), formData);

                // Kiểm tra xem thunk có thành công không
                if (response.meta.requestStatus === 'fulfilled') {
                    // Chỉ update state khi thành công
                    setOriginalData(formData);
                    setIsEditing(false);
                }
                // Nếu rejected, thunk đã handle error message, không cần làm gì thêm
            } catch (error) {
                // Handle unexpected errors
                console.error('Unexpected error in handleSave:', error);
            }
        }
    }

    const handleCancel = () => {
        // Reset form data to original profile data
        setFormData(originalData);
        setErrors({});
        setIsEditing(false);
    };

    // Handle avatar file selection and auto upload
    const handleAvatarFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                showError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)', t('error'));
                return;
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                showError('Kích thước file không được vượt quá 5MB', t('error'));
                return;
            }

            // Auto upload the file immediately after selection
            try {
                setIsUpdatingAvatar(true);
                const response = await studentService.updateAvatar(file);


                if (response.success) {
                    const image = {
                       imageId: response.data.imageId,
                        url: response.data.avatarUrl,
                    }
                    showSuccess(t('avatarUpdated'), t('success'));
                    updateProfileAvatar(image);
                    updateAvatarStudent(image);
                } else {
                    showError(response.message || t('avatarUpdateFailed'), t('error'));
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
            setIsUpdatingAvatar(false);
        }
        // Reset input value to allow selecting the same file again
        event.target.value = '';
    };

    // Handle avatar upload button click
    const handleAvatarButtonClick = () => {
        const fileInput = document.getElementById('avatar-file-input') as HTMLInputElement;
        fileInput?.click();
    };

    if (isLoading) {
        return (
            <StudentPageLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </StudentPageLayout>
        );
    }

    if (!profile) {
        return (
            <StudentPageLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Card className="p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            {t('profileNotFound')}
                        </h2>
                        <Button onClick={() => navigate('/dashboard')} variant="outline">
                            {t('backToDashboard')}
                        </Button>
                    </Card>
                </div>
            </StudentPageLayout>
        );
    }

    return (
        <StudentPageLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {t('studentProfile')}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {t('manageProfile')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 text-center">
                            <div className="relative inline-block">
                                <Avatar
                                    imageUrl={profile.imageUrls?.url}
                                    altImageUrl={profile.imageUrls?.anotherUrl}
                                    firstName={profile.firstName}
                                    lastName={profile.lastName}
                                    fullName={profile.fullName}
                                    size="xl"
                                    className="mx-auto mb-4 shadow-lg"
                                />
                                <button
                                    onClick={handleAvatarButtonClick}
                                    disabled={isUpdatingAvatar}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
                                    title={isUpdatingAvatar ? 'Đang cập nhật avatar...' : 'Thay đổi avatar'}
                                >
                                    {isUpdatingAvatar ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Camera className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Hidden file input */}
                                <input
                                    id="avatar-file-input"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleAvatarFileSelect}
                                    className="hidden"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{profile.fullName}</h3>
                            <p className="text-sm text-gray-500 mt-1">@{profile.username}</p>
                            <p className="text-sm text-yellow-600 mt-2 font-medium">
                                {t('currentLanguage') === 'vi' ? `Lớp ${profile.grade}` : `Grade ${profile.grade}`}
                            </p>
                        </Card>

                        {/* Quick Info */}
                        <Card className="p-6 mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                                {t('accountInfo')}
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        {t('studentIdLabel')}:
                                    </span>
                                    <span className="font-medium">#{profile.studentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        {t('joined')}:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(profile.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        {t('status')}:
                                    </span>
                                    <span className={`font-medium ${profile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                        {profile.isActive ? t('active') : t('inactive')}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Profile Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {t('profileDetails')}
                                </h2>
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        {t('edit')}
                                    </Button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={handleSave}
                                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            disabled={!hasChanges() || isUpdating}
                                        >
                                            {isUpdating ? (
                                                <LoadingSpinner size="sm" className="mr-2" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            {isUpdating ? t('saving') : t('save')}
                                        </Button>
                                        <Button
                                            onClick={handleCancel}
                                            variant="outline"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            {t('cancel')}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                        <User className="h-5 w-5 text-yellow-600 mr-2" />
                                        {t('stepPersonalInfo')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label={`${t('firstName')} *`}
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            error={errors.firstName}
                                            disabled={!isEditing}
                                            leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                                        />
                                        <Input
                                            label={`${t('lastName')} *`}
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            error={errors.lastName}
                                            disabled={!isEditing}
                                            leftIcon={<User className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Input
                                            label={t('email')}
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            error={errors.email}
                                            disabled={!isEditing}
                                            leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                                            rightIcon={
                                                profile?.email && profile?.isEmailVerified && !isEditing ? (
                                                    <MailCheck className="h-4 w-4 text-green-600" />
                                                ) : null
                                            }
                                        />
                                        {/* Email Verification - Only show when not editing */}
                                        {profile?.email && !profile?.isEmailVerified && !isEditing && (
                                            <div className="mt-3 flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-yellow-600" />
                                                    <span className="text-sm text-yellow-700">
                                                        {t('emailNotVerified')}
                                                    </span>
                                                </div>
                                                <Button
                                                    onClick={handleVerifyEmail}
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                                                >
                                                    <MailCheck className="h-4 w-4 mr-2" />
                                                    {t('verifyEmail')}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Academic Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                        <GraduationCap className="h-5 w-5 text-yellow-600 mr-2" />
                                        {t('stepAcademicInfo')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormDropdown
                                            label={`${t('grade')} *`}
                                            name="grade"
                                            value={formData.grade.toString()}
                                            placeholder={t('gradePlaceholder')}
                                            options={gradeOptions}
                                            onChange={handleInputChange}
                                            error={errors.grade}
                                            disabled={!isEditing}
                                            leftIcon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                                        />
                                        <Input
                                            label={t('school')}
                                            type="text"
                                            name="school"
                                            value={formData.school}
                                            onChange={handleInputChange}
                                            error={errors.school}
                                            disabled={!isEditing}
                                            leftIcon={<School className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                                        <Phone className="h-5 w-5 text-yellow-600 mr-2" />
                                        {t('stepContactInfo')}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label={t('studentPhone')}
                                            type="tel"
                                            name="studentPhone"
                                            value={formData.studentPhone}
                                            onChange={handleInputChange}
                                            error={errors.studentPhone}
                                            disabled={!isEditing}
                                            leftIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                                        />
                                        <Input
                                            label={t('parentPhone')}
                                            type="tel"
                                            name="parentPhone"
                                            value={formData.parentPhone}
                                            onChange={handleInputChange}
                                            error={errors.parentPhone}
                                            disabled={!isEditing}
                                            leftIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </StudentPageLayout>
    );
};

export default StudentProfilePage;