import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Languages, ChevronDown } from 'lucide-react';
import { setLanguage, type Language } from '../../store/slices/languageSlice';
import { RootState } from '../../store';
import Dropdown, { DropdownItem } from './Dropdown';

const LanguageToggle: React.FC = () => {
    const dispatch = useDispatch();
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

    const languages = [
        { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
        { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' },
    ];

    const currentLang = languages.find(lang => lang.code === currentLanguage);

    const handleLanguageChange = (item: DropdownItem) => {
        dispatch(setLanguage(item.value as Language));
    };

    // Tạo dropdown items từ languages
    const dropdownItems: DropdownItem[] = languages.map(language => ({
        key: language.code,
        value: language.code,
        label: (
            <div className="flex items-center space-x-3">
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-xs text-gray-500">{language.code.toUpperCase()}</span>
                </div>
                {currentLanguage === language.code && (
                    <div className="ml-auto w-2 h-2 bg-gray-900 rounded-full"></div>
                )}
            </div>
        )
    }));

    // Trigger button
    const trigger = (
        <button
            className="p-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center space-x-2"
            title="Chọn ngôn ngữ / Select Language"
        >
            <Languages className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
                {currentLang?.flag} {currentLang?.code.toUpperCase()}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-700 transition-transform duration-200" />
        </button>
    );

    return (
        <div className="fixed top-6 right-6">
            <Dropdown
                trigger={trigger}
                items={dropdownItems}
                onSelect={handleLanguageChange}
                selectedKey={currentLanguage}
                position="bottom-right"
                dropdownClassName="min-w-[160px]"
            />
        </div>
    );
};

export default LanguageToggle;
