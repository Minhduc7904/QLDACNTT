import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, LanguageToggle, Button } from '../components';
import { BeeIcon, BeeLogoBrand } from '../components/common';
import { useTranslation } from '../hooks';
import { BookOpen, FileText, Users, Clock, Star, ChevronRight } from 'lucide-react';
import { initializeLanguage } from '../store/slices/languageSlice';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, currentLanguage } = useTranslation();

    // Mock data for classes and exams
    const [classes] = useState([
        {
            id: 1,
            name: 'Toán học cơ bản',
            nameEn: 'Basic Mathematics',
            instructor: 'Nguyễn Văn A',
            students: 45,
            duration: '3 tháng',
            durationEn: '3 months',
            level: 'Cơ bản',
            levelEn: 'Basic',
            image: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400'
        },
        {
            id: 2,
            name: 'Tiếng Anh giao tiếp',
            nameEn: 'English Communication',
            instructor: 'Trần Thị B',
            students: 32,
            duration: '4 tháng',
            durationEn: '4 months',
            level: 'Trung cấp',
            levelEn: 'Intermediate',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
        },
        {
            id: 3,
            name: 'Lập trình JavaScript',
            nameEn: 'JavaScript Programming',
            instructor: 'Lê Văn C',
            students: 28,
            duration: '6 tháng',
            durationEn: '6 months',
            level: 'Nâng cao',
            levelEn: 'Advanced',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
        }
    ]);

    const [exams] = useState([
        {
            id: 1,
            title: 'Kiểm tra Toán học - Chương 1',
            titleEn: 'Mathematics Test - Chapter 1',
            subject: 'Toán học',
            subjectEn: 'Mathematics',
            duration: 60,
            questions: 30,
            difficulty: 'Dễ',
            difficultyEn: 'Easy',
            attempts: 156
        },
        {
            id: 2,
            title: 'Bài thi Tiếng Anh - Ngữ pháp',
            titleEn: 'English Test - Grammar',
            subject: 'Tiếng Anh',
            subjectEn: 'English',
            duration: 45,
            questions: 25,
            difficulty: 'Trung bình',
            difficultyEn: 'Medium',
            attempts: 89
        },
        {
            id: 3,
            title: 'Thực hành JavaScript - Functions',
            titleEn: 'JavaScript Practice - Functions',
            subject: 'Lập trình',
            subjectEn: 'Programming',
            duration: 90,
            questions: 20,
            difficulty: 'Khó',
            difficultyEn: 'Hard',
            attempts: 67
        }
    ]);

    useEffect(() => {
        // Khởi tạo ngôn ngữ từ localStorage khi component mount
        dispatch(initializeLanguage());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">
            <LanguageToggle />
            
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    {/* BEE Logo */}
                    <div className="flex justify-center mb-6">
                        <BeeLogoBrand size="xl" showPlatform={false} iconVariant="hexagon" />
                        <div className="ml-4 text-left flex items-center">
                            <span className="text-lg text-gray-600 font-medium">Education</span>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {t('welcomeToLearning')}
                    </h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('learningPlatformDescription')}
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Button 
                            onClick={() => navigate('/login')}
                            className="px-8 py-3"
                        >
                            {t('getStarted')}
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => navigate('/register')}
                            className="px-8 py-3"
                        >
                            {t('createAccount')}
                        </Button>
                    </div>
                </div>

                {/* Classes Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            <BookOpen className="inline-block w-8 h-8 mr-3 text-blue-600" />
                            {t('availableClasses')}
                        </h2>
                        <Link 
                            to="/classes" 
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                            {t('viewAll')} <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((classItem) => (
                            <Card key={classItem.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                <div className="relative">
                                    <img 
                                        src={classItem.image} 
                                        alt={classItem.name}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                                        {currentLanguage === 'vi' ? classItem.level : classItem.levelEn}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {currentLanguage === 'vi' ? classItem.name : classItem.nameEn}
                                    </h3>
                                    <p className="text-gray-600 mb-4">{classItem.instructor}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Users className="w-4 h-4 mr-1" />
                                            {classItem.students} {t('students')}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {currentLanguage === 'vi' ? classItem.duration : classItem.durationEn}
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full mt-4"
                                        onClick={() => navigate(`/classes/${classItem.id}`)}
                                    >
                                        {t('joinClass')}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Exams Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">
                            <FileText className="inline-block w-8 h-8 mr-3 text-green-600" />
                            {t('practiceExams')}
                        </h2>
                        <Link 
                            to="/exams" 
                            className="text-green-600 hover:text-green-800 font-medium flex items-center"
                        >
                            {t('viewAll')} <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <Card key={exam.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {currentLanguage === 'vi' ? exam.title : exam.titleEn}
                                            </h3>
                                            <p className="text-blue-600 font-medium text-sm">
                                                {currentLanguage === 'vi' ? exam.subject : exam.subjectEn}
                                            </p>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            exam.difficulty === 'Dễ' || exam.difficultyEn === 'Easy' 
                                                ? 'bg-green-100 text-green-800'
                                                : exam.difficulty === 'Trung bình' || exam.difficultyEn === 'Medium'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {currentLanguage === 'vi' ? exam.difficulty : exam.difficultyEn}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center justify-between">
                                            <span>{t('duration')}:</span>
                                            <span>{exam.duration} {t('minutes')}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>{t('questions')}:</span>
                                            <span>{exam.questions}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>{t('attempts')}:</span>
                                            <span className="flex items-center">
                                                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                                {exam.attempts}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate(`/exams/${exam.id}`)}
                                    >
                                        {t('takeExam')}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 shadow-sm border border-yellow-200">
                    <div className="flex justify-center items-center mb-4">
                        <BeeIcon size="md" className="mr-3" variant="solid" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            {t('readyToStart')}
                        </h2>
                    </div>
                    <p className="text-gray-700 mb-2 text-lg font-medium">
                        {t('beeEducation')} - {t('tagline')}
                    </p>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        {t('joinThousands')}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button 
                            size="lg"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                            onClick={() => navigate('/register')}
                        >
                            {t('signUpNow')}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                            onClick={() => navigate('/login')}
                        >
                            {t('signIn')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
