import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card } from '../components';
import { useTranslation } from '../hooks';
import { CheckCircle, XCircle, User, ArrowLeft } from 'lucide-react';

const EmailVerificationResultPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();

    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const successMessage = searchParams.get('message');

        if (success === 'true') {
            setIsSuccess(true);
            setMessage(successMessage || t('emailVerificationSuccess'));
        } else if (error) {
            setIsSuccess(false);
            setMessage(decodeURIComponent(error));
        } else {
            // Không có parameters, redirect về login
            navigate('/student/login');
        }
    }, [searchParams, navigate, t]);

    const handleGoToProfile = () => {
        navigate('/student/profile');
    };

    const handleGoToLogin = () => {
        navigate('/student/login');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isSuccess === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <Card className="p-8 text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        {isSuccess ? (
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {isSuccess ? t('emailVerificationSuccess') : t('emailVerificationFailed')}
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="space-y-3">
                        {isSuccess ? (
                            <>
                                <Button
                                    onClick={handleGoToProfile}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    {t('goToProfile')}
                                </Button>
                                <Button
                                    onClick={handleGoToLogin}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {t('goToLogin')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleGoToLogin}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                                >
                                    {t('goToLogin')}
                                </Button>
                                <Button
                                    onClick={handleGoBack}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t('goBack')}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Additional Info for Success */}
                    {isSuccess && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">
                                {t('emailVerificationSuccessNote')}
                            </p>
                        </div>
                    )}

                    {/* Additional Info for Error */}
                    {!isSuccess && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                                {t('emailVerificationFailedNote')}
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EmailVerificationResultPage;