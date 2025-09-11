import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { store } from '../store';
import { 
    addSuccessNotification,
    addErrorNotification 
} from '../store/slices/notificationSlice';

/**
 * Utility function để lọc bỏ các field có giá trị empty/null/undefined
 * @param data - Object cần được lọc
 * @returns Object đã được lọc
 */
export const filterEmptyFields = <T extends Record<string, any>>(data: T): Partial<T> => {
    if (!data || typeof data !== 'object') {
        return data;
    }

    const filtered: Partial<T> = {};
    
    Object.keys(data).forEach((key) => {
        const value = data[key];
        
        // Kiểm tra các điều kiện để loại bỏ
        if (value !== null && 
            value !== undefined && 
            value !== '' && 
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === 'object' && Object.keys(value).length === 0)
        ) {
            // Nếu value là object thì đệ quy filter
            if (typeof value === 'object' && !Array.isArray(value)) {
                const nestedFiltered = filterEmptyFields(value);
                if (Object.keys(nestedFiltered).length > 0) {
                    filtered[key as keyof T] = nestedFiltered as T[keyof T];
                }
            } else {
                filtered[key as keyof T] = value;
            }
        }
    });

    return filtered;
};

/**
 * Wrapper function để xử lý try-catch cho async thunks
 * @param asyncFunction - Function async cần được wrap
 * @param defaultErrorMessage - Message lỗi mặc định nếu không có message từ server
 * @returns AsyncThunkPayloadCreator
 */
export const createAsyncThunkHandler = <T, P = void>(
    asyncFunction: (arg: P) => Promise<T>,
    defaultErrorMessage: string = 'Operation failed',
    shouldFilterEmptyFields: boolean = true
): AsyncThunkPayloadCreator<T, P> => {
    return async (arg: P, { rejectWithValue }) => {
        try {
            // Lọc bỏ các field empty nếu được bật và arg là object
            const filteredArg = shouldFilterEmptyFields && 
                                arg && 
                                typeof arg === 'object' && 
                                !Array.isArray(arg)
                ? filterEmptyFields(arg as Record<string, any>) as P
                : arg;

            const result = await asyncFunction(filteredArg);
            return result;
        } catch (error: any) {
            // Xử lý các loại error khác nhau
            let errorMessage = defaultErrorMessage;

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            return rejectWithValue(errorMessage);
        }
    };
};

export interface AuthThunkOptions<T> {
    showSuccessNotification?: boolean;
    showErrorNotification?: boolean;
    successMessage?: string;
    successTitle?: string;
    onSuccess?: (response: any) => T;
    onError?: () => void;
    shouldFilterEmptyFields?: boolean;
}

/**
 * Wrapper đặc biệt cho auth operations với localStorage handling và tự động hiển thị thông báo
 * @param asyncFunction - Function async cần được wrap
 * @param defaultErrorMessage - Message lỗi mặc định
 * @param options - Các tùy chọn cho thông báo và callbacks
 * @returns AsyncThunkPayloadCreator
 */
export const createAuthThunkHandler = <T, P = void>(
    asyncFunction: (arg: P) => Promise<any>,
    defaultErrorMessage: string = 'Authentication failed',
    options: AuthThunkOptions<T> = {}
): AsyncThunkPayloadCreator<T, P> => {
    const {
        showSuccessNotification = true,
        showErrorNotification = true,
        successMessage = 'Operation completed successfully',
        successTitle,
        onSuccess,
        onError,
        shouldFilterEmptyFields = true
    } = options;

    return async (arg: P, { rejectWithValue }) => {
        try {
            // Lọc bỏ các field empty nếu được bật và arg là object
            const filteredArg = shouldFilterEmptyFields && 
                                arg && 
                                typeof arg === 'object' && 
                                !Array.isArray(arg)
                ? filterEmptyFields(arg as Record<string, any>) as P
                : arg;

            const response = await asyncFunction(filteredArg);

            if (response.success) {
                // Hiển thị thông báo success nếu được bật
                if (showSuccessNotification) {
                    store.dispatch(addSuccessNotification({
                        message: response.message || successMessage,
                        title: successTitle
                    }));
                }

                // Gọi callback success nếu có
                if (onSuccess) {
                    return onSuccess(response);
                }
                return response.data;
            } else {
                const errorMessage = response.message || defaultErrorMessage;
                
                // Hiển thị thông báo lỗi nếu được bật
                if (showErrorNotification) {
                    store.dispatch(addErrorNotification({
                        message: errorMessage
                    }));
                }

                return rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            // Gọi callback error nếu có
            if (onError) {
                onError();
            }

            let errorMessage = defaultErrorMessage;

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Hiển thị thông báo lỗi nếu được bật
            if (showErrorNotification) {
                store.dispatch(addErrorNotification({
                    message: errorMessage
                }));
            }

            return rejectWithValue(errorMessage);
        }
    };
};
