import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth, useTranslation } from '../hooks';
import { Card, LoadingSpinner, Header } from '../components';
import { BeeLogoBrand } from '../components/common';
import { initializeLanguage } from '../store/slices/languageSlice';

const DashboardPage: React.FC = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useAuth();
    const { t } = useTranslation();

    useEffect(() => {
        // Khởi tạo ngôn ngữ từ localStorage khi component mount
        dispatch(initializeLanguage());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <BeeLogoBrand size="lg" showPlatform={false} className="mb-4" iconVariant="outline" />
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            {t('overview')}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {t('welcomeBack')}, {user?.fullName || 'User'}!
                        </p>
                    </div>
                </div>

                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="px-4 py-8 sm:px-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Stats Cards */}
                                <Card>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                                            <p className="text-2xl font-semibold text-gray-900">2,432</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Revenue</p>
                                            <p className="text-2xl font-semibold text-gray-900">$24,563</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500">Orders</p>
                                            <p className="text-2xl font-semibold text-gray-900">1,423</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <div className="mt-8">
                                <Card>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((item) => (
                                            <div key={item} className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        User performed an action
                                                    </p>
                                                    <p className="text-sm text-gray-500">2 minutes ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
