import React, { useState } from 'react';
import { Page, Repository } from './types';
import DashboardPage from './pages/DashboardPage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepositorySettingsPage from './pages/RepositorySettingsPage';
import { DashboardIcon, RepoIcon } from './components/icons';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

    const handleNavigateToSettings = (repo: Repository) => {
        setSelectedRepo(repo);
        setCurrentPage(Page.REPOSITORY_SETTINGS);
    };

    const handleBackToRepositories = () => {
        setSelectedRepo(null);
        setCurrentPage(Page.REPOSITORIES);
    };
    
    const renderPage = (): React.ReactNode => {
        switch (currentPage) {
            case Page.DASHBOARD:
                return <DashboardPage />;
            case Page.REPOSITORIES:
                return <RepositoriesPage onNavigateToSettings={handleNavigateToSettings} />;
            case Page.REPOSITORY_SETTINGS:
                if (selectedRepo) {
                    return <RepositorySettingsPage repository={selectedRepo} onBack={handleBackToRepositories} />;
                }
                // Fallback if no repo is selected (e.g., URL manipulation)
                return <RepositoriesPage onNavigateToSettings={handleNavigateToSettings} />;
            default:
                return <DashboardPage />;
        }
    };
    
    const NavItem: React.FC<{
        page: Page;
        icon: React.ReactNode;
        label: string;
        isActive: boolean;
        onClick: (page: Page) => void;
    }> = ({ page, icon, label, isActive, onClick }) => (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onClick(page);
                }}
                className={`flex items-center p-2 text-base font-normal rounded-lg transition-all duration-200 ${
                    isActive
                        ? 'bg-sky-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700'
                }`}
            >
                {icon}
                <span className="ml-3">{label}</span>
            </a>
        </li>
    );

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            <aside className="w-64" aria-label="Sidebar">
                <div className="overflow-y-auto py-4 px-3 h-full bg-slate-800/60">
                     <div className="flex items-center pl-2.5 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-white">CodeGuardian</span>
                    </div>
                    <ul className="space-y-2">
                       <NavItem page={Page.DASHBOARD} icon={<DashboardIcon />} label={Page.DASHBOARD} isActive={currentPage === Page.DASHBOARD} onClick={setCurrentPage} />
                       <NavItem page={Page.REPOSITORIES} icon={<RepoIcon />} label={Page.REPOSITORIES} isActive={currentPage === Page.REPOSITORIES || currentPage === Page.REPOSITORY_SETTINGS} onClick={setCurrentPage} />
                    </ul>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;