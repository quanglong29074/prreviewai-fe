import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  description?: string;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, description, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
    <div className="flex flex-col">
      <label className="font-medium text-white">{label}</label>
      {description && <p className="text-xs text-slate-400 max-w-xs">{description}</p>}
    </div>

    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`${
        checked ? 'bg-sky-600' : 'bg-slate-600'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer hover:opacity-80`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </button>
  </div>
);

export default Toggle;
