import ListViewSkeleton from "../skeletons/ListViewSkeleton";
import { useChatStore } from "@/stores/useChatStore";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatMessageTimestamp } from "@/util/formatMessageTimestamp";
import { Fragment, useEffect } from "react";
import SearchBar from "./SearchBar";

export default function ListView() {
    const navigate = useNavigate();
    const {
        users,
        foundUsers,
        isUsersLoading,
        setSelectedUser, 
        selectedUser,
        getConversations,
        conversations,
        subscribeToNewConversations,
        unsubscribeFromNewConversations,
        markMessagesAsRead,
        subscribeToNewMessages,
        unsubscribeFromNewMessages,
        searchTerm,
    } = useChatStore();

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        console.log("Selected User:", user);
        navigate(`/chat/${user.conversationId}`);
    };

    // Load conversations on component mount
    useEffect(() => {
        getConversations();
        subscribeToNewConversations();
        subscribeToNewMessages();

        return () => {
            unsubscribeFromNewConversations();
            unsubscribeFromNewMessages();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Subscribe to messages and mark as read when selectedUser changes
    useEffect(() => {
        if (selectedUser?.conversationId) {
            markMessagesAsRead(selectedUser.conversationId);
        }
    }, [selectedUser, markMessagesAsRead]);
    console.log("Conversations in ListView:", conversations);
    console.log("Users in ListView:", users);

    if (isUsersLoading) return <ListViewSkeleton />

    const filteredUsers = searchTerm ? foundUsers : conversations;
    console.log("Filtered Users:", filteredUsers);
    console.log("Searched Users:", foundUsers);


    return (
        <div className="h-full flex flex-col py-6 px-3 ">
            <SearchBar />

            <div className="overflow-y-auto w-full my-15">
                {filteredUsers && filteredUsers.length > 0 ? (
                    //fu: filtered user or conversation
                    filteredUsers.map((fu) => {
                        const participant = fu.user ?? fu.identity ?? {};
                        const participantId = participant._id;
                        const selectedUserId = selectedUser?.user?._id || selectedUser?.identity?._id;

                        return (
                            <Fragment key={fu.conversationId || fu._id}>
                                <div className={`flex items-center p-3 rounded-lg cursor-pointer ${selectedUser && participantId === selectedUserId ? 'bg-primary/10' : 'hover:bg-base-200'}`}
                                    onClick={() => handleUserSelect(fu)}
                                >
                                <div className="avatar mr-3">
                                    <div className="w-12 rounded-full">
                                        <img src={participant.profilePic || ""} alt={`${participant.firstName || ""} ${participant.lastName || ""}`.trim()} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">{participant.firstName || ""} {participant.lastName || ""}</p>
                                { !searchTerm && fu.lastMessage?.content &&
                                    <p className="text-sm text-base-content/70 truncate">{fu.lastMessage?.content}</p>
                                }
                            </div>
                            { !searchTerm &&
                                <div className="flex flex-col items-end ml-3">
                                    <span className="text-xs text-base-content/70">{formatMessageTimestamp(fu.lastMessage?.createdAt)}</span>
                                    {fu.unreadCount > 0 && (
                                        <div className="badge badge-primary badge-sm mt-1">{fu.unreadCount}</div>
                                    )}
                                </div>
                            }
                        </div>
                    </Fragment>
                )})
                ) : (
                    <div className="flex flex-col items-center gap-3 mt-20 opacity-50">
                        <Search size={48} />
                        <p className="text-center">
                            No conversations yet.<br />Start by searching for users!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}