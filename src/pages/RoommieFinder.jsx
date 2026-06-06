import { useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMatchStore } from '@/stores/useMatchStore';

export default function RoommieFinder() {
    const navigate = useNavigate();
    const { getRecommendedMatches, isLoadingMatches, matches } = useMatchStore();

    useEffect(() => {
        if (matches?.length > 0) {
            navigate('/home', { replace: true });
        }
    }, [matches, navigate]);

    const onAction = async () => {
        if (navigator?.vibrate) navigator.vibrate(200);
        // Initiate and fetching matches
        const success = await getRecommendedMatches();
        if (success) {
            navigate('/home');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-200 px-6 overflow-hidden relative py-10">
            
            {/* Background Decorative Blobs using Theme Colors */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

            <div className="max-w-3xl w-full text-center z-10">
                {/* DaisyUI Badge */}
                <div className="badge badge-primary badge-outline gap- py-4 px-6 mb-8 uppercase tracking-widest text-xs font-bold animate-bounce">
                    <Sparkles size={14} />
                    Smart Matching Engine
                </div>

                {/* Headline using Theme Content colors */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-base-content leading-[1.05] mb-8 tracking-tighter">
                    Flatmate searching <br /> 
                    <span className="text-primary italic">made effortless.</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-base-content/70 leading-relaxed mb-12 max-w-xl mx-auto">
                    Find your ideal roommate with smart filters and seamless communication. 
                    Your perfect match is just <span className="text-secondary font-bold underline decoration-wavy decoration-1 underline-offset-4">5 minutes</span> away.
                </p>

                {/* Primary Action Button - DaisyUI Style */}
                <div className="flex flex-col items-center gap-4">
                    <button 
                        onClick={onAction}
                        disabled={isLoadingMatches}
                        className={`btn btn-primary btn-lg rounded-full px-12 h-20 text-lg shadow-2xl hover:shadow-primary/40 transition-all duration-500 group`}
                    >
                        {!isLoadingMatches && (
                            <>
                                Find that roommate!
                                <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                            </>
                        )
                        }
                        {isLoadingMatches && (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Scanning Database...
                            </>
                        )}
                    </button>
                    
                    <span className="text-xs uppercase font-bold tracking-widest text-base-content/40">No Credit Card Required</span>
                </div>

                {/* Trust Markers using DaisyUI Stats/Grid */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-base-100/50 backdrop-blur-md rounded-3xl border border-base-300 shadow-sm">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base-content">Verified</p>
                            <p className="text-xs text-base-content/50">Safe & Secure</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Zap size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base-content">Instant</p>
                            <p className="text-xs text-base-content/50">AI-Powered</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                            <Users size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-base-content">1.2k+</p>
                            <p className="text-xs text-base-content/50">Daily Matches</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}