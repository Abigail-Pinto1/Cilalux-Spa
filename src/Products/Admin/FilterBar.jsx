// src/Components/Admin/FilterBar.jsx
import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function FilterBar({
  searchTerm,
  onSearchChange,
  filters = [],
  onFilterChange,
  onClearFilters,
  placeholder = "Search...",
  showFilters = true
}) {
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {showFilters && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors whitespace-nowrap ${
              showFilterPanel 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
            {filters.some(f => f.value) && (
              <span className="ml-1 w-2 h-2 bg-indigo-600 rounded-full" />
            )}
          </button>
        )}

        {/* Clear All Filters */}
        {filters.some(f => f.value) && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-500 hover:text-red-600 font-medium whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          {filters.map((filter) => (
            <div key={filter.key} className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  value={filter.value || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">All {filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : filter.type === 'range' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filter.value?.min || ''}
                    onChange={(e) => onFilterChange(filter.key, { ...filter.value, min: e.target.value })}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={filter.value?.max || ''}
                    onChange={(e) => onFilterChange(filter.key, { ...filter.value, max: e.target.value })}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              ) : (
                <input
                  type={filter.type || 'text'}
                  value={filter.value || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  placeholder={filter.placeholder || `Filter by ${filter.label}`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}