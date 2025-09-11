import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface NavLinkProps {
    to: string;
    icon: LucideIcon;
    label: string;
    className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isActive = location.pathname === to;
    
    const handleClick = () => {
        navigate(to);
    };

    return (
        <Button
            onClick={handleClick}
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<Icon className="w-4 h-4" />}
            className={`
                ${isActive 
                    ? '' 
                    : 'bg-transparent hover:bg-gray-200 text-gray-700 hover:text-black border-none'
                }
                ${className}
            `}
        >
            {label}
        </Button>
    );
};

export default NavLink;
