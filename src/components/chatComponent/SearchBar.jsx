import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { Search } from "lucide-react";

const SearchBar = () => {
    const { searchUsers, searchTerm, setSearchTerm } = useChatStore();
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };
    useEffect(() => {
        
        const handleSearch = async () => {
            try {
                await searchUsers(searchTerm);
            } catch (error) {
                console.error("Error searching users:", error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        console.log("Search term changed:", searchTerm);
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, searchUsers]);

    return (
        <div className="relative">
            <Search className="absolute size-5 left-4 top-2 z-10 text-primary"/>
            <input className="absolute bg-base-100 rounded-full w-full py-2 px-11 active:border-0" type="search" onChange={handleInputChange} name="search" id="" value={searchTerm} placeholder="Search" />
        </div>
    )
}

export default SearchBar;