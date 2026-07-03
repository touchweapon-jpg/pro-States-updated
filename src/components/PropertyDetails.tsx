import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart, Star, Share2, MapPin, Bed, Bath, Users, Wifi, Car, Calendar,
  CheckCircle, Shield, ArrowLeft, Send, Sparkles, AlertCircle, Check, Map, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PropertyCard from './PropertyCard';
import { MOCK_REVIEWS } from '../data';

export default function PropertyDetails() {
  const {
    selectedPropertyId,
    setSelectedPropertyId,
    properties,
    wishlist,
    toggleWishlist,
    formatPrice,
    addBooking,
    addChatThread,
    setCurrentPage,
    addOrder,
    user,
  } = useApp();

  const property = properties.find((p) => p.id === selectedPropertyId);

  if (!property) {
    return (
      <div className="pt-32 pb-20 text-center text-gray-500">
        Property not found.{' '}
        <button onClick={() => setCurrentPage('home')} className="text-blue-600 font-bold underline">
          Return Home
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(property.id);

  // States
  const [activeImageTab, setActiveImageTab] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSuccess, setChatSuccess] = useState(false);

  const [buyerName, setBuyerName] = useState(user?.name || 'Alexander Sterling');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || 'alexander@prostates.com');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCreateOrder = (type: 'buy' | 'sell' | 'installment') => {
    if (!buyerName || !buyerEmail) {
      alert('Please fill out your name and email address');
      return;
    }

    addOrder({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images[0],
      buyerName,
      buyerEmail,
      type,
      totalPrice: property.salePrice || 750000,
      installmentsPaid: type === 'installment' ? 1 : 0,
      installmentsTotal: type === 'installment' ? (property.installmentsDurationMonths || 240) : 0,
      installmentAmount: type === 'installment' ? (property.installmentPrice || 2500) : 0,
      status: type === 'installment' ? 'active' : 'completed',
    });

    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setCurrentPage('user-dashboard');
    }, 2500);
  };

  // Calendar dates mock highlight
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Simple calendar generator for July 2026
  const julDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // Date click logic
  const handleDateClick = (day: number) => {
    const formattedDate = `2026-07-${day < 10 ? '0' + day : day}`;
    if (selectedDates.includes(formattedDate)) {
      setSelectedDates([]);
      setCheckIn('');
      setCheckOut('');
    } else if (selectedDates.length === 0) {
      setSelectedDates([formattedDate]);
      setCheckIn(formattedDate);
    } else if (selectedDates.length === 1) {
      const firstDate = selectedDates[0];
      if (formattedDate > firstDate) {
        setSelectedDates([firstDate, formattedDate]);
        setCheckOut(formattedDate);
      } else {
        setSelectedDates([formattedDate]);
        setCheckIn(formattedDate);
        setCheckOut('');
      }
    } else {
      setSelectedDates([formattedDate]);
      setCheckIn(formattedDate);
      setCheckOut('');
    }
  };

  // Pricing calculations
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
  };

  const nights = calculateNights();
  const baseTotal = nights * property.pricePerNight;
  const serviceFee = nights > 0 ? Math.round(baseTotal * 0.08) : 0;
  const totalCost = baseTotal + serviceFee;

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates.');
      return;
    }

    addBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyCity: property.city,
      propertyCountry: property.country,
      propertyImage: property.images[0],
      checkIn,
      checkOut,
      guestsCount,
      totalPrice: totalCost,
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setCurrentPage('user-dashboard');
    }, 2500);
  };

  const handleMessageHost = () => {
    setChatLoading(true);
    const threadId = addChatThread(property.id);
    setTimeout(() => {
      setChatLoading(false);
      setChatSuccess(true);
      setTimeout(() => {
        setChatSuccess(false);
        setCurrentPage('user-dashboard');
      }, 1500);
    }, 1000);
  };

  // Similar listings filter (by type or category, excluding self)
  const similarListings = properties
    .filter((p) => p.id !== property.id && (p.category === property.category || p.type === property.type))
    .slice(0, 3);

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* BACK NAVIGATION */}
        <button
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-white border border-gray-100 hover:border-blue-100 text-sm font-semibold text-gray-700 shadow-sm hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </button>

        {/* PROPERTY HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                {property.type}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" /> Curation Selection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
              <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{property.rating.toFixed(2)}</span>
                <span className="text-gray-400 font-normal">({property.reviewsCount} verified reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">{property.city}, {property.country}</span>
              </div>
            </div>
          </div>

          {/* SHARE & WISHLIST ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Copied link to clipboard!');
              }}
              className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 flex items-center gap-2 text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-gray-400" /> Share
            </button>
            <button
              onClick={() => toggleWishlist(property.id)}
              className="p-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 text-gray-700 flex items-center gap-2 text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mb-8 rounded-3xl overflow-hidden shadow-sm">
          {/* Main big image */}
          <div className="md:col-span-8 aspect-16/10 md:aspect-auto md:h-[450px] relative overflow-hidden bg-gray-100 cursor-zoom-in" onClick={() => { setActiveImageTab(0); setLightboxOpen(true); }}>
            <img
              src={property.images[0]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
            />
          </div>

          {/* Small images column */}
          <div className="hidden md:col-span-4 md:grid grid-rows-2 gap-3.5 h-[450px]">
            <div className="relative overflow-hidden bg-gray-100 cursor-zoom-in rounded-tr-3xl" onClick={() => { setActiveImageTab(1); setLightboxOpen(true); }}>
              <img
                src={property.images[1] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative overflow-hidden bg-gray-100 cursor-zoom-in rounded-br-3xl" onClick={() => { setActiveImageTab(2); setLightboxOpen(true); }}>
              <img
                src={property.images[2] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-bold">
                View All Images ({property.images.length})
              </div>
            </div>
          </div>
        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4"
            >
              <div className="flex items-center justify-between text-white py-2">
                <span className="font-semibold text-sm">Image {activeImageTab + 1} of {property.images.length}</span>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <img
                  src={property.images[activeImageTab]}
                  alt="Gallery large view"
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] max-w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-center gap-3.5 pb-4">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageTab(i)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 ${
                      i === activeImageTab ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PAGE CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: DETAILS, CALENDAR, HOST, REVIEWS */}
          <div className="lg:col-span-8 space-y-8">
            {/* OVERVIEW COMPACT BADGES */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacity</p>
                  <p className="text-sm font-bold text-gray-900">{property.guestsMax} Guests max</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bedrooms</p>
                  <p className="text-sm font-bold text-gray-900">{property.bedrooms} Bedrooms</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bathrooms</p>
                  <p className="text-sm font-bold text-gray-900">{property.bathrooms} Baths</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verification</p>
                  <p className="text-sm font-bold text-emerald-600">Verified Stay</p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">About This Sanctuary</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* AMENITIES */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Offered Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4.5">
                {property.amenities.map((amen, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">{amen}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE CALENDAR SECTION */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Select Booking Dates</h2>
                  <p className="text-xs text-gray-400">Click dates to check-in and check-out</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    July 2026
                  </span>
                </div>
              </div>

              {/* Grid Calendar Layout */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {/* Pad days for June finish */}
                <div className="text-gray-200 p-2.5 text-center text-sm font-medium">30</div>
                <div className="text-gray-200 p-2.5 text-center text-sm font-medium">1</div>
                {julDays.map((day) => {
                  const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
                  const isSelected = selectedDates.includes(dateStr);
                  const isBetween =
                    selectedDates.length === 2 &&
                    dateStr > selectedDates[0] &&
                    dateStr < selectedDates[1];

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`p-2.5 rounded-xl text-center text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : isBetween
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {checkIn && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center justify-between">
                  <span>
                    Selected: <strong>{checkIn}</strong> {checkOut ? `to ${checkOut}` : '(Choose Checkout)'}
                  </span>
                  {checkOut && (
                    <span className="font-bold uppercase tracking-wider text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-md">
                      {nights} Nights
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* HOST DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-50 pb-2">Your Host</h2>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={property.host.avatar}
                  alt={property.host.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-50"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{property.host.name}</h3>
                    {property.host.isSuperHost && (
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                        Superhost
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Joined ProStates in {property.host.joinedDate}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs mt-3.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-gray-400 font-medium">Response Rate</p>
                      <p className="text-sm font-bold text-gray-800">{property.host.responseRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Response Time</p>
                      <p className="text-sm font-bold text-gray-800">{property.host.responseTime}</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleMessageHost}
                      disabled={chatLoading || chatSuccess}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                    >
                      {chatLoading ? (
                        <span>Starting chat...</span>
                      ) : chatSuccess ? (
                        <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Conversation Started</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Message Host
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEWS & VERIFIED COMMENTS */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="text-lg font-bold text-gray-900">{property.rating.toFixed(2)}</span>
                  <span className="text-sm text-gray-400 font-medium">({property.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Quality breakdown progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Cleanliness</span><span>4.9</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Communication</span><span>5.0</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Check-In</span><span>4.8</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Value</span><span>4.7</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {MOCK_REVIEWS.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3.5 mb-2.5">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{rev.userName}</h4>
                        <span className="text-[10px] text-gray-400">{rev.date} • Verified Guest</span>
                      </div>
                      <div className="ml-auto flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SIMULATED MAP */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Property Location</h2>
              <p className="text-xs text-gray-400 mb-4">Location is approximate. Exact coordinates provided upon host verification.</p>

              <div className="relative h-60 rounded-xl bg-blue-50/50 border border-blue-100 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-40">
                  {/* Decorative grid pattern mimicking map */}
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.15" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                <div className="z-10 text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg mx-auto animate-bounce">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">{property.city}, {property.country}</p>
                  <p className="text-xs text-gray-500 font-medium">Latitude: {property.latitude}° N | Longitude: {property.longitude}° E</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING PANEL */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg relative">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4">
                <div>
                  {(!property.transactionMode || property.transactionMode === 'rental') ? (
                    <>
                      <span className="text-xs text-gray-400 font-medium">Price per night</span>
                      <p className="text-xl font-black text-gray-900">
                        {formatPrice(property.pricePerNight)}{' '}
                        <span className="text-xs text-gray-400 font-normal">/ night</span>
                      </p>
                    </>
                  ) : (property.transactionMode === 'buy' || property.transactionMode === 'sell') ? (
                    <>
                      <span className="text-xs text-gray-400 font-medium">{property.transactionMode === 'buy' ? 'Direct Buyout' : 'Listing Purchase'}</span>
                      <p className="text-xl font-black text-blue-600">
                        {formatPrice(property.salePrice || 750000)}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 font-medium">Rent-to-Own Plan</span>
                      <p className="text-xl font-black text-emerald-600">
                        {formatPrice(property.installmentPrice || 2500)}{' '}
                        <span className="text-xs text-gray-400 font-normal">/ month</span>
                      </p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-semibold text-gray-800 text-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{property.rating.toFixed(2)}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">({property.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* DYNAMIC FORMS BASED ON TRANSACTION MODE */}
              {(!property.transactionMode || property.transactionMode === 'rental') ? (
                /* BOOKING FORM */
                <form onSubmit={handleBookNow} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Check-In</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Check-Out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Number of Guests</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50 cursor-pointer"
                    >
                      {Array.from({ length: property.guestsMax }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 && 's'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* COST BREAKDOWN ACCORDION */}
                  {nights > 0 && (
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                      <div className="flex justify-between text-gray-500">
                        <span>{formatPrice(property.pricePerNight)} x {nights} nights</span>
                        <span>{formatPrice(baseTotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>ProStates Trust Fee (8%)</span>
                        <span>{formatPrice(serviceFee)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
                        <span>Total (Incl. Taxes)</span>
                        <span>{formatPrice(totalCost)}</span>
                      </div>
                    </div>
                  )}

                  {/* SUBMIT BOOKING BUTTON */}
                  <button
                    type="submit"
                    disabled={bookingSuccess}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {bookingSuccess ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-white animate-pulse" /> Stays Booked Successfully!
                      </span>
                    ) : (
                      <span>Instant Booking Stays</span>
                    )}
                  </button>
                </form>
              ) : (property.transactionMode === 'buy' || property.transactionMode === 'sell') ? (
                /* ACQUISITION / BUYOUT FORM */
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100 mb-2">
                    <p className="text-[11px] text-blue-700 font-medium flex items-start gap-1.5 leading-relaxed">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                      You are acquiring a direct-own title deed. Our legal team will dispatch physical deeds upon completion.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Acquirer Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Acquirer Email</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50"
                      required
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Property Asset Price</span>
                      <span>{formatPrice(property.salePrice || 750000)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Legal Transfer & Title Deed (0%)</span>
                      <span className="text-emerald-600 font-semibold">Complimentary</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
                      <span>Direct Outright Cost</span>
                      <span>{formatPrice(property.salePrice || 750000)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreateOrder(property.transactionMode as 'buy' | 'sell')}
                    disabled={orderSuccess}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {orderSuccess ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-white animate-pulse" /> Asset Order Submitted!
                      </span>
                    ) : (
                      <span>Initiate Direct Purchase</span>
                    )}
                  </button>
                </div>
              ) : (
                /* INSTALLMENT FORM */
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 mb-2">
                    <p className="text-[11px] text-emerald-700 font-medium flex items-start gap-1.5 leading-relaxed">
                      <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                      Rent-to-Own agreement starting at {formatPrice(property.installmentPrice || 2500)} / month for {property.installmentsDurationMonths || 240} months.
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Subscriber Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Subscriber Email</label>
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-2.5 border border-gray-200 rounded-xl outline-none text-xs text-gray-800 focus:border-blue-500 bg-gray-50/50"
                      required
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Monthly Amortization</span>
                      <span>{formatPrice(property.installmentPrice || 2500)} / mo</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Payment Term</span>
                      <span>{property.installmentsDurationMonths || 240} Months</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>First Month Downpayment</span>
                      <span>{formatPrice(property.installmentPrice || 2500)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
                      <span>Due Now (First Installment)</span>
                      <span>{formatPrice(property.installmentPrice || 2500)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreateOrder('installment')}
                    disabled={orderSuccess}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {orderSuccess ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-white animate-pulse" /> Installment Plan Activated!
                      </span>
                    ) : (
                      <span>Subscribe to Installment Plan</span>
                    )}
                  </button>
                </div>
              )}

              {/* Secure guarantee note */}
              <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400 justify-center">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                <span>Secure Payments & Host Guarantee Included</span>
              </div>
            </div>

            {/* QUICK HOUSE RULES SUMMARY */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs text-xs space-y-3">
              <h4 className="font-bold text-gray-900 uppercase tracking-wide text-[10px] text-gray-400">House Rules Summary</h4>
              <div className="flex items-center justify-between text-gray-600">
                <span>Check-in after:</span><strong>3:00 PM</strong>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Checkout before:</span><strong>10:00 AM</strong>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Pets policy:</span>
                <strong>{property.amenities.includes('Pet Friendly') ? 'Allowed' : 'Not Allowed'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* SIMILAR PROPERTIES */}
        {similarListings.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Compass className="text-blue-600 w-5 h-5" /> Similar Curated Listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarListings.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
