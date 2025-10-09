import React, { useState, useEffect, useMemo } from 'react';
import { PullRequestSummary } from '../types';
import Spinner from '../components/Spinner';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50
                    hover:bg-slate-800/80 hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-3 rounded-full shadow-inner transition-all duration-300 group-hover:from-sky-600 group-hover:to-sky-700">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    const [summaries, setSummaries] = useState<PullRequestSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummaries = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    setError("Authentication token not found. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:3000/api/pr-summary', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                     if (response.status === 401) {
                        throw new Error("Your session has expired. Please log in again.");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: PullRequestSummary[] = await response.json();
                setSummaries(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(`Failed to fetch dashboard data: ${e.message}`);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSummaries();
    }, []);

    const stats = useMemo(() => {
        if (!summaries || summaries.length === 0) {
            return {
                totalPRs: 0,
                totalCommits: 0,
                totalComments: 0,
                avgCommits: 0,
            };
        }

        const totalPRs = summaries.length;
        const totalCommits = summaries.reduce((sum, pr) => sum + (pr.commits || 0), 0);
        const totalComments = summaries.reduce((sum, pr) => sum + (pr.comments || 0), 0);
        const avgCommits = totalPRs > 0 ? (totalCommits / totalPRs).toFixed(1) : 0;

        return { totalPRs, totalCommits, totalComments, avgCommits };
    }, [summaries]);

    const renderContent = () => {
        if (loading) {
            return <Spinner />;
        }
        if (error) {
            return <div className="text-center py-10 text-red-400 bg-red-900/50 rounded-lg m-4 p-4">{error}</div>;
        }
        if (summaries.length === 0) {
            return (
                <div className="text-center py-20 text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                    <p className="text-lg">No Active Pull Requests</p>
                    <p className="text-sm text-slate-500 mt-2">Everything is up to date!</p>
                </div>
            );
        }

        return (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Repository</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Pull Request</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Commits</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Review Comments</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Comments</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {summaries.map((pr, index) => {
                            const prNumber = pr.url_pull_request.split('/').pop();
                            return (
                                <tr 
                                    key={pr.id} 
                                    className="hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-px animate-table-row"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={pr.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-sky-400 transition-colors">
                                            {pr.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <a href={pr.url_pull_request} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-300 hover:text-sky-400 transition-colors">
                                            #{prNumber}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">{pr.commits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">{pr.review_comments}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-300">{pr.comments}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400 pb-2">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Pull Requests" value={stats.totalPRs} icon={<PullRequestIcon />} />
                <StatCard title="Total Commits" value={stats.totalCommits} icon={<CommitsIcon />} />
                <StatCard title="Total Comments" value={stats.totalComments} icon={<CommentsIcon />} />
                <StatCard title="Avg. Commits / PR" value={stats.avgCommits} icon={<ChartIcon />} />
            </div>
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Recent Pull Request Activity</h2>
                {renderContent()}
            </div>
        </div>
    );
};

const PullRequestIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 8A5 5 0 008 8m-2 8v2a2 2 0 002 2h8a2 2 0 002-2v-2m-4-6l-4 4m0 0l4 4m-4-4h12" />
    </svg>
);
const CommitsIcon: React.FC = () => (
   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
   </svg>
);
const CommentsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const ChartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export default DashboardPage;