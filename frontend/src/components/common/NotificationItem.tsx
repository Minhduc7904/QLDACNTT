import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Notification } from '../../types';
import { removeNotification } from '../../store/slices/notificationSlice';

interface NotificationItemProps {
    notification: Notification;
    index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, index }) => {
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Animate in
        const timer = setTimeout(() => setIsVisible(true), 50 + index * 100);
        
        // Auto remove
        if (notification.autoHide) {
            const removeTimer = setTimeout(() => {
                handleRemove();
            }, notification.duration || 4000);
            
            return () => {
                clearTimeout(timer);
                clearTimeout(removeTimer);
            };
        }
        
        return () => clearTimeout(timer);
    }, [notification.autoHide, notification.duration, index]);

    const handleRemove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            dispatch(removeNotification(notification.id));
        }, 300); // Match animation duration
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'info':
            default:
                return <Info className="h-5 w-5 text-blue-600" />;
        }
    };

    const getColorClasses = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div
            className={`transform transition-all duration-300 ease-in-out mb-3 ${
                isVisible && !isRemoving
                    ? 'translate-x-0 opacity-100'
                    : isRemoving
                    ? 'translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
            }`}
            style={{
                transitionDelay: isRemoving ? '0ms' : `${index * 50}ms`,
            }}
        >
            <div
                className={` w-[20rem] bg-white shadow-lg rounded-lg border pointer-events-auto ${getColorClasses()}`}
            >
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {getIcon()}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                            {notification.title && (
                                <p className="text-sm font-medium">
                                    {notification.title}
                                </p>
                            )}
                            <p className={`text-sm ${notification.title ? 'mt-1' : ''}`}>
                                {notification.message}
                            </p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationItem;
