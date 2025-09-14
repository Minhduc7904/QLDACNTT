import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../../types';
import { studentService } from '../../services';
import { STORAGE_KEYS } from '../../constants';
import { createAuthThunkHandler } from '../../utils';
import { Image } from '../../types';

// Student state (separate from auth)
interface StudentState {
    profile: Student | null;
    isLoading: boolean;
    isUpdating: boolean;
    error: string | null;
}

// Initial state
const initialState: StudentState = {
    profile: null,
    isLoading: false,
    isUpdating: false,
    error: null,
};

// Async thunks
export const getStudentProfile = createAsyncThunk<Student, string>(
    'student/getProfile',
    createAuthThunkHandler(
        (id: string) => studentService.getProfile(id),
        'Lấy thông tin học sinh thất bại',
        {
            showSuccessNotification: false,
            onSuccess: (response) => {
                return response.data;
            }
        }
    )
);

export const updateStudentProfile = createAsyncThunk<Student, { id: string; data: Partial<Student> }>(
    'student/updateProfile',
    createAuthThunkHandler(
        ({ id, data }) => studentService.updateProfile(id, data),
        'Cập nhật thông tin học sinh thất bại',
        {
            showSuccessNotification: true,
            successMessage: 'Cập nhật thông tin thành công!',
            onSuccess: (response) => {
                return response.data;
            }
        }
    )
);

// Student slice
const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        clearStudentProfileError: (state) => {
            state.error = null;
        },
        setStudentProfile: (state, action: PayloadAction<Student>) => {
            state.profile = action.payload;
        },
        clearStudentProfile: (state) => {
            state.profile = null;
            state.error = null;
        },
        updateAvatar: (state, action: PayloadAction<Image>) => {
            if (state.profile) {
                if (state.profile.imageUrls) {
                    state.profile.imageUrls.url = action.payload.url;
                } else {
                    state.profile.imageUrls = {
                        imageId: action.payload.imageId,
                        url: action.payload.url
                    };
                }
            }
        }
    },
    extraReducers: (builder) => {
        // Get Profile
        builder
            .addCase(getStudentProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getStudentProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(getStudentProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateStudentProfile.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateStudentProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateStudentProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearStudentProfileError, setStudentProfile, clearStudentProfile, updateAvatar } = studentSlice.actions;
export default studentSlice.reducer;
