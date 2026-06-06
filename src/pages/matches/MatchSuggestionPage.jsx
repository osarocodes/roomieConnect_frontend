import { NavLink } from "react-router-dom";
// import mockMatches from "../../data/mockMatches";
import { useMatchStore } from "@/stores/useMatchStore";
import { formatDob } from "@/lib/utils";
import { LucideRefreshCcw } from "lucide-react";

export default function MatchSuggestionPage() {
    const { matches } = useMatchStore();
    console.log("Matches from store:", matches);

    return (
        <>
            <h1 className="text-2xl font-medium py-3 text-center">Suggested Matches</h1>
            <div className="grid grid-cols-2 gap-4">
                {matches.map((match) => (
                    <div key={match.user._id} className="card bg-base-100 shadow-xl">
                        <figure className="px-10 pt-10">
                            <img src={match.user.identity.profilePic} alt={match.name} className="w-16 h-16 rounded-full object-cover mb-2 mx-auto" />
                        </figure>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{match.user.identity.firstName} {match.user.identity.lastName}, {formatDob(match.user.identity.dob)}</h2>
                            <p className="badge bg-primary/10 py-2 size-fit"><span className="text-primary">{match.compatibility}%</span> compatible</p>
                            <p>{match.user.university.department}</p>
                            <div className="card-actions">
                                <NavLink to={`/match-details/${match.user._id}`} className="btn btn-primary">View Details</NavLink>
                            </div>
                        </div>
                    </div>
                ))}
                {matches.length === 0 && (
                    <p className="text-center col-span-2">No match suggestions available at the moment. Please check back later.</p>
                )}
                <div className="col-span-2 text-center mt-4">
                    {/* Refresh button to get new matches */}
                    <button className="btn" onClick={() => window.location.reload()}>
                        <LucideRefreshCcw className="inline-block mr-2" />
                        Refresh Matches
                    </button>
                </div>
            </div>
        </>
    );
}