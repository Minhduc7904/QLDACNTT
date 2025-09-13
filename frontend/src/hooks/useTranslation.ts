import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Language } from '../store/slices/languageSlice';

const translations = {
    en: {
        // Auth
        title: 'Sign in to your account',
        createAccount: 'create a new account',
        or: 'Or',
        email: 'Email Address',
        username: 'Username',
        emailPlaceholder: 'Enter your email',
        usernamePlaceholder: 'Enter your username',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        signIn: 'Sign in',
        useUsername: 'Use username instead',
        useEmail: 'Use email instead',
        signInWithGoogle: 'Sign in with Google',
        
        // Admin Login
        adminLogin: 'Admin Portal',
        adminLoginSubtitle: 'Access your administrative dashboard',
        signInAsAdmin: 'Sign in as Administrator',
        loginAsStudent: 'Login as Student →',
        
        // Register
        registerTitle: 'Create your account',
        signUp: 'Sign up',
        fullName: 'Full Name',
        fullNamePlaceholder: 'Enter your full name',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        haveAccount: 'Already have an account?',
        
        // Validation messages
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        invalidEmail: 'Please enter a valid email address',
        
        // Student Registration
        studentRegisterTitle: 'Student Registration',
        studentRegisterSubtitle: 'Join BEE Education - Where learning takes flight!',
        
        // Registration Steps
        stepPersonalInfo: 'Personal',
        stepAcademicInfo: 'Academic', 
        stepContactInfo: 'Contact',
        step: 'Step',
        
        // Step 1 - Personal Info
        firstName: 'First Name',
        firstNamePlaceholder: 'Enter your first name',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Enter your last name',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        genderPlaceholder: 'Select gender',
        male: 'Male',
        female: 'Female',
        other: 'Other',
        
        // Step 2 - Academic Info
        studentId: 'Student ID',
        studentIdPlaceholder: 'Enter your student ID',
        grade: 'Grade',
        gradePlaceholder: 'Select your grade',
        school: 'School',
        schoolPlaceholder: 'Enter your school name',
        
        // Step 3 - Contact Info
        phoneNumber: 'Phone Number',
        phoneNumberPlaceholder: 'Enter your phone number',
        studentPhone: 'Student Phone',
        studentPhonePlaceholder: 'Enter student phone number (optional)',
        address: 'Address',
        addressPlaceholder: 'Enter your address',
        parentName: 'Parent/Guardian Name',
        parentNamePlaceholder: 'Enter parent/guardian name',
        parentPhone: 'Parent/Guardian Phone',
        parentPhonePlaceholder: 'Enter parent/guardian phone',
        agreeToTerms: 'I agree to the',
        termsOfService: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
        
        // Button actions
        previous: 'Previous',
        next: 'Next',
        register: 'Register',
        backToLogin: 'Back to Login',
        signUpWithGoogle: 'Sign up with Google',
        
        // Validation messages for registration
        firstNameRequired: 'First name is required',
        lastNameRequired: 'Last name is required',
        dateOfBirthRequired: 'Date of birth is required',
        genderRequired: 'Gender is required',
        studentIdRequired: 'Student ID is required',
        gradeRequired: 'Grade is required',
        schoolRequired: 'School name is required',
        phoneRequired: 'Phone number is required',
        addressRequired: 'Address is required',
        parentNameRequired: 'Parent/Guardian name is required',
        parentPhoneRequired: 'Parent/Guardian phone is required',
        agreeToTermsRequired: 'You must agree to the terms of service',
        invalidPhoneNumber: 'Invalid phone number',
        passwordMinLength: 'Password must be at least 6 characters',
        
        // HomePage
        welcomeToLearning: 'Welcome to BEE Education',
        learningPlatformDescription: 'Discover knowledge through our interactive classes and practice exams. BEE Education - Where learning takes flight!',
        getStarted: 'Get Started',
        availableClasses: 'Available Classes',
        practiceExams: 'Practice Exams',
        viewAll: 'View All',
        currentLanguage: 'en',
        students: 'students',
        joinClass: 'Join Class',
        duration: 'Duration',
        minutes: 'minutes',
        questions: 'Questions',
        attempts: 'Attempts',
        takeExam: 'Take Exam',
        readyToStart: 'Ready to Start Learning?',
        joinThousands: 'Join thousands of students who are already advancing their skills with BEE Education comprehensive learning platform.',
        signUpNow: 'Sign Up Now',
        beeEducation: 'BEE Education',
        tagline: 'Where Learning Takes Flight!',
        
        // Header & Navigation
        overview: 'Overview',
        classes: 'Classes',
        exams: 'Exams',
        profile: 'Profile',
        settings: 'Settings',
        logout: 'Logout',
        student: 'Student',
        admin: 'Admin',
        welcomeBack: 'Welcome back',
        
        // Profile Page
        studentProfile: 'Student Profile',
        personalInfo: 'Personal Information',
        accountInfo: 'Account Info',
        profileDetails: 'Profile Details',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        profileNotFound: 'Profile not found',
        backToDashboard: 'Back to Dashboard',
        manageProfile: 'Manage your personal information and account settings',
        studentIdLabel: 'Student ID',
        joined: 'Joined',
        status: 'Status',
        active: 'Active',
        inactive: 'Inactive',
        profileUpdateSuccess: 'Profile updated successfully!',
        verificationEmailSent: 'Verification email sent successfully!',
        verificationEmailFailed: 'Failed to send verification email',
        verifyEmail: 'Verify Email',
        emailNotVerified: 'Email not verified',
        emailVerificationSuccess: 'Email Verification Successful',
        emailVerificationFailed: 'Email Verification Failed',
        emailVerificationSuccessNote: 'Your email has been successfully verified. You can now access all features.',
        emailVerificationFailedNote: 'Please try requesting a new verification email or contact support if the problem persists.',
        avatarUpdated: 'Avatar updated successfully!',
        avatarUpdateFailed: 'Failed to update avatar',
        goToProfile: 'Go to Profile',
        goToLogin: 'Go to Login',
        goBack: 'Go Back',
        userNotFound: 'User not found',
        saving: 'Saving...',
        success: 'Success',
        error: 'Error',
    },
    vi: {
        // Auth
        title: 'Đăng nhập tài khoản',
        createAccount: 'tạo tài khoản mới',
        or: 'Hoặc',
        email: 'Địa chỉ Email',
        username: 'Tên đăng nhập',
        emailPlaceholder: 'Nhập email của bạn',
        usernamePlaceholder: 'Nhập tên đăng nhập',
        password: 'Mật khẩu',
        passwordPlaceholder: 'Nhập mật khẩu của bạn',
        rememberMe: 'Ghi nhớ đăng nhập',
        forgotPassword: 'Quên mật khẩu?',
        signIn: 'Đăng nhập',
        useUsername: 'Dùng tên đăng nhập',
        useEmail: 'Dùng email',
        signInWithGoogle: 'Đăng nhập với Google',
        
        // Admin Login
        adminLogin: 'Cổng Quản trị',
        adminLoginSubtitle: 'Truy cập bảng điều khiển quản trị viên',
        signInAsAdmin: 'Đăng nhập với tư cách Quản trị viên',
        loginAsStudent: 'Đăng nhập như Học sinh →',
        
        // Register
        registerTitle: 'Tạo tài khoản mới',
        signUp: 'Đăng ký',
        fullName: 'Họ và tên',
        fullNamePlaceholder: 'Nhập họ và tên',
        confirmPassword: 'Xác nhận mật khẩu',
        confirmPasswordPlaceholder: 'Xác nhận mật khẩu của bạn',
        haveAccount: 'Đã có tài khoản?',
        
        // Validation messages
        emailRequired: 'Email là bắt buộc',
        passwordRequired: 'Mật khẩu là bắt buộc',
        invalidEmail: 'Vui lòng nhập địa chỉ email hợp lệ',
        
        // Student Registration
        studentRegisterTitle: 'Đăng ký Học sinh',
        studentRegisterSubtitle: 'Tham gia BEE Education - Nơi việc học cất cánh!',
        
        // Registration Steps
        stepPersonalInfo: 'Cá nhân',
        stepAcademicInfo: 'Học tập', 
        stepContactInfo: 'Liên lạc',
        step: 'Bước',
        
        // Step 1 - Personal Info
        firstName: 'Tên',
        firstNamePlaceholder: 'Nhập tên của bạn',
        lastName: 'Họ và tên đệm',
        lastNamePlaceholder: 'Nhập họ và tên đệm',
        dateOfBirth: 'Ngày sinh',
        gender: 'Giới tính',
        genderPlaceholder: 'Chọn giới tính',
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác',
        
        // Step 2 - Academic Info
        studentId: 'Mã học sinh',
        studentIdPlaceholder: 'Nhập mã học sinh',
        grade: 'Khối lớp',
        gradePlaceholder: 'Chọn khối lớp',
        school: 'Trường học',
        schoolPlaceholder: 'Nhập tên trường học',
        
        // Step 3 - Contact Info
        phoneNumber: 'Số điện thoại',
        phoneNumberPlaceholder: 'Nhập số điện thoại',
        studentPhone: 'Số điện thoại học sinh',
        studentPhonePlaceholder: 'Nhập số điện thoại (tùy chọn)',
        address: 'Địa chỉ',
        addressPlaceholder: 'Nhập địa chỉ',
        parentName: 'Tên phụ huynh',
        parentNamePlaceholder: 'Nhập tên phụ huynh',
        parentPhone: 'SĐT phụ huynh',
        parentPhonePlaceholder: 'Nhập SĐT phụ huynh (tùy chọn)',
        agreeToTerms: 'Tôi đồng ý với',
        termsOfService: 'Điều khoản dịch vụ',
        privacyPolicy: 'Chính sách bảo mật',
        
        // Button actions
        previous: 'Trước',
        next: 'Tiếp theo',
        register: 'Đăng ký',
        backToLogin: 'Về trang đăng nhập',
        signUpWithGoogle: 'Đăng ký nhanh bằng Google',
        
        // Validation messages for registration
        firstNameRequired: 'Tên là bắt buộc',
        lastNameRequired: 'Họ và tên đệm là bắt buộc',
        dateOfBirthRequired: 'Ngày sinh là bắt buộc',
        genderRequired: 'Giới tính là bắt buộc',
        studentIdRequired: 'Mã học sinh là bắt buộc',
        gradeRequired: 'Khối lớp là bắt buộc',
        schoolRequired: 'Tên trường là bắt buộc',
        phoneRequired: 'Số điện thoại là bắt buộc',
        addressRequired: 'Địa chỉ là bắt buộc',
        parentNameRequired: 'Tên phụ huynh là bắt buộc',
        parentPhoneRequired: 'SĐT phụ huynh là bắt buộc',
        agreeToTermsRequired: 'Bạn phải đồng ý với điều khoản dịch vụ',
        invalidPhoneNumber: 'Số điện thoại không hợp lệ',
        passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',
        
        // HomePage
        welcomeToLearning: 'Chào mừng đến với BEE Education',
        learningPlatformDescription: 'Khám phá kiến thức thông qua các lớp học tương tác và bài thi thực hành. BEE Education - Nơi việc học cất cánh!',
        getStarted: 'Bắt đầu',
        availableClasses: 'Các lớp học có sẵn',
        practiceExams: 'Bài thi thực hành',
        viewAll: 'Xem tất cả',
        currentLanguage: 'vi',
        students: 'học sinh',
        joinClass: 'Tham gia lớp',
        duration: 'Thời lượng',
        minutes: 'phút',
        questions: 'Câu hỏi',
        attempts: 'Lượt thi',
        takeExam: 'Làm bài thi',
        readyToStart: 'Sẵn sàng bắt đầu học?',
        joinThousands: 'Tham gia cùng hàng nghìn học sinh đã và đang nâng cao kỹ năng với nền tảng học tập toàn diện của BEE Education.',
        signUpNow: 'Đăng ký ngay',
        beeEducation: 'BEE Education',
        tagline: 'Nơi việc học cất cánh!',
        
        // Header & Navigation
        overview: 'Tổng quan',
        classes: 'Lớp học',
        exams: 'Đề thi',
        profile: 'Hồ sơ',
        settings: 'Cài đặt',
        logout: 'Đăng xuất',
        student: 'Học sinh',
        admin: 'Quản trị',
        welcomeBack: 'Chào mừng trở lại',
        
        // Profile Page
        studentProfile: 'Hồ sơ Học sinh',
        personalInfo: 'Thông tin cá nhân',
        accountInfo: 'Thông tin tài khoản',
        profileDetails: 'Thông tin chi tiết',
        edit: 'Chỉnh sửa',
        save: 'Lưu',
        cancel: 'Hủy',
        profileNotFound: 'Không tìm thấy thông tin',
        backToDashboard: 'Về Dashboard',
        manageProfile: 'Quản lý thông tin cá nhân và cài đặt tài khoản của bạn',
        studentIdLabel: 'ID Học sinh',
        joined: 'Tham gia',
        status: 'Trạng thái',
        active: 'Hoạt động',
        inactive: 'Không hoạt động',
        profileUpdateSuccess: 'Cập nhật thông tin thành công!',
        verificationEmailSent: 'Gửi email xác thực thành công!',
        verificationEmailFailed: 'Gửi email xác thực thất bại',
        verifyEmail: 'Xác thực Email',
        emailNotVerified: 'Email chưa được xác thực',
        emailVerificationSuccess: 'Xác Thực Email Thành Công',
        emailVerificationFailed: 'Xác Thực Email Thất Bại',
        emailVerificationSuccessNote: 'Email của bạn đã được xác thực thành công. Bây giờ bạn có thể truy cập tất cả các tính năng.',
        emailVerificationFailedNote: 'Vui lòng thử yêu cầu email xác thực mới hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.',
        avatarUpdated: 'Avatar đã được cập nhật thành công!',
        avatarUpdateFailed: 'Cập nhật avatar thất bại',
        goToProfile: 'Đi đến Hồ sơ',
        goToLogin: 'Đi đến Đăng nhập',
        goBack: 'Quay lại',
        userNotFound: 'Không tìm thấy người dùng',
        saving: 'Đang lưu...',
        success: 'Thành công',
        error: 'Lỗi',
    },
};

export const useTranslation = () => {
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
    
    const t = (key: keyof typeof translations.en): string => {
        return translations[currentLanguage][key] || translations.en[key] || key;
    };

    return { t, currentLanguage };
};

export type TranslationKey = keyof typeof translations.en;
