import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getStudentProfile, updateStudentProfile, clearStudentProfileError, setStudentProfile, clearStudentProfile, updateAvatar } from '../store/slices/studentSlice';
import { Student } from '../types';

export const useStudent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { profile, isLoading, isUpdating, error } = useSelector((state: RootState) => state.student);

    const fetchProfile = (id: string) => {
        return dispatch(getStudentProfile(id));
    };

    const clearError = () => {
        dispatch(clearStudentProfileError());
    };

    const setProfile = (profile: Student) => {
        dispatch(setStudentProfile(profile));
    };

    const clearProfile = () => {
        dispatch(clearStudentProfile());
    };

    const updateProfile = (id: string, data: Partial<Student>) => {
        return dispatch(updateStudentProfile({ id, data }));
    };

    const updateProfileAvatar = (payload: string) => {
        return dispatch(updateAvatar(payload));
    };

    return {
        profile,
        isLoading,
        isUpdating,
        error,
        fetchProfile,
        updateProfile,
        clearError,
        setProfile,
        clearProfile,
        updateProfileAvatar,
    };
};