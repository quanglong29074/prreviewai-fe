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
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRepos, setTotalRepos] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const token = localStorage.getItem('jwt');

    // 🕒 Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // 📦 Fetch repositories
    useEffect(() => {
        const fetchRepositories = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `http://localhost:3000/api/repos?page=${currentPage}&limit=${REPOS_PER_PAGE}&search=${encodeURIComponent(
                        debouncedSearch
                    )}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setRepositories(data.repositories || []);
                setTotalRepos(data.total || 0);
                setTotalPages(data.totalPages || 1);
            } catch (e: any) {
                setError(e.message || 'Error fetching repositories.');
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories();
    }, [currentPage, token, debouncedSearch]);

    const renderContent = () => {
        if (loading) return <Spinner />;
        if (error)
            return (
                <div className="text-red-400 bg-red-900/40 rounded-lg p-4 text-center">
                    {error}
                </div>
            );
        if (totalRepos === 0)
            return (
                <div className="text-center py-20 text-slate-400 bg-slate-800/60 border border-slate-700/40 rounded-xl transition-opacity animate-fadein">
                    <p className="text-lg">No Repositories Found</p>
                    <p className="text-sm text-slate-500 mt-2">Try searching or add a new repository.</p>
                </div>
            );

        return (
            <>
                <div className="bg-slate-800/70 rounded-xl border border-slate-700/50 overflow-x-auto shadow-md transition-opacity animate-fadein">
                    <table className="min-w-full">
                        <thead className="bg-slate-900/70">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repositories.map((repo) => (
                                <tr key={repo.id} className="hover:bg-slate-700/40 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-white hover:text-sky-400 transition-colors"
                                            >
                                                {repo.full_name}
                                            </a>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${
                                                    repo.private
                                                        ? 'bg-red-500/10 text-red-300 border-red-500/20'
                                                        : 'bg-green-500/10 text-green-300 border-green-500/20'
                                                }`}
                                            >
                                                {repo.private ? 'Private' : 'Public'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400 truncate max-w-md">
                                        {repo.description || 'No description'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onNavigateToSettings(repo)}
                                            className="text-slate-400 hover:text-sky-400 p-2 rounded-full transition-all duration-150 hover:scale-105"
                                        >
                                            <SettingsIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {/* 🔹 Header + Add button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400 drop-shadow-sm animate-fadein">
                    Repositories
                </h1>

                <button
                    onClick={() => window.open('https://github.com/apps/pr-review-code-al/installations/select_target', '_blank')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-md transition-all hover:scale-105"
                >
                    <span className="text-lg font-bold">+</span> Add Repository
                </button>
            </div>

            {/* 🔍 Search input below title */}
            <div className="flex w-full sm:w-80">
                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                />
            </div>

            {renderContent()}
        </div>
    );
};

export default RepositoriesPage;
