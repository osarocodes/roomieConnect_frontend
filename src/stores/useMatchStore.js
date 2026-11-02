import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { persist } from 'zustand/middleware';
import { useChatStore } from './useChatStore';

export const useMatchStore = create(persist((set) => ({
    matches: [],
    // isBlocked: false,
    isLoadingMatches: false,

    getRecommendedMatches: async () => {
        set({ isLoadingMatches: true });
        try {
            const res = await axiosInstance.get('/matches');
            set({ matches: res.data });
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch matches";
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isLoadingMatches: false });
        }
    },
    blockUser: async (userId) => {
        // set({ isBlocked: true });
        try {
            await axiosInstance.post(`/users/block/${userId}`);
            set((state) => ({
                matches: state.matches.filter(match => match.user._id !== userId)
            }));
            useChatStore.getState().checkBlockStatus(userId);
            toast.success("User blocked successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to block user";
            console.error(errorMessage);
            // toast.error(errorMessage);
        }
    },
    unblockUser: async (conversationId) => {
        // set({ isBlocked: false });
        try {
            await axiosInstance.post(`/users/unblock/${conversationId}`);
            toast.success("User unblocked successfully");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to unblock user";
            console.error(errorMessage);
            // toast.error(errorMessage);
        }
    },
}),
{ name: 'match-storage' }
));