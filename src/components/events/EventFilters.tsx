import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { EventFilterOptions } from '../../types';
import { DEMO_CATEGORIES, DEMO_NEIGHBORHOODS } from '../../mocks/demo-data';

interface EventFiltersProps {
  filters: EventFilterOptions;
  onChange: (updated: EventFilterOptions) => void;
  totalResults: number;
}

export function EventFilters({ filters, onChange, totalResults }: EventFiltersProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const activeCategory = filters.category || 'All';
  const hasActiveFilters =
    Boolean(filters.query) ||
    Boolean(filters.category && filters.category !== 'All') ||
    Boolean(filters.neighborhood && filters.neighborhood !== 'All' && filters.neighborhood !== 'All Neighborhoods') ||
    Boolean(filters.dateRange && filters.dateRange !== 'all') ||
    Boolean(filters.priceType && filters.priceType !== 'all');

  const handleClearAll = () => {
    onChange({
      query: '',
      category: 'All',
      neighborhood: 'All',
      dateRange: 'all',
      priceType: 'all',
      sortBy: 'relevance',
    });
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Top Search & Mobile Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search events by keyword, venue, or tag..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white rounded-xl border border-[#E2DFD8] text-[#1E2320] placeholder:text-[#8C887E] focus:border-[#1E3F35] focus:ring-1 focus:ring-[#1E3F35] transition-colors shadow-2xs"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ ...filters, query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C887E] hover:text-[#1E2320] p-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filters Trigger */}
        <div className="flex sm:hidden items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E2DFD8] rounded-xl text-xs font-medium text-[#1E2320] shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter & Sort</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#1E3F35] ml-1" />
            )}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-2.5 text-[#5F635D] hover:text-[#1E2320] bg-white border border-[#E2DFD8] rounded-xl"
              aria-label="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Dropdowns: Neighborhood & Date */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <select
            value={filters.neighborhood || 'All'}
            onChange={(e) => onChange({ ...filters, neighborhood: e.target.value })}
            className="text-xs font-medium bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl px-3 py-2.5 shadow-2xs focus:border-[#1E3F35] cursor-pointer"
          >
            {DEMO_NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <select
            value={filters.dateRange || 'all'}
            onChange={(e) =>
              onChange({
                ...filters,
                dateRange: e.target.value as EventFilterOptions['dateRange'],
              })
            }
            className="text-xs font-medium bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl px-3 py-2.5 shadow-2xs focus:border-[#1E3F35] cursor-pointer"
          >
            <option value="all">Any Date</option>
            <option value="today">Today</option>
            <option value="this_weekend">This Weekend</option>
            <option value="this_month">This Month</option>
          </select>

          <select
            value={filters.priceType || 'all'}
            onChange={(e) =>
              onChange({
                ...filters,
                priceType: e.target.value as EventFilterOptions['priceType'],
              })
            }
            className="text-xs font-medium bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl px-3 py-2.5 shadow-2xs focus:border-[#1E3F35] cursor-pointer"
          >
            <option value="all">All Prices</option>
            <option value="free">Free Admission</option>
            <option value="paid">Ticketed</option>
          </select>

          <select
            value={filters.sortBy || 'relevance'}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as EventFilterOptions['sortBy'],
              })
            }
            className="text-xs font-medium bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl px-3 py-2.5 shadow-2xs focus:border-[#1E3F35] cursor-pointer"
          >
            <option value="relevance">Featured & Popular</option>
            <option value="soonest">Soonest First</option>
            <option value="capacity">Most Open Spots</option>
          </select>
        </div>
      </div>

      {/* Interactive Category Segmented Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onChange({ ...filters, category: 'All' })}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'All'
              ? 'bg-[#1E3F35] text-white shadow-2xs font-semibold'
              : 'bg-white text-[#5F635D] hover:text-[#1E2320] border border-[#E2DFD8] hover:bg-[#F4F1EA]'
          }`}
        >
          All Categories
        </button>
        {DEMO_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange({ ...filters, category: cat })}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === cat
                ? 'bg-[#1E3F35] text-white shadow-2xs font-semibold'
                : 'bg-white text-[#5F635D] hover:text-[#1E2320] border border-[#E2DFD8] hover:bg-[#F4F1EA]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Metadata & Clear All */}
      <div className="flex items-center justify-between text-xs text-[#5F635D] pt-1">
        <span className="tabular-nums font-medium">
          Showing {totalResults} {totalResults === 1 ? 'event' : 'events'}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1E3F35] hover:text-[#163028] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset all filters</span>
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs sm:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileDrawerOpen(false);
          }}
        >
          <div className="bg-[#FAF8F5] rounded-t-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto border-t border-[#E2DFD8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD8]">
              <h3 className="font-editorial text-lg font-bold text-[#1E2320]">Filters & Sorting</h3>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#8C887E] hover:text-[#1E2320]"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">Neighborhood</label>
              <select
                value={filters.neighborhood || 'All'}
                onChange={(e) => onChange({ ...filters, neighborhood: e.target.value })}
                className="w-full text-sm bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl p-3"
              >
                {DEMO_NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">Date Range</label>
              <select
                value={filters.dateRange || 'all'}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    dateRange: e.target.value as EventFilterOptions['dateRange'],
                  })
                }
                className="w-full text-sm bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl p-3"
              >
                <option value="all">Any Date</option>
                <option value="today">Today</option>
                <option value="this_weekend">This Weekend</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">Price</label>
              <select
                value={filters.priceType || 'all'}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    priceType: e.target.value as EventFilterOptions['priceType'],
                  })
                }
                className="w-full text-sm bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl p-3"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Admission</option>
                <option value="paid">Ticketed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E2320] mb-1.5">Sort Results By</label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    sortBy: e.target.value as EventFilterOptions['sortBy'],
                  })
                }
                className="w-full text-sm bg-white text-[#1E2320] border border-[#E2DFD8] rounded-xl p-3"
              >
                <option value="relevance">Featured & Popular</option>
                <option value="soonest">Soonest First</option>
                <option value="capacity">Most Open Spots</option>
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-3 text-xs font-medium text-[#1E2320] bg-white border border-[#E2DFD8] rounded-xl"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 text-xs font-medium text-white bg-[#1E3F35] hover:bg-[#163028] rounded-xl shadow-xs"
              >
                Show {totalResults} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
