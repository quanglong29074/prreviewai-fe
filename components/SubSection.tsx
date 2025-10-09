import React from 'react';

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => (
  <div className="pt-4 border-t border-slate-700/50 first:border-t-0 first:pt-0">
    <h4 className="text-lg font-semibold text-sky-300 mb-4">{title}</h4>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default SubSection;
