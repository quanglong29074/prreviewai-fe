import React from 'react';

interface FiltersProps {
  nameFilter: string;
  fromDate: string;
  toDate: string;
  pageSize: number;
  onNameChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onApply: () => void;
  onClear: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  nameFilter,
  fromDate,
  toDate,
  pageSize,
  onNameChange,
  onFromDateChange,
  onToDateChange,
  onPageSizeChange,
  onApply,
  onClear,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>

      {/* ✅ Grid responsive: 1 col -> 2 col (sm) -> 4 col (lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Repository Name</label>
          <input
            type="text"
            value={nameFilter}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Page Size</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* ✅ Responsive buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={onApply}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all font-medium w-full sm:w-auto"
        >
          Apply Filters
        </button>
        <button
          onClick={onClear}
          className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium w-full sm:w-auto"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
