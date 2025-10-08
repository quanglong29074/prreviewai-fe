import React from 'react';
import { User } from '../types';
import { LogoutIcon } from '../components/icons';

interface ProfilePageProps {
    user: User;
    onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout }) => {
    
    if (!user) {
        // This should not happen if App.tsx handles the session correctly, but it's a good safeguard.
        return <div className="p-8 text-center text-slate-400">User data not available. Please try logging in again.</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-cyan-400 pb-2">User Profile</h1>
            
            <div className="max-w-2xl mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
                        <img 
                            src={user.avatar_url} 
                            alt="User Avatar" 
                            className="w-24 h-24 rounded-full border-4 border-slate-700 shadow-md"
                        />
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                            <p className="text-md text-slate-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-700/50 pt-6 space-y-4">
                        <h3 className="text-lg font-semibold text-sky-300">Account Actions</h3>
                        
                        <div className="flex justify-between items-center p-3 bg-slate-900/40 rounded-lg">
                            <p className="font-medium text-white">Log out of your account</p>
                            <button
                                onClick={onLogout}
                                className="flex items-center justify-center px-4 py-2 bg-red-600/50 text-red-200 border border-red-500/30 rounded-lg font-semibold hover:bg-red-600/80 hover:text-white transition-colors duration-300"
                            >
                                <LogoutIcon />
                                <span className="ml-2">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;