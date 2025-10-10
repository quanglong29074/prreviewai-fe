import React from "react";
import Pagination from "./Pagination";
import Spinner from "./Spinner";

interface PullRequestSummary {
    id: number;
    user_id: number;
    name: string;
    url: string;
    url_pull_request: string;
    comments: number;
    review_comments: number;
    commits: number;
    created_at: string;
    updated_at: string;
}

interface PullRequestTableProps {
    summaries: PullRequestSummary[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const PullRequestTable: React.FC<PullRequestTableProps> = ({
    summaries,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
}) => {
    if (loading) {
        return <Spinner />;
    }
    if (error) {
        return <div className="text-center py-10 text-red-400 bg-red-900/50 rounded-lg m-4 p-4">{error}</div>;
    }
    if (summaries.length === 0) {
        return (
            <div className="text-center py-20 text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <p className="text-lg">No Pull Requests Found</p>
                <p className="text-sm text-slate-500 mt-2">Try adjusting your filters</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Repository
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Pull Request
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Commits
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Review Comments
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Comments
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {summaries.map((pr) => {
                            const prNumber = pr.url_pull_request.split("/").pop();
                            return (
                                <tr
                                    key={pr.id}
                                    className="hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a
                                            href={pr.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-white hover:text-sky-400 transition-colors"
                                        >
                                            {pr.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a
                                            href={pr.url_pull_request}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-slate-300 hover:text-sky-400 transition-colors"
                                        >
                                            #{prNumber}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                                        {pr.commits}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                                        {pr.review_comments}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">
                                        {pr.comments}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </>
    );
};

export default PullRequestTable;
