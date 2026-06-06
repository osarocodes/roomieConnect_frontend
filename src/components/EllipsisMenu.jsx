import React, { useState, useRef, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function EllipsisMenu({ className = "", prop0, prop1, prop2, prop3, prop4, prop5 }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const firstItemRef = useRef(null);
    

  // Close on outside click or Escape
    useEffect(() => {
        const onDocClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("touchstart", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("touchstart", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

  // Focus first menu item when opened
    useEffect(() => {
        if (open) firstItemRef.current?.focus();
    }, [open]);



    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <button
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls="ellipsis-menu"
                onClick={() => setOpen((s) => !s)}
                className="p-2 rounded focus:outline-none focus:ring"
            >
                <EllipsisVertical size={24} />
            </button>

            {open && (
                <div
                    id="ellipsis-menu"
                    role="menu"
                    aria-label="More actions"
                    className="absolute right-0 mt-2 w-34 bg-base-300 rounded shadow-md"
                >
                    <button
                        role="menuitem"
                        ref={firstItemRef}
                        onClick={() => { prop0(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-base-200"
                    >
                        {prop1}
                    </button>
                    <button
                        role="menuitem"
                        onClick={() => { prop2(); setOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-base-200"
                    >
                        {prop3}
                    </button>
                    <button
                        role="menuitem"
                        onClick={prop4}
                        className="w-full text-left px-4 py-2 hover:bg-base-200"
                    >
                        {prop5}
                    </button>
                    <div>
                        <hr className="my-1 border-base-200" />
                        <p className="px-4 py-2 text-xs">ImpactCode V1.0.0</p>
                    </div>
                </div>
            )}
        </div>
    );
}