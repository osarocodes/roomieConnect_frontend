import { Outlet, NavLink } from "react-router-dom";
import { Home, Users, User, MessageSquare } from "lucide-react";
import EllipsisMenu from "@/components/EllipsisMenu";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";


export default function MainLayout() {
    const [ setOpen] = useState(false);
    const { logout } = useAuthStore();
    const handleLogout = () => {
        // Implement logout logic here
        logout();
        setOpen(false); // Close the menu after logout
    };
    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 w-full z-20 bg-base-100 border-b border-gray-500">
                <div className="max-w-5xl mx-auto h-16 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                        <h1 className="text-2xl sm:text-xl font-medium">RoommieConnect</h1>
                        <EllipsisMenu className="ml-auto" prop1={<ThemeToggle />} prop2={''} prop3={"Help"} prop4={() => {handleLogout()}} prop5={"Logout"}/>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p pt-16 pb-16 
            [scrollbar-width:none]
            [ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
            ">
                <Outlet />
            </main>


            <nav className="flex justify-around z-10  border-t bg-base-200 border-gray-500 p-2 fixed bottom-0 w-full">
                <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-[#0686bd]" : "text-gray-500"} `}>
                    <Home size={30} />
                    <span className="text-xs">Home</span>
                </NavLink>
                <NavLink to="/matches" className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-[#0686bd]" : "text-gray-500"} `}>
                    <Users size={30} />
                    <span className="text-xs">Matches</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-[#0686bd]" : "text-gray-500"} `}>
                    <User size={30} />
                    <span className="text-xs">Profile</span>
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => `flex flex-col items-center ${isActive ? "text-[#0686bd]" : "text-gray-500"} `}>
                    <MessageSquare size={30} />
                    <span className="text-xs">Chat</span>
                </NavLink>
            </nav>
        </div>
    );
}