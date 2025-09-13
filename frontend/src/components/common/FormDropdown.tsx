import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FormDropdownOption {
    key: string;
    value: string;
    label: string;
}

interface FormDropdownProps {
    label?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    options: FormDropdownOption[];
    onChange?: (e: { target: { name?: string; value: string } }) => void;
    error?: string;
    required?: boolean;
    leftIcon?: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const FormDropdown: React.FC<FormDropdownProps> = ({
    label,
    name,
    value = '',
    placeholder = 'Chọn một tùy chọn',
    options,
    onChange,
    error,
    required = false,
    leftIcon,
    disabled = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setHighlightedIndex(-1);
        }
    }, [isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (isOpen && highlightedIndex >= 0) {
                    handleOptionSelect(options[highlightedIndex].value);
                } else {
                    setIsOpen(!isOpen);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex(prev =>
                        prev < options.length - 1 ? prev + 1 : 0
                    );
                } else {
                    setIsOpen(true);
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    setHighlightedIndex(prev =>
                        prev > 0 ? prev - 1 : options.length - 1
                    );
                } else {
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleOptionSelect = (optionValue: string) => {
        onChange?.({ target: { name, value: optionValue } });
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={`${className}`} ref={dropdownRef}>
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    type="button"
                    name={name}
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className={`
            file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-left
            focus-visible:border-gray-400 focus-visible:ring-gray-400/50 focus-visible:ring-[3px]
            aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
            ${leftIcon ? 'pl-10' : ''}
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-sm'}
          `}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-required={required}
                >
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <span className="text-gray-400">{leftIcon}</span>
                        </div>
                    )}

                    <span className={`flex items-center truncate  ${selectedOption ? 'text-gray-900' : 'text-muted-foreground'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>

                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-100">
                        <div className="py-1">
                            {options.map((option, index) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    role="option"
                                    aria-selected={value === option.value}
                                    className={`
                    w-full px-3 py-2 text-sm text-left cursor-pointer flex items-center justify-between
                    transition-colors duration-150
                    ${value === option.value ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-900'}
                    ${highlightedIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'}
                    focus:outline-none focus:bg-gray-50
                    first:rounded-t-md last:rounded-b-md
                  `}
                                    onClick={() => handleOptionSelect(option.value)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {value === option.value && (
                                        <Check className="h-4 w-4 text-gray-600 flex-shrink-0 ml-2" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

export default FormDropdown;