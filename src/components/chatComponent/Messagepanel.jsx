import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChatStore } from "@/stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMatchStore } from "@/stores/useMatchStore";
import { formatMessageTimestamp } from "@/util/formatMessageTimestamp";

export default function MessagePanel() {
    const { 
        selectedUser, 
        messages, 
        isMessagesLoading, 
        getMessages, 
        subscribeToNewMessages, 
        unsubscribeFromNewMessages,
        conversations,
        getConversations,
        setSelectedUser,
        markMessagesAsRead,
        subscribeToReadReciept,
        isBlocked,
        checkBlockStatus,
    } = useChatStore();
    const { unblockUser } = useMatchStore();
    const { authUser } = useAuthStore();
    // const { isBlocked } = useMatchStore();
    const messagesEndRef = useRef(null);
    const { conversationId } = useParams();

    useEffect(() => {
        const loadConversations = async () => {
            if (conversations.length === 0) {
                await getConversations();
            }
        };
        loadConversations();
    }, [conversations.length, getConversations]);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(c => c.conversationId === conversationId);
            if (conversation) {
                setSelectedUser(conversation);
            }
        }
    }, [conversationId, conversations, setSelectedUser]);

    useEffect(() => {
        if (selectedUser && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            
            if (lastMessage.sender === selectedUser.user._id && !lastMessage.isRead) {
                markMessagesAsRead(selectedUser.conversationId);
            }
        }
    }, [messages, selectedUser, markMessagesAsRead]);

    useEffect(() => {
        if (selectedUser) {
            markMessagesAsRead(selectedUser.conversationId);
            getMessages(selectedUser.conversationId);
            subscribeToNewMessages();
            subscribeToReadReciept();

            return () => {
                unsubscribeFromNewMessages();
            };
        }
    }, [selectedUser, getMessages, subscribeToNewMessages, unsubscribeFromNewMessages, markMessagesAsRead, subscribeToReadReciept]);

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (selectedUser?.user?._id) {
            checkBlockStatus(selectedUser.user._id);
        }
    }, [selectedUser, checkBlockStatus]);

    if (isMessagesLoading || !selectedUser) return (
        <div>
            <ChatHeader user={selectedUser} />
            <MessageSkeleton />
        </div>
    );
    console.log("MessagePanel Rendered - current messages:", messages);
    console.log("Selected User in MessagePanel:", selectedUser);
    console.log("Is Blocked:", isBlocked);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-base-300">
            <ChatHeader userObj={selectedUser} />
            {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p>No messages yet...</p>
                </div>
            )}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.sender === authUser._id ? 'chat-end' : 'chat-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md ${message.content ? 'mb-2 px-4 py-1' : ''} rounded-lg ${
                                message.sender === authUser._id
                                    ? message.image ? 'border-4 border-primary' : 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {message.image && (
                                <div className="relative">                                        
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md"
                                    />
                                    <time className="text-xs opacity-75 ml-2 self-end absolute top-1 right-3 text-white">
                                        {formatMessageTimestamp(message.createdAt)}
                                    </time>
                                </div>
                            )}
                            {message.content && (
                                <div className="flex items-center">
                                    <p>{message.content}</p>
                                    <time className="text-xs opacity-75 ml-2 self-end">
                                        {formatMessageTimestamp(message.createdAt)}
                                    </time>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {isBlocked ? (
                <div className="p-4 bg-primary/25 text-content text-center">
                    You have blocked this user. Tap to <button className="text-primary hover:underline" onClick={async () => { await unblockUser(selectedUser.user._id); checkBlockStatus(selectedUser.user._id); }}>unblock</button>.
                </div>
            ) : (
                <MessageInput />
            )}
        </div>
    );
}