import React, { useRef, useEffect, ReactNode } from 'react';

interface ClickOutsideProps {
    children: ReactNode;
    onClickOutside: () => void;
    className?: string;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({ 
    children, 
    onClickOutside, 
    className = '' 
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onClickOutside();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClickOutside]);

    return (
        <div ref={wrapperRef} className={className}>
            {children}
        </div>
    );
};

export default ClickOutside;
