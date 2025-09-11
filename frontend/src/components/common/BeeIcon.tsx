import React from 'react';

interface BeeIconProps {
    /** Size of the icon container */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** Additional CSS classes */
    className?: string;
    /** Click handler for the icon */
    onClick?: () => void;
    /** Icon variant style */
    variant?: 'gradient' | 'solid' | 'outline' | 'hexagon';
}

const BeeIcon: React.FC<BeeIconProps> = ({ size = 'md', className = '', onClick, variant = 'gradient' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const textSizes = {
        sm: 'text-xs',
        md: 'text-base',
        lg: 'text-xl',
        xl: 'text-2xl'
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'gradient':
                return {
                    container: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-lg hover:shadow-xl hover:shadow-amber-400/25',
                    text: 'text-white drop-shadow-md'
                };
            case 'solid':
                return {
                    container: 'bg-yellow-500 hover:bg-yellow-600 shadow-md hover:shadow-lg',
                    text: 'text-white drop-shadow-sm'
                };
            case 'outline':
                return {
                    container: 'border-2 border-yellow-500 bg-white hover:bg-yellow-50 shadow-sm hover:shadow-md',
                    text: 'text-yellow-600'
                };
            case 'hexagon':
                return {
                    container: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg hover:shadow-xl hover:shadow-amber-400/30',
                    text: 'text-white drop-shadow-md'
                };
            default:
                return {
                    container: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 shadow-lg hover:shadow-xl hover:shadow-amber-400/25',
                    text: 'text-white drop-shadow-md'
                };
        }
    };

    const styles = getVariantStyles();
    const isHexagon = variant === 'hexagon';

    const renderStylizedB = () => (
        <div className={`${textSizes[size]} ${styles.text} relative`} style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            <span className="relative z-10 font-black tracking-tight leading-none" style={{
                fontWeight: '900',
                textShadow: variant === 'gradient' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                letterSpacing: '-0.05em'
            }}>
                B
            </span>
            {/* Modern accent elements */}
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-current rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-current rounded-full opacity-50 animate-pulse delay-500"></div>
            {/* Subtle inner glow effect */}
            {variant === 'gradient' && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-sm"></div>
            )}
        </div>
    );

    if (isHexagon) {
        return (
            <div 
                className={`${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer transform hover:scale-105 active:scale-95' : ''} transition-all duration-200 relative`}
                onClick={onClick}
                style={{
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                }}
            >
                <div className={`w-full h-full flex items-center justify-center ${styles.container}`}>
                    {renderStylizedB()}
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${styles.container} ${className} ${
                onClick ? 'cursor-pointer transform hover:scale-105 active:scale-95' : ''
            } transition-all duration-200 relative overflow-hidden`}
            onClick={onClick}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
            </div>
            
            {renderStylizedB()}
        </div>
    );
};

export default BeeIcon;
