import { useEffect, useState } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import { useChatStore } from '@/stores/useChatStore';
import { X, Loader2 } from 'lucide-react';

export default function EditUser({ handleClose }) {
    const { userToEdit, updateUserRole, isUpdatingRole, verifyStudent, isVerifyingStudent } = useAdminStore();
    const { getUsers } = useChatStore();
    const [selectedRole, setSelectedRole] = useState(userToEdit?.identity.role || 'User');
    const [verifyStatus, setVerifyStatus] = useState(userToEdit?.university.verifiedStudentStatus || false);

    useEffect(() => {
        if (!userToEdit) {
            handleClose();
        } else {
            setSelectedRole(userToEdit.identity.role);
            setVerifyStatus(userToEdit.university.verifiedStudentStatus);
        }
    }, [userToEdit, handleClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedUserRole = {
            role: selectedRole,
            verifiedStudentStatus: verifyStatus
        };
        console.log(updatedUserRole)
        
        try {
            if (updatedUserRole.role !== userToEdit.identity.role) {
                await updateUserRole(userToEdit._id, updatedUserRole.role);
            }
            if (updatedUserRole.verifiedStudentStatus !== userToEdit.university.verifiedStudentStatus) {
                await verifyStudent(userToEdit._id, updatedUserRole.verifiedStudentStatus);
            }
            // Refetch users to update the display in UserManagement
            await getUsers();
            handleClose();
        } catch (error) {
            console.error("Failed to update user role:", error);
        }
    };

    return (
        <div>
            <div className='flex items-center gap-12'>
                <X size={30} className="cursor-pointer" onClick={handleClose}/>
                <h3 className="text-[1.8rem] font-medium">Edit User Details</h3>
            </div>
            <div className="mt-4 p-4 border rounded-lg shadow">
                {userToEdit && (
                    <form onSubmit={handleSubmit} className='grid grid-cols-[auto_1fr] gap-4 gap-x-6'>
                        <label htmlFor="firstName" className='text-2xl font-bold'>First Name:</label>
                        <input type="text" id="firstName" defaultValue={userToEdit.identity.firstName} className='px-3 border rounded'/>
                        
                        <label htmlFor="lastName" className='text-2xl font-bold'>Last Name:</label>
                        <input type="text" id="lastName" defaultValue={userToEdit.identity.lastName} className='px-3 py-2 border rounded'/>

                        <label htmlFor="email" className='text-2xl font-bold'>Email:</label>
                        <input type="email" id="email" defaultValue={userToEdit.identity.email} className='px-3 py-2 border rounded'/>
                        
                        <label htmlFor="role" className='text-2xl font-bold'>Role:</label>
                        {isUpdatingRole ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <select 
                                id="role" 
                                value={selectedRole} 
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className='px-3 py-2 border rounded'
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        )}
                        <label htmlFor="verify" className='text-2xl font-bold'>Verify:</label>
                        {isVerifyingStudent ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <input type="checkbox" id='verify' checked={verifyStatus} onChange={(e) => setVerifyStatus(e.target.checked)} className='size-5 border rounded '/>
                        )}
                        <button type="submit" className="mt-4 col-span-2 bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
                    </form>
                )}
            </div>
            <div className="grid grid-cols-2 ">
                <button className='shadow rounded-lg mt-4 p-4 text-xl font-black font-mono bg-red-500 text-white col-span-2'>Suspend</button>
            </div>
        </div>
    );
}