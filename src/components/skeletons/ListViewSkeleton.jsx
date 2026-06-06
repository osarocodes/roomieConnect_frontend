import { Plus } from "lucide-react";

const ListViewSkeleton = () => {
    const listItems = Array(8).fill(null);
    const topAvatars = Array(4).fill(null);

    return (
        <div className="flex flex-col h-full bg-base-100  mx-auto relative overflow-hidden">
        
        {/* 1. Top Section (Horizontal "Stories" or "Active" Bar) */}
        <div className="flex items-center gap-8 p-5 overflow-x-hidden border-b border-base-200">
            {topAvatars.map((_, i) => (
                <div key={i} className="flex-shrink-0">
                    <div className="skeleton w-14 h-14 rounded-full" />
                </div>
            ))}
            {/* <span className="text-sm text-primary font-medium opacity-50">and more..</span> */}
        </div>

        {/* 2. Section Header */}
        <div className="px-5 pt-6 pb-2">
            <div className="skeleton h-6 w-20 mb-4" /> {/* "Recents" placeholder */}
        </div>

        {/* 3. Main List */}
        <div className="flex-1 overflow-y-auto px-5 space-y-6">
            {listItems.map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
                {/* Avatar + Status Dot */}
                <div className="relative flex-shrink-0">
                    <div className="skeleton w-14 h-14 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-base-100 bg-base-300" />
                </div>

                {/* Content (Name + Preview) */}
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                        <div className={`skeleton h-4 ${idx % 3 === 0 ? 'w-32' : 'w-24'}`} />
                        <div className="skeleton h-3 w-10" /> {/* Timestamp */}
                    </div>
                    <div className="skeleton h-3 w-full max-w-[200px] opacity-60" />
                </div>
            </div>
            ))}
        </div>

        {/* 4. Floating Action Button (FAB) Placeholder */}
        <div className="fixed bottom-25 right-10">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Plus className="text-primary/40 w-8 h-8" />
            </div>
        </div>
        </div>
    );
};

export default ListViewSkeleton;