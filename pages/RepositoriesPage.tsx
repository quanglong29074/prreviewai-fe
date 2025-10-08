import React, { useState, useEffect } from 'react';
import type { Repository } from '../types';
import { SettingsIcon } from '../components/icons';
import Spinner from '../components/Spinner';

interface RepositoriesPageProps {
    onNavigateToSettings: (repo: Repository) => void;
}

const RepositoriesPage: React.FC<RepositoriesPageProps> = ({ onNavigateToSettings }) => {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const token = localStorage.getItem('jwt');
                console.log(token)
                if (!token) {
                    setError("Authentication token not found. Please log in to view repositories.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:3000/api/repos', {
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

                const data = await response.json();
                if (!data.repositories) {
                    throw new Error("Invalid API response structure");
                }
                setRepositories(data.repositories);
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
    }, []);

    const renderContent = () => {
        if (loading) {
            return <Spinner />;
        }

        if (error) {
            return <div className="text-center py-10 text-red-400 bg-red-900/50 rounded-lg m-4 p-4">{error}</div>;
        }

        if (repositories.length === 0) {
            return <div className="text-center py-10 text-slate-400">No repositories found.</div>;
        }

        return (
            <div className="bg-slate-800/50 rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {repositories.map(repo => (
                            <tr key={repo.id} className="hover:bg-slate-800 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-sky-400 transition-colors">
                                        {repo.full_name}
                                    </a>
                                     <div className={`text-xs inline-block ml-2 px-2 py-0.5 rounded-full ${repo.private ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {repo.private ? 'Private' : 'Public'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 max-w-md truncate">
                                    {repo.description || 'No description provided.'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onNavigateToSettings(repo)}
                                        className="text-slate-400 hover:text-sky-400 p-2 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                                        aria-label={`Settings for ${repo.name}`}
                                    >
                                        <SettingsIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Repositories</h1>
            {renderContent()}
        </div>
    );
};

export default RepositoriesPage;