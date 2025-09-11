import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface CheckboxProps {
    id?: string;
    name?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    size?: 'sm' | 'md' | 'lg';
}

const Checkbox: React.FC<CheckboxProps> = ({
    id,
    name,
    checked = false,
    onChange,
    label,
    disabled = false,
    className = '',
    labelClassName = '',
    size = 'md'
}) => {
    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!checked);
        }
    };

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const iconSizes = {
        sm: 12,
        md: 16,
        lg: 20
    };

    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <div
                className={clsx(
                    'flex items-center justify-center border-2 rounded cursor-pointer transition-all duration-200',
                    sizeClasses[size],
                    {
                        'bg-black border-black': checked && !disabled,
                        'bg-transparent border-gray-300 hover:border-gray-400': !checked && !disabled,
                        'bg-gray-100 border-gray-200 cursor-not-allowed': disabled,
                        'hover:bg-gray-50': !checked && !disabled,
                        'transform hover:scale-105': !disabled
                    }
                )}
                onClick={handleClick}
                role="checkbox"
                aria-checked={checked}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                {checked && (
                    <Check 
                        size={iconSizes[size]}
                        className={clsx(
                            'transition-all duration-200',
                            {
                                'text-white': !disabled,
                                'text-gray-400': disabled
                            }
                        )}
                    />
                )}
            </div>
            
            {label && (
                <div
                    className={clsx(
                        'cursor-pointer select-none transition-colors duration-200',
                        {
                            'text-gray-900 hover:text-black': !disabled,
                            'text-gray-400 cursor-not-allowed': disabled
                        },
                        labelClassName
                    )}
                    onClick={handleClick}
                >
                    {label}
                </div>
            )}
            
            {/* Hidden input for form submission */}
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={() => {}}
                className="sr-only"
                tabIndex={-1}
            />
        </div>
    );
};

export default Checkbox;
