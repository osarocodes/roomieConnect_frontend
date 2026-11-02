import { useState, useEffect } from "react";
import { Delete, Edit, ArrowLeft, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "@/stores/useAdminStore";
import EditUser from "@/components/adminComponent/editUser";

export default function UserManagement () {
    const { users, fetchUsers, isLoadingUsers } = useAdminStore();
    const { setUserToEdit, clearUserToEdit, deleteUser, isDeletingUser } = useAdminStore();

    const [ open, setOpen ] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        clearUserToEdit();
        setOpen(false);
    };

    const handleDelete = async (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (confirmed) {
            await deleteUser(userId);
        }
    };

    if (isLoadingUsers) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-base-content/70">No users found.</p>
            </div>
        );
    }

    if (isDeletingUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-base-content/70"> 
                    <Loader className="animate-spin" />
                </p>
            </div>
        );
    }

    if (open) {
        return (
                <EditUser handleClose={handleClose} />
        );
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredUsers = users.filter((user) =>
        `${user.identity.firstName} ${user.identity.lastName} ${user.identity.email}`
            .toLowerCase()
            .includes(normalizedQuery)
    );

    return (
        <>
            <div className="flex items-center justify-self-start gap-12 ">
                <Link to='/admin/dashboard'><ArrowLeft size={25} /></Link>
                <h1 className="text-center text-[1.8rem] font-medium my-4">User Management</h1>
            </div>
            <div className="relative">
                <Search size={25} className="absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Search Users..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full border p-2 pl-10 rounded-[10px]" />
            </div>

            <div className="space-y-3 mt-5 rounded-lg max-h-[500px]">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="flex items-center gap-5 p-3 border-base-300 rounded-lg shadow">
                        <div>
                            <img src={user.identity.profilePic} alt={user.identity.name} className="w-12 h-12 rounded-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xl font-medium">{user.identity.firstName}</p>
                            <p className="text-base-content/70">{user.identity.email}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.identity.role === "Admin" ? "bg-secondary text-secondary-content" : "bg-success text-success-content"}`}>
                                    {user.identity.role}
                                </span>
                                {/* <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.identity.verified ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                                        {user.identity.verified ? "Verified" : "Unverified"}
                                    </span>
                                </div> */}
                                <button className="text-base-content/70 hover:text-base-content" onClick={handleOpen}>
                                    <span className="flex items-center gap-1" onClick={() => setUserToEdit(user)}>
                                        <Edit size={20} />
                                        Edit
                                    </span>
                                </button>
                                <button className="text-base-content/70 hover:text-base-content" onClick={() => handleDelete(user._id)}>
                                    <span className="flex items-center gap-1">
                                        <Delete size={20} />
                                        Remove
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredUsers.length === 0 && (
                    <p className="text-center text-base-content/70">No users match that search.</p>
                )}
            </div>

    </>
    )
} 