import React from 'react';

interface TextInputProps {
  label: string;
  value: string | number | null;
  placeholder?: string;
  description?: string;
  type?: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  placeholder,
  description,
  type = 'text',
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-white mb-1">{label}</label>
    {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
    <input
      type={type}
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2"
    />
  </div>
);

export default TextInput;
