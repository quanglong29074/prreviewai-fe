import React, { useState } from 'react';

interface SelectInputProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-white mb-1">{label}</label>

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white hover:bg-slate-700 transition"
      >
        <span>{value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace(/_/g, ' ')}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => {
            const labelText = opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase().replace(/_/g, ' ');
            return (
              <li
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-slate-700 transition ${
                  opt === value ? 'bg-slate-700/70 font-semibold' : ''
                }`}
              >
                {labelText}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SelectInput;
