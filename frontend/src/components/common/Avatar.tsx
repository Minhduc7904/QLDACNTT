import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
    imageUrl?: string;
    altImageUrl?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showFallback?: boolean;
}

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-32 h-32 text-4xl'
};

const Avatar: React.FC<AvatarProps> = ({
    imageUrl,
    altImageUrl,
    firstName = '',
    lastName = '',
    fullName = '',
    size = 'md',
    className = '',
    showFallback = true
}) => {
    const displayImageUrl = imageUrl || altImageUrl;
    
    // Generate initials from firstName + lastName or fallback to fullName
    const getInitials = () => {
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }
        if (fullName) {
            const names = fullName.split(' ');
            if (names.length >= 2) {
                return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
            }
            return fullName.charAt(0).toUpperCase();
        }
        return '';
    };

    const initials = getInitials();
    const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-bold`;

    if (displayImageUrl) {
        return (
            <img
                src={displayImageUrl}
                alt={fullName || `${firstName} ${lastName}` || 'Avatar'}
                className={`${baseClasses} object-cover ${className}`}
            />
        );
    }

    if (showFallback && initials) {
        return (
            <div className={`${baseClasses} bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg ${className}`}>
                {initials}
            </div>
        );
    }

    if (showFallback) {
        return (
            <div className={`${baseClasses} bg-gray-300 text-gray-600 ${className}`}>
                <User className={size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-12 h-12'} />
            </div>
        );
    }

    return null;
};

export default Avatar;