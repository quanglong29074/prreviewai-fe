import React, { useState, useEffect } from 'react';
import { Page, Repository, User } from './types';
import DashboardPage from './pages/DashboardPage';
import RepositoriesPage from './pages/RepositoriesPage';
import RepositorySettingsPage from './pages/RepositorySettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { DashboardIcon, RepoIcon, HelpIcon, MenuIcon, CloseIcon, SyncIcon, UserIcon } from './components/icons';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>(Page.REPOSITORIES);
    const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('jwt');
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.clear();
        } finally {
            setIsInitialized(true);
        }
    }, []);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
        setCurrentPage(Page.REPOSITORIES);
    };

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
    };

    const handleNavigateToSettings = (repo: Repository) => {
        setSelectedRepo(repo);
        setCurrentPage(Page.REPOSITORY_SETTINGS);
        setIsSidebarOpen(false);
    };

    const handleBackToRepositories = () => {
        setSelectedRepo(null);
        setCurrentPage(Page.REPOSITORIES);
    };

    const handlePageChange = (page: Page) => {
        setCurrentPage(page);
        setIsSidebarOpen(false); // Close sidebar on navigation
    };
    
    const renderPage = (): React.ReactNode => {
        if (!user) return null; // Should not happen if logic is correct

        switch (currentPage) {
            case Page.DASHBOARD:
                return <DashboardPage />;
            case Page.REPOSITORIES:
                return <RepositoriesPage onNavigateToSettings={handleNavigateToSettings} />;
            case Page.REPOSITORY_SETTINGS:
                if (selectedRepo) {
                    return <RepositorySettingsPage repository={selectedRepo} onBack={handleBackToRepositories} />;
                }
                // Fallback if no repo is selected
                handlePageChange(Page.REPOSITORIES);
                return <RepositoriesPage onNavigateToSettings={handleNavigateToSettings} />;
            case Page.PROFILE:
                return <ProfilePage user={user} onLogout={handleLogout} />;
            default:
                return <RepositoriesPage onNavigateToSettings={handleNavigateToSettings} />;
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
                className={`flex items-center p-3 text-base font-semibold rounded-lg transition-all duration-200 group border-l-4 ${
                    isActive
                        ? 'bg-slate-700/80 text-white border-sky-400'
                        : 'text-slate-300 border-transparent hover:bg-slate-700/50 hover:border-sky-500/50'
                }`}
            >
                {icon}
                <span className="ml-3">{label}</span>
            </a>
        </li>
    );

    if (!isInitialized) {
        return <div className="h-screen w-screen bg-slate-900" />; // Or a proper loading screen
    }

    if (!user) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="relative h-screen bg-slate-900/50 text-white">
            <aside 
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} 
                aria-label="Sidebar"
            >
                <div className="overflow-y-auto py-4 px-3 h-full bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pl-2.5 mb-8">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-sky-400" viewBox="0 0 20 20" fill="currentColor">
                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="self-center text-xl font-bold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400">
                                   CodeGuardian
                                </span>
                            </div>
                             <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white p-1">
                                <CloseIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <ul className="space-y-2">
                           <NavItem page={Page.DASHBOARD} icon={<DashboardIcon />} label={Page.DASHBOARD} isActive={currentPage === Page.DASHBOARD} onClick={handlePageChange} />
                           <NavItem page={Page.REPOSITORIES} icon={<RepoIcon />} label={Page.REPOSITORIES} isActive={currentPage === Page.REPOSITORIES || currentPage === Page.REPOSITORY_SETTINGS} onClick={handlePageChange} />
                           <NavItem page={Page.PROFILE} icon={<UserIcon />} label={Page.PROFILE} isActive={currentPage === Page.PROFILE} onClick={handlePageChange} />
                        </ul>
                         <div className="mt-4 px-2">
                             <button className="w-full flex items-center justify-center p-2.5 text-sm font-semibold rounded-lg bg-sky-600/50 text-sky-200 hover:bg-sky-600/80 hover:text-white transition-all duration-200">
                                <SyncIcon />
                                <span className="ml-2">Sync Repositories</span>
                            </button>
                        </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-700/50">
                        <div className="px-3 mb-4">
                             <button onClick={() => handlePageChange(Page.PROFILE)} className="flex w-full items-center p-2 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="User" />
                                <div className="ml-3 text-left">
                                    <p className="text-sm font-semibold text-white">{user.name}</p>
                                    <p className="text-xs text-green-400">Online</p>
                                </div>
                            </button>
                        </div>
                        <a href="#" className="flex items-center p-3 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors group">
                            <HelpIcon />
                            <span className="ml-3">Help & Support</span>
                        </a>
                        <p className="text-xs text-slate-500 text-center mt-4">CodeGuardian v1.0.1</p>
                    </div>
                </div>
            </aside>

            <main className="h-full overflow-y-auto transition-all duration-300 ease-in-out md:ml-64">
                 <div className="sticky top-0 z-30 md:hidden p-2 bg-slate-900/50 backdrop-blur-sm">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-300 hover:text-white"
                        aria-controls="default-sidebar"
                        aria-expanded={isSidebarOpen}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>
                <div key={currentPage} className="page-fade-in">
                    {renderPage()}
                </div>
            </main>
        </div>
    );
};

export default App;