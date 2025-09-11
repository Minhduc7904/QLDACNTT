import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationState } from '../../types';

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                duration: action.payload.duration || 4000,
                autoHide: action.payload.autoHide !== false, // default true
            };
            state.notifications.push(notification);
        },

        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },

        clearAllNotifications: (state) => {
            state.notifications = [];
        },

        // Helper actions for different types
        addSuccessNotification: (state, action: PayloadAction<{ message: string; title?: string; duration?: number }>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'success',
                duration: action.payload.duration || 4000,
                autoHide: true,
            };
            state.notifications.push(notification);
        },

        addErrorNotification: (state, action: PayloadAction<{ message: string; title?: string; duration?: number }>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'error',
                duration: action.payload.duration || 5000, // Error notifications last longer
                autoHide: true,
            };
            state.notifications.push(notification);
        },

        addWarningNotification: (state, action: PayloadAction<{ message: string; title?: string; duration?: number }>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'warning',
                duration: action.payload.duration || 4000,
                autoHide: true,
            };
            state.notifications.push(notification);
        },

        addInfoNotification: (state, action: PayloadAction<{ message: string; title?: string; duration?: number }>) => {
            const notification: Notification = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                type: 'info',
                duration: action.payload.duration || 4000,
                autoHide: true,
            };
            state.notifications.push(notification);
        },
    },
});

export const {
    addNotification,
    removeNotification,
    clearAllNotifications,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
