import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "@/stores/useAdminStore";
import { formatYearTimestamp } from "@/util/formatMessageTimestamp";

export default function ReviewReport () {
    const { reports, updateReport, isUpdatingReport } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("pending");
    const [drafts, setDrafts] = useState({});

    const filteredReports = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return reports.filter((report) => {
            const matchesStatus = statusFilter === "all" || report.status === statusFilter;
            const reporter = report.reporter?.identity;
            const reported = report.reportedUser?.identity;
            const searchable = [
                reporter?.firstName,
                reporter?.lastName,
                reported?.firstName,
                reported?.lastName,
                report.reason,
                report.adminNotes,
            ].filter(Boolean).join(" ").toLowerCase();
            return matchesStatus && searchable.includes(query);
        });
    }, [reports, searchQuery, statusFilter]);

    const updateDraft = (report, field, value) => {
        setDrafts((current) => ({
            ...current,
            [report._id]: {
                status: current[report._id]?.status ?? report.status,
                adminNotes: current[report._id]?.adminNotes ?? report.adminNotes ?? "",
                [field]: value,
            },
        }));
    };

    const saveReport = async (report) => {
        const draft = drafts[report._id] ?? {};
        const saved = await updateReport(report._id, {
            status: draft.status ?? report.status,
            adminNotes: draft.adminNotes ?? report.adminNotes ?? "",
        });
        if (saved) {
            setDrafts((current) => {
                const next = { ...current };
                delete next[report._id];
                return next;
            });
        }
    };

    return (
        <>
            <div className="flex items-center justify-self-start gap-12 ">
                <Link to='/admin/dashboard'><ArrowLeft fontSize={25} /></Link>
                <h1 className="text-center text-[1.8rem] font-medium my-4">Review Report</h1>
            </div>
            <div className="relative">
                <Search fontSize={25} className="absolute left-2 top-2" />
                <input
                    type="text"
                    placeholder="Search Reports..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full border p-2 pl-10 rounded-[10px]" 
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter reports by status">
                {["pending", "reviewed", "resolved", "all"].map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        aria-pressed={statusFilter === status}
                        className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-ghost"}`}
                    >
                        {status === "all" ? "All" : status[0].toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div>
                {filteredReports.map((report) => {
                    const draft = drafts[report._id] ?? {};
                    const reporter = report.reporter?.identity;
                    const reportedUser = report.reportedUser?.identity;

                    return (
                        <article key={report._id} className="my-4 border border-base-300 bg-base-100 p-4">
                            <div className="flex flex-wrap items-start gap-4">
                                <img src={reporter?.profilePic || ""} alt="" className="h-12 w-12 rounded-full object-cover" />
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">
                                        {reporter?.firstName} {reporter?.lastName} reported {reportedUser?.firstName} {reportedUser?.lastName}
                                    </p>
                                    <p className="mt-1 text-sm text-base-content/70">Reason: {report.reason}</p>
                                    <p className="mt-1 text-xs text-base-content/60">Submitted {formatYearTimestamp(report.createdAt)}</p>
                                </div>
                                <span className="badge badge-outline">{report.status}</span>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-[minmax(12rem,0.4fr)_1fr]">
                                <label className="form-control">
                                    <span className="label-text mb-1">Review status</span>
                                    <select
                                        value={draft.status ?? report.status}
                                        onChange={(event) => updateDraft(report, "status", event.target.value)}
                                        className="select select-bordered"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </label>
                                <label className="form-control">
                                    <span className="label-text mb-1">Admin notes</span>
                                    <textarea
                                        value={draft.adminNotes ?? report.adminNotes ?? ""}
                                        onChange={(event) => updateDraft(report, "adminNotes", event.target.value)}
                                        maxLength={2000}
                                        rows={2}
                                        className="textarea textarea-bordered"
                                        placeholder="Add internal review notes"
                                    />
                                </label>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => saveReport(report)}
                                    disabled={isUpdatingReport}
                                    className="btn btn-primary btn-sm"
                                >
                                    {isUpdatingReport ? "Saving..." : "Save review"}
                                </button>
                            </div>
                        </article>
                    );
                })}
                {filteredReports.length === 0 && (
                    <p className="py-10 text-center text-base-content/60">No reports match this filter.</p>
                )}
            </div>

        </>
    );
}