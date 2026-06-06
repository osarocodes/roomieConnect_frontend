import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { axiosInstance } from '@/lib/axios';

export const useAdminStore = create(persist((set) => ({
    users: [],
    activities: [],
    reports: [],
    isLoadingUsers: false,
    isUpdatingRole: false,
    isDeletingUser: false,
    userToEdit: null,

    fetchUsers: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get('/admin/users');
            set({ users: res.data });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            set({ isLoadingUsers: false });
        }
    },
    fetchActivities: async () => {
        set({ isLoadingActivities: true });
        try {
            const res = await axiosInstance.get('/admin/activities');
            set({ activities: res.data });
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            set({ isLoadingActivities: false });
        }
    },
    updateUserRole: async (userId, newRole) => {
        set({ isUpdatingRole: true });
        try {
            await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
            set((state) => ({
                users: state.users.map((user) =>
                    user._id === userId ? { ...user, identity: { ...user.identity, role: newRole } } : user
                ),
                userToEdit: state.userToEdit && state.userToEdit._id === userId 
                    ? { ...state.userToEdit, identity: { ...state.userToEdit.identity, role: newRole } }
                    : state.userToEdit
            }));
        } catch (error) {
            console.error("Failed to update user role:", error);
        } finally {
            set({ isUpdatingRole: false });
        }
    },
    verifyStudent: async (userId, verifyStatus) => {
        set({ isUpdatingRole: true });
        try {
            await axiosInstance.put(`/admin/users/${userId}/verify`, { verifiedStudentStatus: verifyStatus });
            set((state) => ({
                users: state.users.map((user) =>
                    user._id === userId ? { ...user, university: { ...user.university, verifiedStudentStatus: verifyStatus } } : user
                ),
                userToEdit: state.userToEdit && state.userToEdit._id === userId 
                    ? { ...state.userToEdit, university: { ...state.userToEdit.university, verifiedStudentStatus: verifyStatus } }
                    : state.userToEdit
            }));
        } catch (error) {
            console.error("Failed to verify student:", error);
        } finally {
            set({ isUpdatingRole: false });
        }
    },
    getReportedUsers: async () => {
        try {
            const res = await axiosInstance.get('/admin/reports');
            set({ reports: res.data })
        } catch (error) {
            console.error("Unable to fetch reports: ", error);
        }
    },
    deleteUser: async (userId) => {
        set({ isDeletingUser: true });
        try {
            await axiosInstance.delete(`/admin/users/${userId}`);
            set((state) => ({
                users: state.users.filter((user) => user._id !== userId),
                userToEdit: state.userToEdit && state.userToEdit._id === userId ? null : state.userToEdit
            }));
        } catch (error) {
            console.error("Failed to delete user:", error);
        } finally {
            set({ isDeletingUser: false });
        }
    },
    setUserToEdit: (user) => set({ userToEdit: user }),
    clearUserToEdit: () => set({ userToEdit: null }),

}), {
        name: 'admin-storage' 
}));