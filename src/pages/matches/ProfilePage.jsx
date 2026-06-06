import { useState, useEffect } from "react";
import { Camera } from 'lucide-react';
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";


export default function ProfilePage() {
    const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
    const [isEditingRoommatePrefs, setIsEditingRoommatePrefs] = useState(false);
    const [user, setUser] = useState(authUser);

    useEffect(() => {
        console.log("Local user:", user)
    });
    
    useEffect(() => {
        if (authUser) setUser(authUser);
    }, [authUser]);


    const handleChange = (category) => (e) => {
        const { name, value, type, checked } = e.target;
        let newValue;

        if (type === 'checkbox') {
            // Map checkboxes to backend-friendly enum strings for preferences
            if (category === 'preferences' && name === 'cigaretteSmoker') {
                newValue = checked ? 'Smoker' : 'Non-smoker';
            } else if (category === 'preferences' && name === 'petPerson') {
                newValue = checked ? 'Pet-friendly' : 'No pets';
            } else {
                // Fallback: keep boolean for other checkbox-like fields
                newValue = checked;
            }
        } else {
            // Special case: budget.rentRange should be stored as { min, max }
            if (category === 'budget' && name === 'rentRange') {
                const cleaned = value.replace(/₦|,|\s/g, '');
                const nums = cleaned.match(/\d+/g)?.map(Number) || [];
                if (cleaned.toLowerCase().includes('less')) {
                    newValue = { min: 0, max: nums[0] || 90000 };
                } else if (cleaned.toLowerCase().includes('above')) {
                    newValue = { min: nums[0] || 230000, max: 999999999 };
                } else if (nums.length >= 2) {
                    newValue = { min: nums[0], max: nums[1] };
                } else {
                    newValue = value;
                }
            } else {
                newValue = value;
            }
        }

        setUser(prev => ({
            ...prev,
            [category]: {
                ...(prev[category] || {}),
                [name]: newValue
            }

        }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/avif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a valid image file (jpeg, png, gif, avif, webp).");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Profile picture size exceeds 5MB limit.");
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setUser(prev => ({
            ...prev,
            identity: {...prev.identity, profilePic: previewUrl}
        }));

        const form = new FormData();
        form.append('profilePic', file);

        try {
            await updateProfile(form);
        } catch (error) {
            console.error("Error updating profile picture:", error);
        } finally {
            e.target.value = "";
            // Revoke after image is consumed (onLoad handler on img is safer)
            const imgCleaner = new Image();
            imgCleaner.onload = () => URL.revokeObjectURL(previewUrl);
            imgCleaner.src = previewUrl;
        }
    };

    const hasChanges = () => {
        if (!authUser || !user) return false;
        const categories = ['identity', 'profile', 'lifestyleHabits', 'preferences', 'budget', 'locationPreference'];
        return categories.some(category => {
            const u = user[category] || {};
            const a = authUser[category] || {};
            const allKeys = new Set([...Object.keys(u), ...Object.keys(a)]);
            for (let key of allKeys) {
                if (u[key] !== a[key]) return true;
            }
            return false;
        });
    };

    const handleCancel = () => {
        setUser(authUser);
        setIsEditingPersonalInfo(false);
        setIsEditingRoommatePrefs(false);
    };

    const handleSave = async () => {
        if (!isEditingPersonalInfo && !isEditingRoommatePrefs) {
            setIsEditingPersonalInfo(true);
            setIsEditingRoommatePrefs(true);
            return;
        }

        if (!hasChanges()) {
            // no changes: revert and exit edit mode
            handleCancel();
            return;
        }

        const change = {};
        Object.keys(user).forEach(category => {
            const uCat = user[category] || {};
            const aCat = authUser[category] || {};
            Object.keys({ ...uCat, ...aCat }).forEach(key => {
                if (uCat[key] !== aCat[key]) {
                    change[`${category}.${key}`] = uCat[key];
                }
            });
        });

        setIsEditingPersonalInfo(false);
        setIsEditingRoommatePrefs(false);

        if (Object.keys(change).length > 0) {
            console.log("Changes to save:", change);
            try {
                await updateProfile(change);
            } catch (err) {
                console.error("Error saving profile changes:", err);
            }
        }
    };

    const getRentRangeString = (rentRange) => {
        if (!rentRange || typeof rentRange.min === 'undefined' || typeof rentRange.max === 'undefined') {
            return '';
        }
        const { min, max } = rentRange;

        if (max === 999999999) {
            return `Above ₦${min.toLocaleString('en-US')}`;
        }
        
        return `₦${min.toLocaleString('en-US')} - ₦${max.toLocaleString('en-US')}`;
    };

    const handlePrefMap = (data) => {
        const prefMap = {
            'Non-smoker': false,
            'Smoker': true,
            "It's in the past": false,
            'No pets': false,
            'Pet-friendly': true,
            'Depends': false
        };
        return prefMap[data] !== undefined ? prefMap[data] : data;
    }

    return (
        <main className="flex flex-col items-center px-4 pt-6 pb-24 space-y-6 overflow-y-auto bg-base-200">
            {/* Profile Picture */}
            <div className="card bg-base-100 shadow-xl items-center w-full max-w-md p-6 space-y-2">
                <div className="avatar">
                    <div className="w-28 rounded-full">
                        <img src={user.identity?.profilePic} alt="User avatar" />
                    </div>
                </div>
                <label className="btn btn-primary btn-outline btn-sm">
                    <Camera size={16} className="mr-2" />
                    Change Photo
                    <input type="file" className="hidden" onChange={handlePhotoChange} />
                </label>
            </div>

            {/* Personal Info */}
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <div className='flex justify-between items-center'>
                        <h2 className="card-title">Personal Information</h2>
                        {!isEditingPersonalInfo ? (
                            <button className="btn btn-xs btn-ghost text-primary" onClick={() => setIsEditingPersonalInfo(true)}>
                                EDIT
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        ) : hasChanges() ? (
                            <div className="flex items-center space-x-2">
                                <button className="btn btn-xs btn-primary" onClick={handleSave}>
                                    SAVE
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    {isUpdatingProfile && (
                                        <Loader2 />
                                    )}
                                </button>
                                <button className="btn btn-xs btn-ghost" onClick={handleCancel}>CANCEL</button>
                            </div>
                        ) : (
                            <button className="btn btn-xs btn-ghost" onClick={handleCancel}>CANCEL</button>
                        )}
                    </div>
                    {isEditingPersonalInfo && (
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">First Name</span></label>
                                    <input type="text" name="firstName" value={user.identity.firstName} onChange={handleChange('identity')} className="input input-bordered w-full" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Last Name</span></label>
                                    <input type="text" name="lastName" value={user.identity.lastName} onChange={handleChange('identity')} className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input type="email" name="email" value={user.identity.email} onChange={handleChange('identity')} className="input input-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number</span></label>
                                <input type="tel" name="phone" value={user.identity.phone} onChange={handleChange('identity')} className="input input-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Gender</span></label>
                                <select name="gender" value={user.identity.gender} onChange={handleChange('identity')} className="select select-bordered w-full">
                                    <option value='male'>male</option>
                                    <option value='female'>female</option>
                                    <option value='any'>any</option>
                                </select>
                            </div>

                            <div className='form-control'>
                                <label htmlFor='about' className=' label'><span className=' label-text '>About Me</span></label>
                                <textarea name='about' value={user.profile.about} onChange={handleChange('profile')} className=' textarea textarea-bordered w-full min-h-[80px]' />
                            </div>
                        </div>
                    )}

                    {!isEditingPersonalInfo && authUser && (
                        <div className="mt-4">
                            <div className='grid grid-cols-2 gap-3'>
                                < div className=' form-control ' >
                                    < label className=' label '>< span className=' label-text '>First Name</ span ></ label >
                                    < input type=' text ' name = 'firstName' value = { authUser.identity.firstName } disabled className = ' input input-bordered w-full ' />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Last Name</span></label>
                                    <input type="text" name="lastName" value={authUser.identity.lastName} disabled className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input type="email" name="email" value={authUser.identity.email} disabled className="input input-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Phone Number</span></label>
                                <input type="tel" name="phone" value={authUser.identity.phone} disabled className="input input-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Gender</span></label>
                                <select name="gender" value={authUser.identity.gender} disabled className="select select-bordered w-full">
                                    <option>male</option>
                                    <option>female</option>
                                    <option>any</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">About Me</span></label>
                                <textarea name="about" value={authUser.profile.about} disabled className="textarea textarea-bordered w-full min-h-[80px]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <h2 className="card-title">Academic Information</h2>

                    <div className="form-control">
                        <label className="label"><span className="label-text">University</span></label>
                        <input type="text" name="university" value="University of Benin" disabled className="input input-bordered w-full" />
                    </div>
                    <div className="form-control">
                        <label className="label"><span className="label-text">Major</span></label>
                        <input type="text" name="major" value={authUser.university.department} disabled className="input input-bordered w-full" />
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body">
                    <div className='flex justify-between items-center'>
                        <h2 className="card-title">Roommate Preferences</h2>
                        {!isEditingRoommatePrefs ? (
                            <button className="btn btn-xs btn-ghost text-primary" onClick={() => setIsEditingRoommatePrefs(true)}>
                                EDIT
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        ) : hasChanges() ? (
                            <div className="flex items-center space-x-2">
                                <button className="btn btn-xs btn-primary" onClick={handleSave}>
                                    SAVE
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button className="btn btn-xs btn-ghost" onClick={handleCancel}>CANCEL</button>
                            </div>
                        ) : (
                            <button className="btn btn-xs btn-ghost" onClick={handleCancel}>CANCEL</button>
                        )}
                    </div>

                    {isEditingRoommatePrefs ? (
                        <div className="mt-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Cleanliness Level</span></label>
                                <select name="cleanliness" value={user.lifestyleHabits?.cleanliness || ''} onChange={handleChange('lifestyleHabits')} className="select select-bordered w-full">
                                    <option value="Honestly, I only clean when someone's coming over.">Honestly, I only clean when someone's coming over.</option>
                                    <option value="I wait till I can’t take it anymore.">I wait till I can’t take it anymore.</option>
                                    <option value="I clean once I start feeling uncomfortable.">I clean once I start feeling uncomfortable.</option>
                                    <option value="I clean immediately.">I clean immediately.</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Preferred Gender</span></label>
                                <select name="preferredGender" value={user.preferences?.preferredGender || ''} onChange={handleChange('preferences')} className="select select-bordered w-full">
                                    <option value='male'>male</option>
                                    <option value='female'>female</option>
                                    <option value='any'>any</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Sleep Schedule</span></label>
                                <select name="sleepSchedule" value={user.lifestyleHabits?.sleepSchedule || ''} onChange={handleChange('lifestyleHabits')} className="select select-bordered w-full">
                                    <option value="Early sleeper, early riser.">Early sleeper, early riser.</option>
                                    <option value="Night owl, late mornings.">Night owl, late mornings.</option>
                                    <option value="Flexible, depends on the day.">Flexible, depends on the day.</option>
                                    <option value="I barely sleep.">I barely sleep.</option>
                                </select>
                            </div>
                            
                            <div className="form-control">
                                <label className="label"><span className="label-text">Noise Tolerance</span></label>
                                <select name="noiseTolerance" value={user.lifestyleHabits?.noiseTolerance || ''} onChange={handleChange('lifestyleHabits')} className="select select-bordered w-full">
                                    <option>I need complete silence.</option>
                                    <option>Low background noise is okay.</option>
                                    <option>I like music or people around.</option>
                                    <option>I thrive in chaos.</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Social Habits</span></label>
                                <select name="socialHabits" value={user.lifestyleHabits?.socialHabits || ''} onChange={handleChange('lifestyleHabits')} className="select select-bordered w-full">
                                    <option value="Party night, for sure.">Party night, for sure.</option>
                                    <option value="With a group, maybe an outing.">With a group, maybe an outing.</option>
                                    <option value="With 1-2 close friends.">With 1-2 close friends.</option>
                                    <option value="Alone in my space.">Alone in my space.</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Yearly Budget (split)</span></label>
                                <select name="rentRange" value={getRentRangeString(user.budget?.rentRange)} onChange={handleChange('budget')} className="select select-bordered w-full">
                                    {/* <option>{budget}</option> */}
                                    <option value="₦90,000 - ₦120,000">₦90,000 - ₦120,000</option>
                                    <option value="₦120,000 - ₦180,000">₦120,000 - ₦180,000</option>
                                    <option value="₦180,000 - ₦235,555">₦180,000 - ₦235,555</option>
                                    <option value="Above ₦235,555">Above ₦235,555</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Location Preference</span></label>
                                <select name="preferredArea" value={user.locationPreference?.preferredArea || ''} onChange={handleChange('locationPreference')} className="select select-bordered w-full">
                                    <option value="BDPA">BDPA</option>
                                    <option value="Osasogie">Osasogie</option>
                                    <option value="Ekosodin">Ekosodin</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Pets</span>
                                    <input name="petPerson" type="checkbox" checked={handlePrefMap(user.preferences?.petPerson)} onChange={handleChange('preferences')} className="checkbox" />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Smoker</span>
                                    <input name="cigaretteSmoker" type="checkbox" checked={handlePrefMap(user.preferences?.cigaretteSmoker)} onChange={handleChange('preferences')} className="checkbox" />
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text">Cleanliness Level</span></label>
                                <input type="text" name="cleanliness" value={authUser.lifestyleHabits?.cleanliness || ''} disabled className="select select-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Preferred Gender</span></label>
                                <input type="text" name="preferredGender" value={authUser.preferences?.preferredGender || ''} disabled className="select select-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Sleep Schedule</span></label>
                                <input type="text" name="sleepSchedule" value={authUser.lifestyleHabits?.sleepSchedule || ''} disabled className="select select-bordered w-full" />
                            </div>
                            
                            <div className="form-control">
                                <label className="label"><span className="label-text">Noise Tolerance</span></label>
                                <input type="text" name="noiseTolerance" value={authUser.lifestyleHabits?.noiseTolerance || ''} disabled className="select select-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Social Habits</span></label>
                                <input type="text" name="socialHabits" value={authUser.lifestyleHabits?.socialHabits || ''} disabled className="select select-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Yearly Budget</span></label>
                                <input type="text" name="rentRange" value={`₦${authUser.budget?.rentRange?.min || ''} - ₦${authUser.budget?.rentRange?.max || ''}`} disabled className="select select-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text">Location Preference</span></label>
                                <input type="text" name="preferredArea" value={authUser.locationPreference?.preferredArea || ''} disabled className="select select-bordered w-full" />
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Pets</span>
                                    <input name="petPerson" type="checkbox" checked={handlePrefMap(authUser.preferences?.petPerson)} className="checkbox" disabled />
                                </label>
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Smoker</span>
                                    <input name="cigaretteSmoker" type="checkbox" checked={handlePrefMap(authUser.preferences?.cigaretteSmoker)} className="checkbox" disabled />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}