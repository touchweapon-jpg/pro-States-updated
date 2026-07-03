import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import {
  SlidersHorizontal, Map as MapIcon, Grid, X, Check, Search, Star,
  DollarSign, Wifi, Car, Compass, ChevronDown, ArrowUpDown, ShieldCheck, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PropertyCard from './PropertyCard';

export default function SearchPage() {
  const {
    properties,
    searchCriteria,
    setSearchCriteria,
    filters,
    setFilters,
    resetFilters,
    formatPrice,
    setSelectedPropertyId,
    setCurrentPage
  } = useApp();

  // Local view toggle: grid vs map split vs full map
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc' | 'reviews'>('rating');

  // Interactive Map highlight
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Local filter states for sync
  const [localPrice, setLocalPrice] = useState<number>(filters.priceRange[1]);
  const [localType, setLocalType] = useState<string>(filters.propertyType);
  const [localBedrooms, setLocalBedrooms] = useState<number>(filters.bedrooms);
  const [localBathrooms, setLocalBathrooms] = useState<number>(filters.bathrooms);
  const [localInstant, setLocalInstant] = useState<boolean>(filters.instantBookOnly);
  const [localSuper, setLocalSuper] = useState<boolean>(filters.superHostOnly);
  const [localAmenities, setLocalAmenities] = useState<string[]>(filters.amenities);

  const handleAmenityToggle = (amen: string) => {
    setLocalAmenities((prev) =>
      prev.includes(amen) ? prev.filter((a) => a !== amen) : [...prev, amen]
    );
  };

  const applyFilters = () => {
    setFilters({
      ...filters,
      priceRange: [0, localPrice],
      propertyType: localType,
      bedrooms: localBedrooms,
      bathrooms: localBathrooms,
      instantBookOnly: localInstant,
      superHostOnly: localSuper,
      amenities: localAmenities,
    });
    setMobileFilterOpen(false);
  };

  const handleReset = () => {
    resetFilters();
    setLocalPrice(1000);
    setLocalType('all');
    setLocalBedrooms(0);
    setLocalBathrooms(0);
    setLocalInstant(false);
    setLocalSuper(false);
    setLocalAmenities([]);
  };

  // Search filter criteria computation
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // 1. Destination Search filter
    if (searchCriteria.destination.trim() !== '') {
      const q = searchCriteria.destination.toLowerCase();
      result = result.filter(
        (p) =>
          p.city.toLowerCase().includes(q) ||
          p.country.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q)
      );
    }

    // 2. Guests Max filter
    if (searchCriteria.guestsCount > 1) {
      result = result.filter((p) => p.guestsMax >= searchCriteria.guestsCount);
    }

    // 3. Price Filter
    if (filters.priceRange[1] < 1000) {
      result = result.filter((p) => p.pricePerNight <= filters.priceRange[1]);
    }

    // 4. Property Type Filter
    if (filters.propertyType !== 'all') {
      result = result.filter((p) => p.type.toLowerCase() === filters.propertyType.toLowerCase());
    }

    // 5. Rooms filter
    if (filters.bedrooms > 0) {
      result = result.filter((p) => p.bedrooms >= filters.bedrooms);
    }
    if (filters.bathrooms > 0) {
      result = result.filter((p) => p.bathrooms >= filters.bathrooms);
    }

    // 6. Instant Book filter
    if (filters.instantBookOnly) {
      result = result.filter((p) => p.isInstantBook);
    }

    // 7. Superhost filter
    if (filters.superHostOnly) {
      result = result.filter((p) => p.isSuperHost);
    }

    // 8. Amenities check
    if (filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((amen) => p.amenities.includes(amen))
      );
    }

    // Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [properties, searchCriteria, filters, sortBy]);

  // List of unique property types for sidebar filter
  const uniqueTypes = ['all', 'Villa', 'Cabin', 'Apartment', 'Castle', 'Tiny Home'];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col">
      {/* FILTER STICKY SUB-BAR */}
      <div className="sticky top-14 bg-white border-b border-gray-100 py-3.5 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-300 text-xs font-bold text-gray-700 flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters & Amenities</span>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-gray-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 cursor-pointer outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Split Screen
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid Only
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH MAIN SPLIT VIEWER */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* LEFT COMPARTMENT: LISTING GRID */}
        <div
          className={`flex-1 p-4 sm:p-6 overflow-y-auto ${
            viewMode === 'split' ? 'lg:max-w-[55%] xl:max-w-[50%]' : 'w-full'
          }`}
          style={{ height: 'calc(100vh - 120px)' }}
        >
          {/* SEARCH META SUMMARY */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Search Results</p>
              <h2 className="text-xl font-black text-gray-900 mt-1">
                {filteredProperties.length} Curated stay{filteredProperties.length !== 1 && 's'}{' '}
                {searchCriteria.destination ? `in ${searchCriteria.destination}` : 'globally'}
              </h2>
            </div>
            {searchCriteria.destination && (
              <button
                onClick={() => setSearchCriteria({ ...searchCriteria, destination: '' })}
                className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Clear Search <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {filteredProperties.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Compass className="w-16 h-16 text-gray-300 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-gray-900">No properties matched your criteria</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try widening your price limits, reducing minimum guest counts, or relaxing your amenity requirement list.
              </p>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'split'
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onMouseEnter={() => setHoveredPropertyId(prop.id)}
                  onMouseLeave={() => setHoveredPropertyId(null)}
                  className={`transition-transform duration-300 ${
                    hoveredPropertyId === prop.id ? 'scale-[1.01]' : ''
                  }`}
                >
                  <PropertyCard property={prop} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COMPARTMENT: INTERACTIVE VECTOR MAP */}
        {viewMode === 'split' && (
          <div
            className="hidden lg:block lg:flex-1 relative bg-blue-50/20 border-l border-gray-100 overflow-hidden"
            style={{ height: 'calc(100vh - 120px)' }}
          >
            {/* Interactive Vector map canvas with coordinate pins */}
            <div className="absolute inset-0 flex items-center justify-center p-8 select-none">
              <div className="w-full h-full relative border border-gray-200 bg-white rounded-3xl overflow-hidden shadow-xs flex items-center justify-center">
                {/* Simulated geographic continents */}
                <div className="absolute inset-0 opacity-[0.08] flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full text-blue-600" viewBox="0 0 800 500" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150,150 Q180,100 250,120 T350,140 T420,100 T500,160 T600,110 T700,200 T650,300 T550,280 T400,320 T250,350 T150,300 Z" />
                    <path d="M500,350 Q550,300 620,310 T700,360 T680,420 T580,450 T500,400 Z" />
                  </svg>
                </div>

                {/* Decorative map Grid lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.08" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                </svg>

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-500 shadow-xs z-10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  INTERACTIVE VECTOR RADAR VIEW
                </div>

                {/* COORDINATE MAP PINS */}
                {filteredProperties.map((prop) => {
                  const isActive = hoveredPropertyId === prop.id;
                  return (
                    <button
                      key={prop.id}
                      onClick={() => {
                        setSelectedPropertyId(prop.id);
                        setCurrentPage('property-details');
                      }}
                      onMouseEnter={() => setHoveredPropertyId(prop.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                      className="absolute group transition-transform duration-300 z-20 cursor-pointer"
                      style={{
                        top: `${prop.latitude}%`,
                        left: `${prop.longitude}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="relative flex flex-col items-center">
                        {/* Map Pin price pill */}
                        <div
                          className={`px-2.5 py-1.5 rounded-full text-[10px] font-extrabold shadow-md transition-all flex items-center gap-1 border ${
                            isActive
                              ? 'bg-blue-600 text-white scale-110 border-blue-600'
                              : 'bg-white text-gray-800 border-gray-200'
                          }`}
                        >
                          <Star className={`w-2.5 h-2.5 ${isActive ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
                          <span>{formatPrice(prop.pricePerNight)}</span>
                        </div>

                        {/* Pin beak */}
                        <div
                          className={`w-2 h-2 rotate-45 -mt-1 shadow-sm transition-all ${
                            isActive ? 'bg-blue-600' : 'bg-white border-r border-b border-gray-200'
                          }`}
                        />

                        {/* Hover stay card overlay */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-11 w-48 bg-white p-2 rounded-xl shadow-xl border border-gray-100 text-left pointer-events-none z-30"
                            >
                              <img
                                src={prop.images[0]}
                                alt={prop.title}
                                className="w-full h-20 object-cover rounded-lg mb-1.5"
                                referrerPolicy="no-referrer"
                              />
                              <h4 className="text-[10px] font-bold text-gray-900 truncate mb-0.5">{prop.title}</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase">{prop.city}, {prop.country}</p>
                              <p className="text-[10px] font-black text-blue-600 mt-1">{formatPrice(prop.pricePerNight)} / night</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FILTER DRAWER SLIDE OVERLAY (ADVANCED FILTERS) */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Filter sheet */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-[90%] max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Advanced Stay Filters</h3>
                  <p className="text-xs text-gray-400">Refine stays according to your bespoke wishes</p>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FILTER FORM BODY */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* PRICE RANGE */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Maximum Budget Rate</label>
                    <span className="text-xs font-bold text-blue-600">{formatPrice(localPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={10}
                    value={localPrice}
                    onChange={(e) => setLocalPrice(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
                    <span>{formatPrice(50)}</span>
                    <span>{formatPrice(1000)}+</span>
                  </div>
                </div>

                {/* PROPERTY TYPE */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setLocalType(type)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border capitalize cursor-pointer transition-all ${
                          localType === type
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ROOMS COUNT */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Rooms Minimum</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Bedrooms</p>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => setLocalBedrooms(num)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              localBedrooms === num ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {num === 0 ? 'Any' : num + '+'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Bathrooms</p>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3].map((num) => (
                          <button
                            key={num}
                            onClick={() => setLocalBathrooms(num)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              localBathrooms === num ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {num === 0 ? 'Any' : num + '+'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SPECIAL PREFERENCES */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Host Preferences</label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-gray-900">Instant Booking only</p>
                      <p className="text-[10px] text-gray-400">Book immediately without host delay approval</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localInstant}
                      onChange={(e) => setLocalInstant(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-gray-900">Superhost Curation Only</p>
                      <p className="text-[10px] text-gray-400">Show stays from top-tier, highly rated hosts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSuper}
                      onChange={(e) => setLocalSuper(e.target.checked)}
                      className="w-4 h-4 accent-blue-600"
                    />
                  </div>
                </div>

                {/* AMENITIES CHECKBOX LIST */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Amenities Checklist</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['Wi-Fi', 'Parking', 'Heated Pool', 'Fireplace', 'Workspace', 'Pet Friendly'].map((amen) => (
                      <button
                        key={amen}
                        onClick={() => handleAmenityToggle(amen)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-left cursor-pointer transition-colors ${
                          localAmenities.includes(amen)
                            ? 'border-blue-500 bg-blue-50/50 font-bold text-blue-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{amen}</span>
                        {localAmenities.includes(amen) && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SHEET FOOTER ACTION PANEL */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center font-bold text-xs shadow-md shadow-blue-600/10 transition-colors cursor-pointer"
                >
                  Apply Filters & Search
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
