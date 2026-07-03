import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import {
  TrendingUp, Home, CalendarCheck, Landmark, MessageSquare, Plus, Check,
  Sliders, Star, Users, Bed, Bath, Trash2, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HostDashboard() {
  const {
    user,
    properties,
    addProperty,
    formatPrice,
    bookings,
    notifications,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'listings' | 'add-property' | 'requests' | 'analytics'>('listings');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [city, setCity] = useState('');
  const [type, setType] = useState('Villa');
  const [category, setCategory] = useState('luxury');
  const [price, setPrice] = useState('150');
  const [guestsMax, setGuestsMax] = useState('2');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Wi-Fi']);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!user) {
    return (
      <div className="pt-32 pb-20 text-center text-gray-500">
        Please sign in to view Host Dashboard.
      </div>
    );
  }

  // Filter listings where Host name is matching currently logged-in user
  const hostListings = properties.filter((p) => p.host.name === user.name);

  // Compute metrics
  const totalBookings = bookings.length;
  const activeListingsCount = hostListings.length;
  const totalRevenue = hostListings.reduce((sum, p) => {
    // Mock sum: let's aggregate pricing of related bookings
    const relatedBks = bookings.filter((b) => b.propertyId === p.id && b.status === 'completed');
    return sum + relatedBks.reduce((s, b) => s + b.totalPrice, 0);
  }, 12400); // Base mock revenue

  const handleAmenityCheck = (amen: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amen) ? prev.filter((a) => a !== amen) : [...prev, amen]
    );
  };

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !city || !description) return;

    // Default image if none provided
    const defaultImg = uploadedImageUrl.trim() !== '' ? uploadedImageUrl : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop';

    addProperty({
      title,
      description,
      country,
      city,
      countryCode: country === 'United Kingdom' ? 'GB' : 'US',
      pricePerNight: Number(price),
      currency: 'GBP',
      guestsMax: Number(guestsMax),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      amenities: selectedAmenities,
      images: [defaultImg],
      type,
      category,
      isSuperHost: false,
      isInstantBook: true,
      latitude: Math.floor(Math.random() * 80) + 10,
      longitude: Math.floor(Math.random() * 80) + 10,
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      // Reset form
      setTitle('');
      setDescription('');
      setCity('');
      setPrice('150');
      setSelectedAmenities(['Wi-Fi']);
      setUploadedImageUrl('');
      setActiveSubTab('listings');
    }, 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP HOST STATS CARDS BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Earnings</span>
              <p className="text-xl font-black text-gray-900 mt-1">{formatPrice(totalRevenue)}</p>
              <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
                <TrendingUp className="w-3 h-3" /> +12.4% vs last quarter
              </span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Landmark className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Listings</span>
              <p className="text-xl font-black text-gray-900 mt-1">{activeListingsCount} Stays</p>
              <span className="text-[9px] text-blue-600 font-bold mt-1 block">Listed on Global Maps</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Home className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bookings Approved</span>
              <p className="text-xl font-black text-gray-900 mt-1">{totalBookings} Reserved</p>
              <span className="text-[9px] text-gray-400 font-medium block mt-1">100% host acceptance rate</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Co-Host Rating</span>
              <p className="text-xl font-black text-gray-900 mt-1">4.95 / 5.0</p>
              <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5 mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Superhost Candidate
              </span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* WORKSPACE SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* HOST MENU */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 lg:space-y-2 no-scrollbar w-full">
            <button
              onClick={() => setActiveSubTab('listings')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'listings'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4.5 h-4.5" /> Manage Listings
              </span>
              <ChevronRightIcon className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('add-property')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'add-property'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Plus className="w-4.5 h-4.5" /> List New Stay
              </span>
              <ChevronRightIcon className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('requests')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarCheck className="w-4.5 h-4.5" /> Booking Requests
              </span>
              <ChevronRightIcon className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeSubTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <TrendingUp className="w-4.5 h-4.5" /> Revenue Analytics
              </span>
              <ChevronRightIcon className="hidden lg:block w-4 h-4" />
            </button>
          </div>

          {/* MAIN MODULE CONTENT */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs min-h-[400px]">
            {/* 1. MANAGE LISTINGS SUBTAB */}
            {activeSubTab === 'listings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Your Registered Properties</h2>
                  <p className="text-xs text-gray-400">Keep track of reviews, verify states, and edit prices</p>
                </div>

                {hostListings.length === 0 ? (
                  <div className="text-center py-16 space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">You haven\'t listed any properties yet.</p>
                    <button
                      onClick={() => setActiveSubTab('add-property')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Create Your First Listing
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {hostListings.map((prop) => (
                      <div key={prop.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-40 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          {prop.isVerified ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified stay
                            </span>
                          ) : (
                            <span className="text-amber-600">Pending Review</span>
                          )}
                        </div>

                        <div className="p-4 space-y-3.5">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 truncate">{prop.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{prop.city}, {prop.country}</p>
                          </div>

                          <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-3">
                            <div>
                              <p className="text-gray-400">Nightly Rate</p>
                              <strong className="text-gray-900 text-sm">{formatPrice(prop.pricePerNight)}</strong>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400">Reviews Rating</p>
                              <span className="font-bold text-gray-900 flex items-center gap-0.5 justify-end">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {prop.rating.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADD PROPERTY SUBTAB */}
            {activeSubTab === 'add-property' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">List Your Worldwide Sanctuary</h2>
                  <p className="text-xs text-gray-400">Fill in accurate information. Curation team checks all listings in 24 hours.</p>
                </div>

                <form onSubmit={handleAddPropertySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Property Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Stunning Glass-Front Cabin on Lake"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Nightly Rate in GBP (£)</label>
                      <input
                        type="number"
                        placeholder="180"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Positano"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Italy">Italy</option>
                        <option value="Greece">Greece</option>
                        <option value="Japan">Japan</option>
                        <option value="Iceland">Iceland</option>
                        <option value="Canada">Canada</option>
                        <option value="United States">United States</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Property Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Villa">Villa</option>
                        <option value="Cabin">Cabin</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Castle">Castle</option>
                        <option value="Tiny Home">Tiny Home</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Stay Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="luxury">Luxury Collection</option>
                        <option value="beach">Beach Escape</option>
                        <option value="mountain">Mountain Retreat</option>
                        <option value="city">City Design</option>
                        <option value="countryside">Countryside</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Max Guests</label>
                      <input
                        type="number"
                        value={guestsMax}
                        onChange={(e) => setGuestsMax(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Detailed Stay Description</label>
                    <textarea
                      rows={4}
                      placeholder="Write about the layout, unique styling, local vibe, and garden access details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* PREMIUM IMAGE CDN URL FIELD */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Professional Photo URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/... or leave empty for default curation photo"
                      value={uploadedImageUrl}
                      onChange={(e) => setUploadedImageUrl(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* AMENITIES CHECKBOX */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Essential Amenities Included</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      {['Wi-Fi', 'Parking', 'Heated Pool', 'Fireplace', 'Workspace', 'Pet Friendly', 'Air Conditioning'].map((amen) => (
                        <label
                          key={amen}
                          className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amen)}
                            onChange={() => handleAmenityCheck(amen)}
                            className="accent-blue-600 w-4 h-4"
                          />
                          <span className="font-medium text-gray-700">{amen}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={formSuccess}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer"
                    >
                      {formSuccess ? 'Stay Created Successfully!' : 'Create Worldwide Listing'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. REQUESTS SUBTAB */}
            {activeTabRequestsSubTab(activeSubTab, bookings)}

            {/* 4. REVENUE ANALYTICS CHART */}
            {activeSubTab === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Revenue & Clicks Analytics</h2>
                  <p className="text-xs text-gray-400">Track month-over-month performance and property views</p>
                </div>

                {/* Highly stylized vector SVG bar chart representing earnings */}
                <div className="p-6 bg-[#FAFBFD] border border-gray-100 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Earnings Summary (July 2026)</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Target Reached
                    </span>
                  </div>

                  {/* Chart representation */}
                  <div className="h-64 flex items-end gap-4.5 pt-8 border-b border-gray-200">
                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-blue-600/15 rounded-t-lg h-[35%] hover:bg-blue-600/30 transition-all relative group cursor-pointer">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          £1,250
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">Mar 26</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-blue-600/15 rounded-t-lg h-[55%] hover:bg-blue-600/30 transition-all relative group cursor-pointer">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          £2,800
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">Apr 26</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-blue-600/15 rounded-t-lg h-[80%] hover:bg-blue-600/30 transition-all relative group cursor-pointer">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          £4,200
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">May 26</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full bg-blue-600 rounded-t-lg h-[95%] hover:bg-blue-700 transition-all relative group cursor-pointer">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                          £5,600
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-800 font-bold">Jun 26</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-4 font-semibold">
                    <span>Average Booking Length: 4.8 Nights</span>
                    <span>Total Unique Clicks: 1,420 views</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function activeTabRequestsSubTab(activeSubTab: string, bookings: any[]) {
  if (activeSubTab !== 'requests') return null;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-gray-900">Current Booking Enquiries</h2>
        <p className="text-xs text-gray-400">Review instant and standard booking request notifications from global guests</p>
      </div>

      <div className="space-y-4">
        {bookings.map((bk) => (
          <div key={bk.id} className="p-5 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#FAFBFD]/30">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                REF: {bk.id}
              </span>
              <h4 className="text-sm font-bold text-gray-900 mt-1">{bk.propertyTitle}</h4>
              <p className="text-xs text-gray-500 mt-0.5">Guest: Alexander Sterling • Dates: {bk.checkIn} to {bk.checkOut}</p>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Bookings Pre-Approved
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ChevronRightIcon helper
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
