import React from 'react';
import BeeIcon from './BeeIcon';

interface BeeLogoBrandProps {
    /** Size of the logo */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Show platform text */
    showPlatform?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Click handler for the logo */
    onClick?: () => void;
    /** Orientation of the brand */
    orientation?: 'horizontal' | 'vertical';
    /** Icon variant style */
    iconVariant?: 'gradient' | 'solid' | 'outline' | 'hexagon';
}

const BeeLogoBrand: React.FC<BeeLogoBrandProps> = ({ 
    size = 'md', 
    showPlatform = true, 
    className = '', 
    onClick,
    orientation = 'horizontal',
    iconVariant = 'gradient'
}) => {
    const textSizes = {
        sm: {
            main: 'text-lg',
            sub: 'text-xs'
        },
        md: {
            main: 'text-xl',
            sub: 'text-xs'
        },
        lg: {
            main: 'text-2xl',
            sub: 'text-sm'
        },
        xl: {
            main: 'text-3xl',
            sub: 'text-base'
        }
    };

    const spacing = orientation === 'horizontal' ? 'space-x-3' : 'space-y-2';
    const flexDirection = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
    const textAlign = orientation === 'horizontal' ? '' : 'text-center';

    return (
        <div 
            className={`flex items-center ${flexDirection} ${spacing} ${className} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <BeeIcon size={size} variant={iconVariant} />
            <div className={`flex flex-col ${textAlign}`}>
                <span className={`${textSizes[size].main} font-extrabold text-gray-900`}>
                    BEE
                </span>
                {showPlatform && (
                    <span className={`${textSizes[size].sub} text-gray-600 font-medium`}>
                        Platform
                    </span>
                )}
            </div>
        </div>
    );
};

export default BeeLogoBrand;
