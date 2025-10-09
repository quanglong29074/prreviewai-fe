import React from 'react';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, children }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-6 mb-6">
    <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
    <p className="text-sm text-slate-400 mb-6">{description}</p>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default SettingsSection;
