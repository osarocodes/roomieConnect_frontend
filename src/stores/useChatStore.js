import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
// Importing useAuthStore to access the socket instance
import { useAuthStore } from './useAuthStore';

let conversationRequestSequence = 0;

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    foundUsers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    messagesConversationId: null,
    isMessageRead: false,
    isReportingUser: false,
    conversations: [],
    conversationsRevision: 0,
    isBlocked: false,
    searchTerm: "",
    
    setSearchTerm: (term) => set({ searchTerm: term }),
    getConversations: async () => {
        const requestId = ++conversationRequestSequence;
        const revisionAtRequest = get().conversationsRevision;
        try {
            const response = await axiosInstance.get('/messages/conversations');
            if (
                requestId === conversationRequestSequence &&
                revisionAtRequest === get().conversationsRevision
            ) {
                set({ conversations: response.data });
            }
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
            const response = await axiosInstance.get('/messages/search/users', { params: { query } });
            set({ foundUsers: response.data });
            console.log("Found Users:", response.data);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to search users');
            return false;
        }
    },
    getMessages: async (conversationId) => {
        set({ isMessagesLoading: true, messages: [], messagesConversationId: conversationId });
        try {
            const response = await axiosInstance.get(`/messages/${conversationId}`);
            if (get().messagesConversationId === conversationId) {
                set({ messages: response.data });
            }
            console.log(`Messages for conversation ${conversationId} fetched:`, response.data);
        } catch (error) {
            console.error(error.response?.data?.message || 'Failed to fetch messages');
            if (get().messagesConversationId === conversationId) {
                set({ messages: [] });
            }
        } finally {
            if (get().messagesConversationId === conversationId) {
                set({ isMessagesLoading: false });
            }
        }
    },
    clearChat: async (conversationId) => {
        try {
            await axiosInstance.post(`/messages/clear/${conversationId}`);
            set({ messages: [] });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to clear chat');
            return false;
        }
    },
    sendMessages: async (messageData) => {
        try {
            const formData = new FormData();
            formData.append('content', messageData.content);
            if (messageData.image) formData.append('image', messageData.image);

            const response = await axiosInstance.post(
                `/messages/send/${messageData.conversationId}`,
                formData
            );
            set((state) => ({ 
                messages: [...state.messages, response.data] 
            }));
            return { success: true,}
        } catch (error) {
            console.error(error.response?.data?.message || 'Failed to send message');
            toast.error(error.response?.data?.message || 'Failed to send message');
            return { success: false, message: error.response?.data?.message || 'Failed to send message' }; 
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
        if (!socket) return () => {};

        const handleConversationUpdated = (updatedData) => {
            const updatedConversationId = updatedData.conversationId?.toString();
            let conversationExists = false;
            set((state) => {
                conversationExists = state.conversations.some(
                    conv => conv.conversationId.toString() === updatedConversationId
                );
                if (!conversationExists) return state;

                let changed = false;
                const conversations = state.conversations.map(conv => {
                    if (conv.conversationId.toString() !== updatedConversationId) return conv;

                    const nextConversation = { ...conv };
                    if (updatedData.lastMessage) {
                        const currentLastMessage = conv.lastMessage;
                        const nextLastMessage = updatedData.lastMessage;
                        const sameLastMessage =
                            currentLastMessage?.content === nextLastMessage.content &&
                            currentLastMessage?.image === nextLastMessage.image &&
                            new Date(currentLastMessage?.createdAt || 0).getTime() ===
                                new Date(nextLastMessage.createdAt || 0).getTime();
                        if (!sameLastMessage) {
                            nextConversation.lastMessage = nextLastMessage;
                            changed = true;
                        }
                    }
                    if (
                        updatedData.unreadCount !== undefined &&
                        conv.unreadCount !== updatedData.unreadCount
                    ) {
                        nextConversation.unreadCount = updatedData.unreadCount;
                        changed = true;
                    }
                    if (
                        updatedData.updatedAt &&
                        new Date(conv.updatedAt).getTime() !== new Date(updatedData.updatedAt).getTime()
                    ) {
                        nextConversation.updatedAt = updatedData.updatedAt;
                        changed = true;
                    }
                    return changed ? nextConversation : conv;
                });

                return {
                    conversations: changed && updatedData.updatedAt
                        ? conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        : changed ? conversations : state.conversations,
                    conversationsRevision: state.conversationsRevision + 1,
                };
            });
            if (!conversationExists) get().getConversations();
        };
        socket.on("conversationUpdated", handleConversationUpdated);
        return () => {
            socket.off("conversationUpdated", handleConversationUpdated);
        };
    },
    subscribeToNewMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return () => {};

        const handleNewMessage = (newMessage) => {
            const { selectedUser, getConversations } = get();
            if (newMessage.conversationId !== selectedUser?.conversationId?.toString()) return;

            set((state) => state.messages.some(message => message._id === newMessage._id)
                ? state
                : { messages: [...state.messages, newMessage] });
            getConversations();
        };
        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    },
    markMessagesAsRead: async (conversationId) => {
        try {
            await axiosInstance.post(`/messages/read/${conversationId}`);
            set((state) => {
                const conversations = state.conversations.map((conversation) => {
                    if (
                        conversation.conversationId.toString() !== conversationId.toString() ||
                        conversation.unreadCount === 0
                    ) {
                        return conversation;
                    }
                    return { ...conversation, unreadCount: 0 };
                });

                return {
                    messages: state.messages.map((message) =>
                        message.conversationId.toString() === conversationId.toString()
                            ? { ...message, isRead: true }
                            : message
                    ),
                    conversations,
                    conversationsRevision: state.conversationsRevision + 1,
                    isMessageRead: true
                };
            });
        } catch (error) {
            console.error("Error marking messages as Read", error);
        }
    },
    subscribeToReadReciept: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return () => {};

        const handleMessageSeen = ({ conversationId }) => {
            const { selectedUser } = get();

            if (selectedUser?.conversationId?.toString() === conversationId) {
                set((state) => ({
                    messages: state.messages.map((m) => ({
                        ...m, isRead: true
                    })),
                    isMessageRead: true
                }));
            }
        };
        socket.on("messageSeen", handleMessageSeen);
        return () => {
            socket.off("messageSeen", handleMessageSeen);
        };
    }
}));