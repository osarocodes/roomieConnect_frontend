import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminStore } from "@/stores/useAdminStore";
import { formatYearTimestamp } from "@/util/formatMessageTimestamp";

export default function ReviewReport () {
    const { reports: Reports } = useAdminStore();

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
                    className="w-full border p-2 pl-10 rounded-[10px]" 
                />
            </div>

            <div>
                {Reports.map((report) => (
                    <div key={report._id} className="flex items-center gap-5 p-3 border-gray-700 rounded-lg shadow my-4">
                        <div>
                            <img src={report.reporter.identity.profilePic} alt={report.reporter} className="w-20 h-13 rounded-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-xl font-medium">{report.reporter.identity.firstName} {report.reporter.identity.lastName} reported {report.reportedUser.identity.firstName} {report.reportedUser.identity.lastName}</p>
                            <p className="text-gray-500">Reason: {report.reason}</p>
                            <p className="text-gray-500">Date: {formatYearTimestamp(report.createdAt)}</p>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}