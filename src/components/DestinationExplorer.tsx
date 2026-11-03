import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, DollarSign, Star, Navigation, ExternalLink, Filter, Map, Grid } from 'lucide-react';
import { Destination, CategoryType } from '../types/tourism';
import { DESTINATION_CATEGORIES } from '../data/mockDestinations';

interface DestinationExplorerProps {
  destinations: Destination[];
  onSelectForTrip?: (destination: Destination) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  destinations,
  onSelectForTrip
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxFee, setMaxFee] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'fee-asc' | 'fee-desc'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);

  // Filtered & Sorted destinations
  const filteredDestinations = useMemo(() => {
    return destinations
      .filter((dest) => {
        const matchesCategory = selectedCategory === 'all' || dest.categoryId === selectedCategory;
        const matchesQuery =
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFee = dest.entryFee <= maxFee;
        return matchesCategory && matchesQuery && matchesFee;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'fee-asc') return a.entryFee - b.entryFee;
        if (sortBy === 'fee-desc') return b.entryFee - a.entryFee;
        return 0;
      });
  }, [destinations, selectedCategory, searchQuery, maxFee, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header and Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            Local Tourism Catalog
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Explore Tourist Destinations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse heritage sites, natural reserves, adventure spots, and artisan food streets.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Map View
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-xs">
        {/* Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destinations, tags, or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Max Entry Fee Slider */}
          <div className="md:col-span-4 flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Max Fee: <span className="font-mono font-semibold text-slate-900">${maxFee}</span>
            </span>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="fee-asc">Entry Fee: Free to High</option>
              <option value="fee-desc">Entry Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons (Functional Segmented Tab Bar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({destinations.length})
          </button>
          {DESTINATION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-800">No destinations found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your search keywords or increasing the maximum entry fee filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setMaxFee(50);
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  {/* Destination Image with Aspect Ratio */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 text-xs font-bold font-mono text-slate-900">
                      {dest.entryFee === 0 ? (
                        <span className="text-emerald-700">Free Entry</span>
                      ) : (
                        <span>${dest.entryFee.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Zero-Pill Unboxed Metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <span className="font-medium text-emerald-700">{dest.categoryName}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {dest.visitDurationHours} hrs
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {dest.rating}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {dest.name}
                      </h3>

                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 mb-2">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{dest.location}</span>
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {dest.description}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveModalDest(dest)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Details & Map
                      </button>

                      {onSelectForTrip && (
                        <button
                          onClick={() => onSelectForTrip(dest)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          Add to Itinerary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Map View Interactive Representation */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Interactive Destination Map & Coordinates
              </h3>
              <p className="text-xs text-slate-500">
                Click any attraction to view coordinates, approximate transit distance, and launch Google Maps navigation.
              </p>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Total Plotted: <span className="font-bold text-slate-900">{filteredDestinations.length}</span> locations
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Map Canvas Representation */}
            <div className="lg:col-span-2 relative min-h-[460px] bg-slate-100 p-6 flex flex-col justify-between overflow-hidden">
              {/* Stylized Map Grid Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'radial-gradient(#059669 1px, transparent 1px), radial-gradient(#0f172a 1px, #f1f5f9 1px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px'
                }}
              />

              <div className="relative z-10 flex items-center justify-between bg-white/90 backdrop-blur-xs px-3 py-2 rounded-lg border border-slate-200 shadow-xs max-w-sm text-xs">
                <span className="font-semibold text-slate-800">Jaipur Metropolitan Tourist Grid</span>
                <span className="text-[11px] text-slate-500 font-mono">26.91° N, 75.82° E</span>
              </div>

              {/* Pins Plotted on Simulated Coordinate Plane */}
              <div className="relative z-10 h-80 my-4 flex items-center justify-center">
                <div className="relative w-full h-full max-w-lg mx-auto">
                  {filteredDestinations.slice(0, 8).map((dest, idx) => {
                    // Position normalization for representation
                    const left = 15 + ((dest.longitude - 75.76) / (75.86 - 75.76)) * 70;
                    const top = 15 + ((27.06 - dest.latitude) / (27.06 - 26.87)) * 70;

                    return (
                      <div
                        key={dest.id}
                        style={{
                          left: `${Math.max(5, Math.min(85, left))}%`,
                          top: `${Math.max(5, Math.min(85, top))}%`
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        onClick={() => setActiveModalDest(dest)}
                      >
                        <div className="relative flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-2 ring-white hover:scale-125 transition-transform duration-200">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1.5 whitespace-nowrap bg-slate-900 text-white text-[11px] font-semibold px-2 py-1 rounded shadow-lg pointer-events-none z-20">
                            {dest.name} (${dest.entryFee.toFixed(0)})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 bg-white/80 backdrop-blur-xs p-2 rounded-lg border border-slate-200">
                <span>Distance estimates based on Euclidean metric (1° ≈ 111km)</span>
                <span className="font-mono text-emerald-700 font-semibold">Active Geolocation Enabled</span>
              </div>
            </div>

            {/* Destination Sidebar in Map Mode */}
            <div className="p-4 border-t lg:border-t-0 lg:border-l border-slate-200 max-h-[500px] overflow-y-auto space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Attractions in Region
              </div>
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  onClick={() => setActiveModalDest(dest)}
                  className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                        {dest.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {dest.location}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">
                      {dest.entryFee === 0 ? 'Free' : `$${dest.entryFee}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{dest.visitDurationHours} hrs duration</span>
                    <span className="font-mono">{dest.latitude.toFixed(3)}, {dest.longitude.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Destination Detail Modal */}
      {activeModalDest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Image Header */}
            <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
              <img
                src={activeModalDest.imageUrl}
                alt={activeModalDest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalDest(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-xl text-white">
                <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                  {activeModalDest.categoryName}
                </div>
                <h3 className="text-2xl font-bold font-display">{activeModalDest.name}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Entry Fee</span>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    {activeModalDest.entryFee === 0 ? 'Free' : `$${activeModalDest.entryFee.toFixed(2)}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Est. Time</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {activeModalDest.visitDurationHours} Hours
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Rating</span>
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {activeModalDest.rating} ({activeModalDest.reviewsCount})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">City</span>
                  <span className="font-bold text-slate-900 text-sm">{activeModalDest.city}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  About this destination
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeModalDest.description}
                </p>
              </div>

              {/* Best Time & Visiting Advice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900">
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Recommended Visiting Window:
                </div>
                <p>{activeModalDest.bestTime}</p>
              </div>

              {/* Location & Navigation */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Address & Coordinates
                </h4>
                <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeModalDest.address}</span>
                </p>
                <div className="text-[11px] font-mono text-slate-400">
                  Lat: {activeModalDest.latitude} | Lng: {activeModalDest.longitude}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${activeModalDest.name}, ${activeModalDest.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  Open in Google Maps
                </a>

                {onSelectForTrip && (
                  <button
                    onClick={() => {
                      onSelectForTrip(activeModalDest);
                      setActiveModalDest(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                  >
                    Select for Trip Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
