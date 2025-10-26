import { useState } from 'react';

interface FilterNavbarProps {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  sortBy: string;
}

export default function FilterNavbar({
  categories,
  activeFilter,
  onFilterChange,
  onSearchChange,
  onSortChange,
  searchQuery,
  sortBy,
}: FilterNavbarProps) {
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="sticky top-0 z-40 bg-stellar-navy/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        {/* Top Bar - Search and Sort */}
        <div className="flex items-center gap-4 mb-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-stellar-blue transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-stellar-blue transition-colors cursor-pointer"
            >
              <option value="name">Name</option>
              <option value="budget">Budget</option>
              <option value="progress">Progress</option>
              <option value="startDate">Start Date</option>
            </select>
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
              />
            </svg>
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex gap-2 flex-wrap animate-in slide-in-from-top duration-200">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onFilterChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-stellar-blue text-white shadow-lg shadow-stellar-blue/30 scale-105'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
