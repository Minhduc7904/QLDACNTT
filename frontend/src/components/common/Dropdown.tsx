import React, { useState, ReactNode } from 'react';
import clsx from 'clsx';
import ClickOutside from './ClickOutside';

export interface DropdownItem {
    key: string;
    label: ReactNode;
    value: any;
    disabled?: boolean;
    className?: string;
}

interface DropdownProps {
    trigger: ReactNode;
    items: DropdownItem[];
    onSelect: (item: DropdownItem) => void;
    selectedKey?: string;
    className?: string;
    dropdownClassName?: string;
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    offset?: { x?: number; y?: number };
    disabled?: boolean;
    placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    items,
    onSelect,
    selectedKey,
    className = '',
    dropdownClassName = '',
    position = 'bottom-left',
    offset = { x: 0, y: 8 },
    disabled = false,
    placeholder = 'Select an option'
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (item: DropdownItem) => {
        if (!item.disabled) {
            onSelect(item);
            setIsOpen(false);
        }
    };

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    const positionClasses = {
        'bottom-left': 'top-full left-0',
        'bottom-right': 'top-full right-0',
        'top-left': 'bottom-full left-0',
        'top-right': 'bottom-full right-0',
    };

    const offsetStyles = {
        marginTop: position.startsWith('bottom') ? `${offset.y}px` : undefined,
        marginBottom: position.startsWith('top') ? `${offset.y}px` : undefined,
        marginLeft: offset.x ? `${offset.x}px` : undefined,
    };

    return (
        <ClickOutside onClickOutside={handleClickOutside} className={clsx('relative', className)}>
            {/* Trigger */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={clsx(
                    'cursor-pointer',
                    {
                        'cursor-not-allowed opacity-50': disabled,
                    }
                )}
            >
                {trigger}
            </div>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div
                    className={clsx(
                        'absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-max',
                        'transform transition-all duration-200 ease-out',
                        'animate-in fade-in-0 zoom-in-95',
                        positionClasses[position],
                        dropdownClassName
                    )}
                    style={offsetStyles}
                >
                    {items.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500 italic">
                            {placeholder}
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.key}
                                onClick={() => handleSelect(item)}
                                className={clsx(
                                    'px-4 py-2 text-sm cursor-pointer transition-colors duration-150',
                                    'hover:bg-gray-50 active:bg-gray-100',
                                    {
                                        'bg-gray-100 text-gray-900': selectedKey === item.key,
                                        'text-gray-700': selectedKey !== item.key && !item.disabled,
                                        'text-gray-400 cursor-not-allowed': item.disabled,
                                        'hover:bg-transparent': item.disabled,
                                    },
                                    item.className
                                )}
                            >
                                {item.label}
                            </div>
                        ))
                    )}
                </div>
            )}
        </ClickOutside>
    );
};

export default Dropdown;
