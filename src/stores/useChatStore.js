import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
// Importing useAuthStore to access the socket instance
import { useAuthStore } from './useAuthStore';


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    foundUsers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isMessageRead: false,
    isReportingUser: false,
    conversations: [],
    isBlocked: false,
    searchTerm: "",
    
    setSearchTerm: (term) => set({ searchTerm: term }),
    getConversations: async () => {
        try {
            const response = await axiosInstance.get('/messages/conversations');
            set({ conversations: response.data });
            console.log("Conversations fetched:", response.data);
            console.log("Current conversations in store:", get().conversations);
        } catch (error) {
            console.error("Error getting conversation", error)
        }
    },
    setSelectedUser: (conversations) => {
        set({ selectedUser: conversations })
        console.log("Selected User set to:", conversations);
    },
    createOrGetConversation: async (recipientId) => {
        try {
            const response = await axiosInstance.post('/messages/conversations', { recipientId });
            return response.data; // Return the conversation data
        } catch (error) {
            console.error("Error creating/getting conversation", error);
            throw error; // Rethrow to handle in component
        }
    },
    searchUsers: async (query) => {
        try {
            const response = await axiosInstance.get(`/messages/search/users?query=${query}`);
            set({ foundUsers: response.data });
            console.log("Found Users:", response.data);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to search users');
            return false;
        }
    },
    getMessages: async (conversationId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${conversationId}`);
            set({ messages: response.data });
            console.log(`Messages for conversation ${conversationId} fetched:`, response.data);
        } catch (error) {
            console.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    clearChat: async (conversationId) => {
        try {
            // conversationId is the ID of the other user in 1-to-1 chat
            await axiosInstance.post(`/messages/clear/${conversationId}`);
            set({ messages: [] });

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to clear chat');
        }
    },
    sendMessages: async (messageData) => {
        try {
            console.log("Sending message with data:", messageData);
            console.log("Selected User in Store:", get().selectedUser);
            const response = await axiosInstance.post(`/messages/send/${messageData.conversationId}`, messageData);
            set((state) => ({ 
                messages: [...state.messages, response.data] 
            }));
        } catch (error) {
            console.error(error.response?.data?.message || 'Failed to send message');   
        }
    },
    checkBlockStatus: async (otherUserId) => {
        try {
            const response = await axiosInstance.get(`/users/block-status/${otherUserId}`);
            set({ isBlocked: response.data.isBlocked });
            return response.data.isBlocked;
        } catch (error) {
            console.error("Error checking block status:", error);
            return false;
        }
    },
    setReportedUser: async (data) => {
        set({ isReportingUser: true })
        try {
            const response = await axiosInstance.post('/messages/report/new', data);
            return response.data;
        } catch (error) {
            console.error("Failed to report user: ", error);
            throw error;
        } finally {
            set({ isReportingUser: false });
        }
    },
    subscribeToNewConversations: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("conversationUpdated", (updatedData) => {
        set((state) => {
            const exists = state.conversations.some(
                conv => conv.conversationId.toString() === updatedData._id.toString()
            );
            if (exists) {
                return {
                    conversations: state.conversations.map(conv =>
                        conv.conversationId.toString() === updatedData._id.toString()
                            ? { ...conv, lastMessage: updatedData.lastMessage }
                            : conv
                    )
                };
            }
            return state;
        });
    });
    },
    unsubscribeFromNewConversations: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newConversation");
    },
    subscribeToNewMessages: () => {
        const { selectedUser, getConversations } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
        if (newMessage.conversationId !== selectedUser.conversationId.toString()) return;
        
        set((state) => ({
            messages: [...state.messages, newMessage],
        }));
        getConversations();
    });
    },
    unsubscribeFromNewMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) socket.off("newMessage");
    },
    markMessagesAsRead: async (conversationId) => {
        try {
            await axiosInstance.post(`/messages/read/${conversationId}`);
            set((state) => ({
                messages: state.messages.map((m) => ({ ...m, isRead: true })),
                isMessageRead: true
            }));
        } catch (error) {
            console.error("Error marking messages as Read", error);
        }
    },
    subscribeToReadReciept: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return

        socket.on("messageSeen", ({ recipient }) => {
            const { selectedUser } = get();

            if (selectedUser.user._id === recipient) {
                set((state) => ({
                    messages: state.messages.map((m) => ({
                        ...m, isRead: true
                    })),
                    isMessageRead: true
                }));
            }
        });
    }
}));