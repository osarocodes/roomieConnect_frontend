import { useChatStore } from "@/stores/useChatStore";
import ListView from "@/components/chatComponent/ListView.jsx";

export default function MessagingPage() {
    const { selectedUser } = useChatStore();

    return (
        <div className="h-screen">
            <div className="">
                <div className="">
                    {!selectedUser && <ListView />}
                </div>
            </div>
        </div>
    );
}