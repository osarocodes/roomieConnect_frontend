import { useEffect } from 'react';
import { ArrowLeft, 
    Moon, 
    Sparkles, 
    Coffee, 
    BookOpen, 
    PawPrint, 
    Cigarette, 
    Utensils, 
    Volume2, 
    Wallet, 
    Calendar, 
    Book, 
    MapPin, 
    GraduationCap,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Loader
} from 'lucide-react';
// import matches from '../../data/mockMatches';
import { useMatchStore } from '@/stores/useMatchStore';
import { useChatStore } from '@/stores/useChatStore';
import { useNavigate } from 'react-router-dom';
import { formatDob } from '@/lib/utils';
import { useParams } from 'react-router-dom';

export default function MatchDetailsPage() {
    const { matches, isLoadingMatches, getRecommendedMatches } = useMatchStore();
    const { createOrGetConversation } = useChatStore();
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("The parameter: ", id)
    console.log("Matches from store:", matches);
    const match = matches.find(match => match.user._id === id);
    console.log("Match Details:", match);

    useEffect(() => {
        getRecommendedMatches();
    }, [getRecommendedMatches]);

    if (!match) {
        return <div>Match not found</div>;
    }

    if (isLoadingMatches) {
        return (
            <div className='flex items-center justify-center gap-2 mt-10'>
                <Loader className='animate-spin' />
                Loading...
            </div>
        );
    }
    const handleStartChat = async (matchUserId) => {
        try {
            const conversation = await createOrGetConversation(matchUserId);
            navigate(`/chat/${conversation._id}`);
        } catch (error) {
            console.error('Failed to start conversation', error);
        }
    };

    return (
        <div className=''>

            <main className="flex flex-col gap-6 mt-10 px-3">
                <div className='border border-base-300 bg-base-300 rounded-lg p-4 flex flex-col items-center justify-center'>
                    <img src={match.user.identity.profilePic} className='w-40 h-40 rounded-full object-cover' alt={`${match.name}'s avatar`} />
                    <p className='text-2xl'><b>{match.user.identity.firstName} {match.user.identity.lastName}</b></p>
                    <p>{formatDob(match.user.identity.dob)} years old • {match.user.university.department} </p>
                    <h2>{match.user.university.level}</h2>
                    <div className=''>
                        {match.user.university.verifiedStudentStatus ? (
                            <p className='text-green-500 font-medium rounded-2xl px-2 '>
                                <ShieldCheck size={18} className='inline mr-1' />
                                Verified Student
                            </p>
                        ) : (
                            <p className='text-red-400 px-2 font-medium rounded-2xl '>
                                <ShieldAlert size={20} className='inline mr-1' />
                                Unverified Student
                            </p>
                        )}
                    </div>
                    <p className="bg-primary text-primary-content rounded-2xl px-2 py-1 my-2 text-[15px]">{match.compatibility}% compatible</p>
                </div>
                <div className='border border-base-300 rounded-lg p-4'>
                    <h3 className='border-b border-base-300 pb-2 text-xl'>About {match.user.identity.firstName}</h3>
                    <p className='mt-3'>{match.user.profile.about}</p>
                </div>
                <div className='border border-base-300 rounded-lg p-4'>
                    <h3 className='border-b border-base-300 pb-2 mb-3 text-xl'>Lifestyle Habits</h3>
                    <div className='flex flex-col gap-2 mb-2'>
                        <div>
                            <p className='flex items-center font-extralight'><Moon size={20} className='mr-2 text-primary' />Sleep Schedule</p>
                            <p className='ml-7'>{match.user.lifestyleHabits.sleepSchedule}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Sparkles size={20} className='mr-2 text-primary'/>Cleanliness</p>
                            <p className='ml-7'>{match.user.lifestyleHabits.cleanliness}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Coffee size={20} className='mr-2 text-primary'/>Social Habits</p>
                            <p className='ml-7'>{match.user.lifestyleHabits.socialHabits}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><BookOpen size={20} className='mr-2 text-primary'/>Study Habits</p>
                            <p className='ml-7'>{match.user.lifestyleHabits.studyHabits}</p>
                        </div>
                    </div>
                </div>

                <div className='border border-base-300 rounded-lg p-4'>
                    <h3 className='border-b border-base-300 pb-2 mb-3 text-xl'>Preferences</h3>
                    <div className='flex flex-col gap-2 mb-2'>
                        <div>
                            <p className='flex items-center font-extralight'><PawPrint size={20} className='mr-2 text-primary'/> Pets</p>
                            <p className='ml-7'>{match.user.preferences.petPerson}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Cigarette size={20} className='mr-2 text-primary'/>Smoking</p>
                            <p className='ml-7'>{match.user.preferences.cigaretteSmoker}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Utensils size={20} className='mr-2 text-primary'/>Shared Meals</p>
                            <p className='ml-7'>{match.user.preferences.sharingPersonalItems}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Volume2 size={25} className='mr-2 text-primary'/>Music</p>
                            <p className='ml-7'>{match.user.preferences.musicVolume}</p>
                        </div>
                    </div>
                </div>

                <div className='border border-base-300 rounded-lg p-4'>
                    <h3 className='border-b border-base-300 pb-2 mb-3 text-xl'>Budget</h3>
                    <div>
                        <div>
                            <p className='flex items-center font-extralight'><Wallet size={20} className='mr-2 text-primary' />Rent Range</p>
                            <p className='ml-7'>{match.user.budget.rentRange.min} - {match.user.budget.rentRange.max}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Calendar size={20} className='mr-2 text-primary' />Utilities</p>
                            <p className='ml-7'>{'Not specified'}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><Book size={20} className='mr-2 text-primary' />Security Deposit</p>
                            <p className='ml-7'>{'Not specified'}</p>
                        </div>
                    </div>
                </div>

                <div className='border border-base-300 rounded-lg p-4'>
                    <h3 className='border-b border-base-300 pb-2 mb-3 text-xl'>Location Preference</h3>
                    <div>
                        <div>
                            <p className='flex items-center font-extralight'><MapPin size={20} className='mr-2 text-primary' />Prefered Area</p>
                            <p className='ml-7'>{match.user.locationPreference.preferredArea}</p>
                        </div>
                        <div>
                            <p className='flex items-center font-extralight'><GraduationCap size={20} className='mr-2 text-primary' />Proximity to University</p>
                            <p className='ml-7'>{'Not specified'}</p>
                        </div>
                    </div>
                </div>

                {/* <Link to={`/chat/${match.user._id}`} className="btn btn-primary text-primary-content text-center font-medium mt-4 mb-8 py-2 px-4">
                    Send Message
                </Link> */}
                <button
                    onClick={() => handleStartChat(match.user._id)}
                    className="btn btn-primary w-full text-primary-content text-center font-medium mt-4 mb-8 py-2 px-4"
                >
                    Send Message
                </button> 

            </main>
        </div>
    );
}