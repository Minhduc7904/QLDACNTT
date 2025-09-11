import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'vi';

interface LanguageState {
    currentLanguage: Language;
}

const initialState: LanguageState = {
    currentLanguage: 'en',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.currentLanguage = action.payload;
            // Lưu vào localStorage để persist
            localStorage.setItem('language', action.payload);
        },
        initializeLanguage: (state) => {
            // Khôi phục từ localStorage nếu có
            const savedLanguage = localStorage.getItem('language') as Language;
            if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'vi')) {
                state.currentLanguage = savedLanguage;
            }
        },
    },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
