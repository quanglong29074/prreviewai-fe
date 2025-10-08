import React from 'react';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-slate-700 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Reviews" value="1,428" icon={<CodeIcon />} />
                <StatCard title="Repositories" value="23" icon={<RepoIcon />} />
                <StatCard title="Issues Found" value="312" icon={<WarningIcon />} />
                <StatCard title="Success Rate" value="98.7%" icon={<CheckIcon />} />
            </div>
            <div className="mt-8 bg-slate-800/50 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <ul>
                    <li className="flex justify-between items-center py-3 border-b border-slate-700">
                        <div>
                            <p className="font-semibold">review/feature-branch</p>
                            <p className="text-sm text-slate-400">my-awesome-project</p>
                        </div>
                        <span className="text-sm text-green-400">Passed</span>
                    </li>
                    <li className="flex justify-between items-center py-3 border-b border-slate-700">
                        <div>
                            <p className="font-semibold">fix/login-bug</p>
                            <p className="text-sm text-slate-400">internal-tools</p>
                        </div>
                        <span className="text-sm text-yellow-400">2 Issues</span>
                    </li>
                    <li className="flex justify-between items-center py-3">
                        <div>
                            <p className="font-semibold">refactor/api-service</p>
                            <p className="text-sm text-slate-400">customer-portal-backend</p>
                        </div>
                        <span className="text-sm text-green-400">Passed</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const CodeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
const RepoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);
const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);
const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default DashboardPage;
