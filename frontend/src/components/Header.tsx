import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BookOpen, FileText, BarChart3, LogOut, User, ChevronDown, Settings, Globe } from 'lucide-react';
import { useAuth, useTranslation } from '../hooks';
import { clearAuth } from '../store/slices/authSlice';
import { setLanguage } from '../store/slices/languageSlice';
import { ClickOutside, NavLink, BeeLogoBrand } from './common';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { t, currentLanguage } = useTranslation();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        dispatch(clearAuth());
        navigate('/login');
    };

    const toggleLanguage = () => {
        const newLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
        dispatch(setLanguage(newLanguage));
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* Left Side - BEE Platform Logo */}
                    <div className="flex-1">
                        <Link to="/dashboard" className="w-fit">
                            <BeeLogoBrand size="md" iconVariant="gradient" />
                        </Link>
                    </div>

                    {/* Center - Navigation Links */}
                    <nav className="hidden md:flex flex-1 justify-center">
                        <div className="flex space-x-2">
                            <NavLink 
                                to="/dashboard"
                                icon={BarChart3}
                                label={t('overview')}
                            />

                            <NavLink 
                                to="/classes"
                                icon={BookOpen}
                                label={t('classes')}
                            />

                            <NavLink 
                                to="/exams"
                                icon={FileText}
                                label={t('exams')}
                            />
                        </div>
                    </nav>

                    {/* Right Side - Language Toggle & User Menu */}
                    <div className="flex-1 flex items-center justify-end space-x-4">
                        {/* Language Toggle Button */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
                        >
                            <Globe className="w-4 h-4" />
                            <span>{currentLanguage === 'vi' ? 'EN' : 'VI'}</span>
                        </button>

                        {/* User Menu */}
                        <ClickOutside onClickOutside={() => setShowUserMenu(false)} className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {/* User Avatar */}
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name || 'User'}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-4 h-4 text-gray-600" />
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>

                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                        <p className="text-xs text-yellow-600 font-medium mt-1">
                                            {t('student')}
                                        </p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{t('profile')}</span>
                                    </Link>

                                    <Link
                                        to="/settings"
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>{t('settings')}</span>
                                    </Link>

                                    <hr className="my-2" />

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{t('logout')}</span>
                                    </button>
                                </div>
                            )}
                        </ClickOutside>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden border-t border-gray-200">
                <nav className="px-4 py-3 space-y-2">
                    <NavLink 
                        to="/dashboard"
                        icon={BarChart3}
                        label={t('overview')}
                        className="w-full justify-start"
                    />

                    <NavLink 
                        to="/classes"
                        icon={BookOpen}
                        label={t('classes')}
                        className="w-full justify-start"
                    />

                    <NavLink 
                        to="/exams"
                        icon={FileText}
                        label={t('exams')}
                        className="w-full justify-start"
                    />
                </nav>
            </div>
        </header>
    );
};

export default Header;
