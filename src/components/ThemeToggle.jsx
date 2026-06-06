import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();
    const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

    // Keep local state in sync with the store
    useEffect(() => {
        setIsDarkMode(theme === "dark");
    }, [theme]);

    const handleChange = (e) => {
        const checked = e.target.checked;
        setIsDarkMode(checked);
        setTheme(checked ? "dark" : "light");
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer select-none" aria-label="Toggle theme">
            Theme &nbsp;
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={handleChange}
                aria-checked={isDarkMode}
            />

            {/* The Track */}
            <div className="w-10 h-4 bg-gray-200 peer-checked:bg-black rounded-full transition-colors duration-300 flex items-center ">

                {/* The Sliding Thumb & Icons */}
                <div className={`z-10 size-4 bg-white rounded-full shadow-md flex items-center justify-center transition-transform duration-300 transform ${isDarkMode ? 'translate-x-6' : ''}`}>
                    {isDarkMode ? (
                        <Moon className="text-black size-3" />
                    ) : (
                        <Sun className="text-gray-500 size-3" />
                    )}
                </div>
            </div>
        </label>
    );
};

export default ThemeToggle;