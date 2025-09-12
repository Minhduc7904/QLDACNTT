import { configureStore } from '@reduxjs/toolkit';
import { authSlice, appSlice, studentAuthSlice, adminAuthSlice } from './slices';
import languageReducer from './slices/languageSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    studentAuth: studentAuthSlice,
    adminAuth: adminAuthSlice,
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
