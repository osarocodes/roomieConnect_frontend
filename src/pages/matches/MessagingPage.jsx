import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import ListView from "@/components/chatComponent/ListView.jsx";

export default function MessagingPage() {
    const { setSelectedUser } = useChatStore();

    useEffect(() => {
        setSelectedUser(null);
    }, [setSelectedUser]);

    return (
        <div className="h-screen">
            <div className="">
                <div className="">
                    <ListView />
                </div>
            </div>
        </div>
    );
}