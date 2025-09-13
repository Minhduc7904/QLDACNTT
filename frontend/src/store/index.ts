import { configureStore } from '@reduxjs/toolkit';
import { appSlice, studentAuthSlice, adminAuthSlice } from './slices';
import studentReducer from './slices/studentSlice';
import languageReducer from './slices/languageSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    studentAuth: studentAuthSlice,
    adminAuth: adminAuthSlice,
    student: studentReducer,
    app: appSlice,
    language: languageReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
