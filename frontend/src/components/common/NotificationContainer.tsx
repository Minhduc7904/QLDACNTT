import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import NotificationItem from './NotificationItem';

const NotificationContainer: React.FC = () => {
    const notifications = useSelector((state: RootState) => state.notification.notifications);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div
            className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
        >
            <div className="flex flex-col-reverse max-h-full overflow-hidden">
                {notifications.map((notification, index) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotificationContainer;
