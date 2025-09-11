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
