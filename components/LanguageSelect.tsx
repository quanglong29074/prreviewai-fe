import React, { useState } from 'react';

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'vi', label: 'Vietnamese', flag: '🇻🇳' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'jp', label: 'Japanese', flag: '🇯🇵' },
  { value: 'kr', label: 'Korean', flag: '🇰🇷' },
  { value: 'cn', label: 'Chinese', flag: '🇨🇳' },
];

interface LanguageSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selected = LANGUAGE_OPTIONS.find((opt) => opt.value === value);

  return (
    <div className="relative w-full">
      {label && <label className="block text-sm font-medium text-white mb-1">{label}</label>}

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white hover:bg-slate-700 transition"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg">{selected?.flag}</span>
          <span>{selected?.label}</span>
        </span>
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
        <ul className="absolute mt-1 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          {LANGUAGE_OPTIONS.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-700 transition ${
                opt.value === value ? 'bg-slate-700/70' : ''
              }`}
            >
              <span className="text-lg">{opt.flag}</span>
              <span className="text-white">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelect;
