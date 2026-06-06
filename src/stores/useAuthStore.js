import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import { persist } from 'zustand/middleware';
import { io } from 'socket.io-client';
import { useMatchStore } from './useMatchStore';
import { subscribeToPushNotifications } from '@/util/pushNotification';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const useAuthStore = create(persist((set, get) => ({
    authUser: null,
    admin: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isCheckingAdmin: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.error("Auth check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    checkAdmin: async () => {
        set({ isCheckingAdmin: true });
        try {
            await axiosInstance.get('/admin/checkAdmin');
            set({ admin: true });
        } catch (error) {
            console.error("Admin check failed:", error.response?.data?.message || error.message);
            set({ admin: false });
        } finally {
            set({ isCheckingAdmin: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data, {
                headers: {
                    'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
                }
            });
            set({ authUser: res.data });
            get().connectSocket();
            return { success: true, message: "Account created successfully!" };
        } catch (error) {
            const errorMessage = error || "Signup Failed";
            return { success: false, message: errorMessage };
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ authUser: res.data });
            await subscribeToPushNotifications(axiosInstance);
            useMatchStore.setState({ matches: [] });
            get().connectSocket();
            toast.success("Login successful!");
            return true;
        } catch (error) {
            // Capture the actual message from your backend (e.g., "User not found")
            const errorMessage = error.response?.data?.message || "Login Failed";
            toast.error(errorMessage); 
            return false;
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () =>  {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            useMatchStore.setState({ matches: [] });
            get().disconnectSocket();
            toast.success("Logout successful!");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }
    },
    updateProfile: async (updatedData) => {
        set({ isUpdatingProfile: true });
        try {
            const config = updatedData instanceof FormData ? {} : { headers: { 'Content-Type': 'application/json' } };
            const res = await axiosInstance.patch('/auth/users/me', updatedData, config);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile. Please try again.");
            return false;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
        });
        newSocket.connect();
        set({ socket: newSocket });

        newSocket.on('onlineUsers', (onlineUsers) => {
            set({ onlineUsers });
        });
    },
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
            console.log('Socket disconnected');
        }
    }
}), {
    name: 'auth-storage',
    partialize: (state) => ({ authUser: state.authUser, admin: state.admin })
}));