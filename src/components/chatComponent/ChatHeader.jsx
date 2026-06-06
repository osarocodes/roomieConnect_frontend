import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EllipsisMenu from "../EllipsisMenu";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMatchStore } from "@/stores/useMatchStore";
import { useChatStore } from "@/stores/useChatStore";

const REPORT_REASONS = [
    "Spam or misleading",
    "Harassment or bullying",
    "Inappropriate content / Nudity",
    "Hate speech or symbols",
    "Impersonation",
    "Scam or fraud",
    "Other"
];

const ChatHeader = ({ userObj }) => {
    const navigate = useNavigate();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [additionalDetails, setAdditionalDetails] = useState("");

    const { onlineUsers } = useAuthStore();
    const { setSelectedUser, clearChat, isBlocked, checkBlockStatus, setReportedUser, isReportingUser } = useChatStore();
    const { blockUser } = useMatchStore();

    useEffect(() => {
        if (userObj && userObj.user._id) {
            checkBlockStatus(userObj.user._id);
        }
    }, [userObj, checkBlockStatus]);

    const handleBackClick = () => {
        setSelectedUser(null);
        navigate('/chat');
    };

const openReportModal = () => setIsReportModalOpen(true);

const submitFinalReport = async () => {
    const finalReason = selectedReason === "Other" 
        ? `Other: ${additionalDetails}` 
        : selectedReason;

    try {
        await setReportedUser({
            reportedUser: userObj.user._id,
            reason: finalReason
        });

        setIsReportModalOpen(false); // Close modal on success
        alert("Report sent!");
    } catch (error) {
        alert("Failed to send report.", error);
    }
};

    const handleClearChat = async () => {
        if (userObj && userObj.user._id) {
            const confirmed = window.confirm("Are you sure you want to clear the chat?");
            if (confirmed) {
                await clearChat(userObj.user._id);
                toast.success('Chat cleared successfully');
            } else {
                toast.error('Chat clear canceled');
            }
        }
    };

    const handleBlockUser = async () => {
        if (userObj && userObj.user._id) {
            const confirmed = window.confirm("Are you sure you want to block this user? This will clear the chat and prevent future interactions.");
            if (confirmed) {
                await blockUser(userObj.user._id);
                // navigate('/chat');
            } else {
                toast.error('Block user canceled');
            }
        }
    };

    const handleUnblockUser = async () => {
        if (userObj && userObj.user._id) {
            const confirmed = window.confirm(`unblock ${userObj.user.firstName} ${userObj.user.lastName}? This will allow you to see their messages and interact with them again.`);
            if (confirmed) {
                await useMatchStore.getState().unblockUser(userObj.user._id);
                checkBlockStatus(userObj.user._id);
            } else {
                toast.error('Unblock user canceled');
            }
        }
    };
    console.log("ChatHeader Rendered - userObj:", userObj, "isBlocked:", isBlocked);
    console.log("Online Users:", onlineUsers);


    return (
        <div>
            <div className="flex items-center justify-start p-4 bg-base-300 border-b border-base-100">
                <button onClick={handleBackClick} className="flex items-center gap-4">
                    <ArrowLeft className="size-6 cursor-pointer" />
                </button>
                <div className="flex items-center gap-3 ml-3">
                    {userObj && userObj.user.profilePic && (
                        <img
                            src={userObj.user.profilePic}
                            alt={userObj.user.firstName}
                            className="size-9 rounded-full object-cover"
                        />
                    )}
                    {userObj && (
                        <div>
                            <h2 className="text-lg font-semibold">{userObj.user.firstName} {userObj.user.lastName}</h2>
                            <p className={`text-sm ${onlineUsers.includes(userObj.user._id) ? 'text-green-500/66' : 'text-gray-500'}`}>
                                {onlineUsers.includes(userObj.user._id) ? 'Online' : 'Offline'}
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex ml-auto z-99">
                    <EllipsisMenu className="" prop0={openReportModal} prop1={"Report"} prop2={handleClearChat} prop3={"Clear chat"} prop4={isBlocked ? handleUnblockUser : handleBlockUser} prop5={isBlocked ? "Unblock User" : "Block User"}/>
                </div>
            </div>
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                    <div className="bg-base-300 p-6 rounded-lg w-96 shadow-xl border border-base-100">
                        <h3 className="text-xl font-bold mb-4">Report User</h3>
                        <div className="space-y-2 mb-6">
                            <p className="text-sm font-medium mb-2 text-gray-400">Why are you reporting this user?</p>
                            {REPORT_REASONS.map((reason) => (
                                <label key={reason} className="flex items-center gap-3 p-3 rounded-lg bg-base-100 hover:bg-base-200 cursor-pointer border border-transparent has-[:checked]:border-primary transition-all">
                                    <input 
                                        type="radio" 
                                        name="reportReason" 
                                        className="radio radio-primary radio-sm" 
                                        value={reason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                    />
                                    <span className="text-sm">{reason}</span>
                                </label>
                            ))}
                            {selectedReason === "Other" && (
                                <textarea 
                                    className="textarea textarea-bordered w-full mb-4"
                                    placeholder="Please provide more details..."
                                    value={additionalDetails}
                                    onChange={(e) => setAdditionalDetails(e.target.value)}
                                />
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsReportModalOpen(false)}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitFinalReport}
                                className="btn btn-error"
                                disabled={!selectedReason.trim() || isReportingUser}
                            >
                                Submit Report
                                {isReportingUser && <span className="loading loading-spinner"></span>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatHeader;
