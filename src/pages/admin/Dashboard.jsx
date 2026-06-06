import { 
    Users, 
    UserCheck, 
    Heart, 
    AlertTriangle, 
    Settings, 
    ShieldAlert, 
    UserCog,
    ChevronRight, 
    Zap
} from "lucide-react";
import { useEffect } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAdminStore } from "../../stores/useAdminStore";
import { formatYearTimestamp } from "@/util/formatMessageTimestamp";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { getUsers, users } = useChatStore();
    const { onlineUsers, connectSocket } = useAuthStore();
    const { fetchActivities, activities, reports, getReportedUsers } = useAdminStore();

    useEffect(() => {
        getUsers();
        connectSocket();
        fetchActivities();
        getReportedUsers();

    }, [getUsers, connectSocket, fetchActivities, getReportedUsers]);
    console.log("Admin Reports:", reports);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-base-300 pb-4">
                <h3 className="text-2xl font-bold text-base-content">Admin Overview</h3>
                <div className="badge badge-outline p-4 font-medium italic">v1.0.4</div>
            </div>

            {/* Analytics Overview using DaisyUI Stats */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-base-content/70">Analytics Overview</h2>
                <div className="stats shadow bg-base-100 w-full border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <Users size={28} />
                        </div>
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value text-primary">{users.length}</div>
                        <div className="stat-desc">21% more than last month</div>
                    </div>
                    
                    <div className="stat border-l border-base-200">
                        <div className="stat-figure text-secondary">
                            <UserCheck size={28} />
                        </div>
                        <div className="stat-title">Active Users</div>
                        <div className="stat-value text-secondary">{onlineUsers.length}</div>
                        <div className="stat-desc">94% engagement rate</div>
                    </div>

                    <div className="stat border-l border-base-200">
                        <div className="stat-figure text-accent">
                            <Heart size={28} />
                        </div>
                        <div className="stat-title">New Matches</div>
                        <div className="stat-value text-accent">200</div>
                        <div className="stat-desc">In the last 24 hours</div>
                    </div>

                    <div className="stat border-l border-base-200">
                        <div className="stat-figure text-error">
                            <AlertTriangle size={28} />
                        </div>
                        <div className="stat-title">Reports Filed</div>
                        <div className="stat-value text-error">{reports.length}</div>
                        <div className="stat-desc text-error">Requires attention</div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent User Activity using DaisyUI List/Avatar */}
                <section className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body p-6">
                        <h2 className="card-title text-xl mb-4 text-base-content">Recent User Activity</h2>
                        <div className="divide-y divide-base-200">
                            {activities.slice(0, 5).map((activity) => (
                                <div key={activity._id} className="flex items-center justify-between py-4 group hover:bg-base-200/30 transition-colors px-2 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                <img src={activity.userId.identity.profilePic} alt={activity.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold text-base-content">{activity.userId.identity.firstName} {activity.userId.identity.lastName}</p>
                                            <p className="text-sm text-base-content/60">{activity.activityType}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono opacity-50 uppercase tracking-widest">
                                        {formatYearTimestamp(activity.timestamp)}
                                    </span>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <div className="text-center py-10 text-base-content/50">
                                    No recent activities to display.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Quick Actions using DaisyUI Buttons */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-xl font-bold text-base-content">Quick Actions</h2>
                    <div className="flex flex-col gap-3">
                        <Link to='/admin/user-management' className="btn btn-ghost bg-base-100 border-base-300 justify-between h-auto py-4 shadow-sm hover:border-primary group">
                            <span className="flex items-center gap-4">
                                <UserCog className="text-primary" size={22} />
                                <span className="text-lg">Manage All Users</span>
                            </span>
                            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link to='/admin/review-report' className="btn btn-ghost bg-base-100 border-base-300 justify-between h-auto py-4 shadow-sm hover:border-error group">
                            <span className="flex items-center gap-4">
                                <ShieldAlert className="text-error" size={22} />
                                <span className="text-lg">Review Active Reports</span>
                            </span>
                            <div className="badge badge-error badge-sm">{reports.length}</div>
                        </Link>

                        <Link to='/admin/settings' className="btn btn-ghost bg-base-100 border-base-300 justify-between h-auto py-4 shadow-sm hover:border-accent group">
                            <span className="flex items-center gap-4">
                                <Settings className="text-accent" size={22} />
                                <span className="text-lg">Platform Settings</span>
                            </span>
                            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>

                    {/* Pro Tip Card */}
                    <div className="alert bg-primary/10 border-primary/20 mt-auto">
                        <Zap size={20} className="text-primary" />
                        <div>
                            <h3 className="font-bold text-primary">System Update</h3>
                            <div className="text-xs opacity-70">Server health is at 99.8%. No issues detected.</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}