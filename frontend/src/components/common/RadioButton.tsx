import React from 'react';
import clsx from 'clsx';

interface RadioButtonProps {
    id?: string;
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (value: string) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    labelClassName?: string;
    size?: 'sm' | 'md' | 'lg';
}

const RadioButton: React.FC<RadioButtonProps> = ({
    id,
    name,
    value,
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
            onChange(value);
        }
    };

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const dotSizes = {
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3'
    };

    return (
        <div className={clsx('flex items-center gap-2', className)}>
            <div
                className={clsx(
                    'flex items-center justify-center border-2 rounded-full cursor-pointer transition-all duration-200',
                    sizeClasses[size],
                    {
                        'bg-transparent border-black': checked && !disabled,
                        'bg-transparent border-gray-300 hover:border-gray-400': !checked && !disabled,
                        'bg-gray-100 border-gray-200 cursor-not-allowed': disabled,
                        'hover:bg-gray-50': !checked && !disabled,
                        'transform hover:scale-105': !disabled
                    }
                )}
                onClick={handleClick}
                role="radio"
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
                    <div 
                        className={clsx(
                            'rounded-full transition-all duration-200',
                            dotSizes[size],
                            {
                                'bg-black': !disabled,
                                'bg-gray-400': disabled
                            }
                        )}
                    />
                )}
            </div>
            
            {label && (
                <label
                    htmlFor={id}
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
                </label>
            )}
            
            {/* Hidden input for form submission */}
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={() => {}}
                className="sr-only"
                tabIndex={-1}
            />
        </div>
    );
};

export default RadioButton;
