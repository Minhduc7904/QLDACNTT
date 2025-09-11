import { useDispatch } from 'react-redux';
import {
    addNotification,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
    removeNotification,
    clearAllNotifications,
} from '../store/slices/notificationSlice';
import { Notification } from '../types';

export const useNotification = () => {
    const dispatch = useDispatch();

    const showNotification = (notification: Omit<Notification, 'id'>) => {
        dispatch(addNotification(notification));
    };

    const showSuccess = (message: string, title?: string, duration?: number) => {
        dispatch(addSuccessNotification({ message, title, duration }));
    };

    const showError = (message: string, title?: string, duration?: number) => {
        dispatch(addErrorNotification({ message, title, duration }));
    };

    const showWarning = (message: string, title?: string, duration?: number) => {
        dispatch(addWarningNotification({ message, title, duration }));
    };

    const showInfo = (message: string, title?: string, duration?: number) => {
        dispatch(addInfoNotification({ message, title, duration }));
    };

    const hideNotification = (id: string) => {
        dispatch(removeNotification(id));
    };

    const clearAll = () => {
        dispatch(clearAllNotifications());
    };

    return {
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        hideNotification,
        clearAll,
    };
};
