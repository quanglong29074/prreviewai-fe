import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
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

export default StatCard;