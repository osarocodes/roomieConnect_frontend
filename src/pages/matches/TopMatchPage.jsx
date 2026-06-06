import { NavLink } from "react-router-dom";
import { useMatchStore } from "@/stores/useMatchStore";
import { useChatStore } from "@/stores/useChatStore";
import { formatDob } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TopMatchPage() {
    const { matches, isLoadingMatches, getRecommendedMatches } = useMatchStore();
    const { createOrGetConversation } = useChatStore();

    const navigate = useNavigate();

    useEffect(() => {
        // Only fetch if we don't have matches yet
        if (matches.length === 0) {
            window.scrollTo(0, 0);
            getRecommendedMatches();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoadingMatches) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <Loader2 className="animate-spin" size={48} />
                <p className="mt-4 text-lg">Loading your top match...</p>
            </div>
        )
    }
    
    if (!matches || matches.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className="text-2xl font-bold">Match not found</h1>
                <NavLink to="/home" className="mt-4 text-info hover:underline">Go back home</NavLink>
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
    console.log(matches);
    
    const topMatch = matches.reduce((prev, curr) => (prev.compatibility > curr.compatibility ? prev : curr));

    return (
        <div className="p-4">
            <div className="text-center">
                <h1 className="font-medium text-4xl py-5">Your Top Match</h1>
                <p className="text-base-content/70">Meet your most compatible roommate <br /> suggestion!</p>
            </div>

            <div className="card bg-base-100 shadow-xl mt-6 max-w-md mx-auto">
                <div className="card-body">
                    <div className="flex items-center">
                        <div className="avatar mr-4">
                            <div className="w-24 rounded-full">
                                <img src={topMatch.user.identity.profilePic} alt="Top Match" />
                            </div>
                        </div>
                        <div>
                            <h2 className="card-title">{topMatch.user.identity.firstName} {topMatch.user.identity.lastName}, {formatDob(topMatch.user.identity.dob)}</h2>
                            <p className="text-base-content/70">{topMatch.user.university.department}</p>
                            <p className="text-xs text-base-content/50">{topMatch.user.profile.interests.join(", ")}</p>
                        </div>
                    </div>

                    <div className="bg-base-200 rounded-lg p-4 mt-4 text-center flex flex-col items-center">
                        <div className="radial-progress text-primary bg-base-300" style={{"--value": `${topMatch.compatibility || 0}`, "--size": "6rem", "--thickness": "0.5rem"}} role="progressbar">
                            <span className="text-2xl font-bold text-base-content">{topMatch.compatibility}%</span>
                        </div>
                        <p className="text-base-content/70 font-medium mt-2">Match</p>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Why You'll Get Along</h3>
                        <ul className="list-disc list-inside text-base-content/80">
                            {topMatch.reasons.map((reason, index) => (
                                <li key={index}>{reason}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="card-actions flex-col w-full">
                        <NavLink to={`/match-details/${topMatch.user._id}`} className="btn btn-primary w-full">
                            View Full Details
                        </NavLink>
                        <button
                            onClick={() => handleStartChat(topMatch.user._id)}
                            className="btn btn-primary w-full text-primary-content text-center font-medium mt-4 mb-8 py-2 px-4"
                            >
                            Send Message
                        </button> 
                    </div>
                </div>
            </div>
        </div>
    );
}