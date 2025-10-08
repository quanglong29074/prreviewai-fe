import React, { useState, useEffect } from 'react';
import type { Repository } from '../types';
import { SettingsIcon } from '../components/icons';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

interface RepositoriesPageProps {
    onNavigateToSettings: (repo: Repository) => void;
}

const REPOS_PER_PAGE = 10;

const RepositoriesPage: React.FC<RepositoriesPageProps> = ({ onNavigateToSettings }) => {
    const [allRepositories, setAllRepositories] = useState<Repository[]>([]);
    const [pagedRepositories, setPagedRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRepos, setTotalRepos] = useState<number>(0);
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const fetchRepositories = async () => {
            setLoading(true);
            setError(null);
            
            try {
                if (!token) {
                    setError("Authentication token not found. Please log in to view repositories.");
                    setLoading(false);
                    return;
                }

                // Fetch all repositories at once. The backend isn't paginating correctly.
                const response = await fetch(`http://localhost:3000/api/repos`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    cache: 'no-cache',
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Your session has expired. Please log in again.");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (!data.repositories || typeof data.total !== 'number') {
                    throw new Error("Invalid API response structure");
                }
                setAllRepositories(data.repositories);
                setTotalRepos(data.total);
                setTotalPages(Math.ceil(data.total / REPOS_PER_PAGE));
            } catch (e: unknown) {
                if (e instanceof Error) {
                    setError(`Failed to fetch repositories: ${e.message}`);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [token]); // Only run once on component mount

    // This effect handles the client-side pagination logic
    useEffect(() => {
        const startIndex = (currentPage - 1) * REPOS_PER_PAGE;
        const endIndex = startIndex + REPOS_PER_PAGE;
        setPagedRepositories(allRepositories.slice(startIndex, endIndex));
    }, [currentPage, allRepositories]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderContent = () => {
        if (loading) {
            return <Spinner />;
        }

        if (error) {
            return <div className="text-center py-10 text-red-400 bg-red-900/50 rounded-lg m-4 p-4">{error}</div>;
        }

        if (totalRepos === 0) {
            return (
                 <div className="text-center py-20 text-slate-400 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                    <p className="text-lg">No Repositories Found</p>
                    <p className="text-sm text-slate-500 mt-2">Connect your GitHub account to see your repositories.</p>
                </div>
            );
        }

        return (
            <>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {pagedRepositories.map((repo, index) => (
                                <tr 
                                    key={repo.id} 
                                    className="hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg hover:-translate-y-px animate-table-row"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-sky-400 transition-colors">
                                                {repo.full_name}
                                            </a>
                                            <div className={`text-xs inline-block ml-3 px-2 py-0.5 rounded-full border ${repo.private ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-green-500/10 text-green-300 border-green-500/20'}`}>
                                                {repo.private ? 'Private' : 'Public'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 max-w-md truncate">
                                        {repo.description || 'No description provided.'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => onNavigateToSettings(repo)}
                                            className="text-slate-400 hover:text-sky-400 p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 group"
                                            aria-label={`Settings for ${repo.name}`}
                                        >
                                            <div className="group-hover:rotate-90 transition-transform duration-300">
                                                <SettingsIcon />
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400 pb-2">Repositories</h1>
            {renderContent()}
        </div>
    );
};

export default RepositoriesPage;