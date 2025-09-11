export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number; // milliseconds, default 4000ms
    autoHide?: boolean; // default true
}

export interface NotificationState {
    notifications: Notification[];
}
