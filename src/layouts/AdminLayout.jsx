
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div className="w-full h-screen flex flex-col md:flex-row ">

            <main className="flex-1 p-6 border-base-300 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Outlet />
            </main>
        </div>
    );
}