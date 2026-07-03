import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Calendar, Users, Star, ShieldCheck, HeartHandshake, Headphones, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  const { searchCriteria, setSearchCriteria, setCurrentPage, t } = useApp();
  const [destination, setDestination] = useState(searchCriteria.destination);
  const [guests, setGuests] = useState(searchCriteria.guestsCount);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const featuredStays = [
    {
      id: 'cotswolds',
      name: 'The Cotswolds Manor',
      location: 'Cotswolds, United Kingdom',
      searchVal: 'Cotswolds',
      rating: '4.98',
      price: '£380',
      image: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?q=80&w=600&auto=format&fit=crop',
      badge: 'Grade-II Listed'
    },
    {
      id: 'santorini',
      name: 'Amara Caldera Estate',
      location: 'Santorini, Greece',
      searchVal: 'Greece',
      rating: '4.95',
      price: '€520',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=600&auto=format&fit=crop',
      badge: 'Infinity Pool'
    },
    {
      id: 'kyoto',
      name: 'Hanami Traditional Ryokan',
      location: 'Kyoto, Japan',
      searchVal: 'Kyoto',
      rating: '4.99',
      price: '¥48,000',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop',
      badge: 'Zen Garden'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCriteria({
      destination: destination || 'Cotswolds',
      checkIn: checkIn || new Date().toISOString().split('T')[0],
      checkOut: checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      guestsCount: guests,
    });
    setCurrentPage('search');
  };

  const handleSelectFeatured = (loc: string) => {
    setDestination(loc);
    // Smooth scroll down to search input or flash it
    const inputElement = document.getElementById('hero-destination-input');
    if (inputElement) {
      inputElement.focus();
      inputElement.classList.add('ring-2', 'ring-blue-500');
      setTimeout(() => {
        inputElement.classList.remove('ring-2', 'ring-blue-500');
      }, 1000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-950 pt-28 pb-16 lg:pt-32 lg:pb-20">
      {/* Background Radial Gradients & Images */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-800/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/95 to-gray-950" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HERO TEXT & SEARCH HUB */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Elegant Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide mb-4 lg:mb-3 shadow-sm shadow-blue-500/5 hover:bg-blue-500/15 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>THE ULTIMATE GLOBAL RETREAT EXPERIENCE</span>
            </motion.div>

            {/* Title with space-grotesk tracking-tight and color-span */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-2xl font-display"
            >
              Where style meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 drop-shadow-sm">sanctuary.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-400 text-base sm:text-lg max-w-xl mt-3 lg:mt-2 font-normal leading-relaxed"
            >
              Explore our hand-picked portfolio of Grade-listed English estates, coastal Aegean villas, and secluded glass-ceiling Nordic lodges across 45 countries.
            </motion.p>

            {/* SEARCH HUB PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl rounded-3xl p-5 lg:p-4 shadow-2xl border border-gray-800/80 mt-6 lg:mt-4 xl:mt-8 hover:border-gray-700/50 transition-all duration-300"
            >
              <form onSubmit={handleSearch} className="flex flex-col gap-4 lg:gap-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3">
                  {/* DESTINATION */}
                  <div className="relative bg-gray-950/60 rounded-2xl p-3.5 border border-gray-800/50 hover:border-blue-500/30 transition-all">
                    <label className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {t("Destinations")}
                    </label>
                    <input
                      id="hero-destination-input"
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder={t("Where would you like to go?")}
                      className="w-full text-white font-medium text-sm outline-none bg-transparent placeholder-gray-500"
                    />
                  </div>

                  {/* GUESTS */}
                  <div className="relative bg-gray-950/60 rounded-2xl p-3.5 border border-gray-800/50 hover:border-blue-500/30 transition-all">
                    <label className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {t("Guests")}
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-white font-medium text-sm outline-none bg-transparent cursor-pointer"
                    >
                      <option className="bg-gray-900 text-white" value={1}>1 {t("Guest")}</option>
                      <option className="bg-gray-900 text-white" value={2}>2 {t("Guests")}</option>
                      <option className="bg-gray-900 text-white" value={3}>3 {t("Guests")}</option>
                      <option className="bg-gray-900 text-white" value={4}>4 {t("Guests")}</option>
                      <option className="bg-gray-900 text-white" value={6}>5+ {t("Guests")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* CHECK IN */}
                  <div className="relative bg-gray-950/60 rounded-2xl p-3.5 border border-gray-800/50 hover:border-blue-500/30 transition-all">
                    <label className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {t("Check-In")}
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-white font-medium text-sm outline-none bg-transparent [color-scheme:dark]"
                    />
                  </div>

                  {/* CHECK OUT */}
                  <div className="relative bg-gray-950/60 rounded-2xl p-3.5 border border-gray-800/50 hover:border-blue-500/30 transition-all">
                    <label className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      {t("Check-Out")}
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-white font-medium text-sm outline-none bg-transparent [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/10 hover:scale-[1.01] hover:shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  <Search className="w-4 h-4" />
                  <span>{t("Search Stays")}</span>
                </button>
              </form>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: FEATURED SHOWCASE (COLLAGE) */}
          <div className="col-span-1 lg:col-span-5 relative flex items-center justify-center mt-8 lg:mt-0">
            {/* Decorative Background Blob behind cards */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-600/10 blur-[60px] -z-10 animate-pulse" />

            {/* Overlay interactive Card Collage */}
            <div className="relative w-full max-w-md flex flex-col gap-4">
              
              <div className="text-gray-400 text-[11px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5 self-center lg:self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Click Stay to Pre-fill Destination
              </div>

              {featuredStays.map((stay, index) => {
                // Set offset positions for overlapping bento card look
                let layoutClass = "";
                let animDelay = 0.3 + index * 0.15;
                if (index === 0) layoutClass = "self-start w-[85%] hover:z-20";
                if (index === 1) layoutClass = "self-end w-[85%] -mt-4 lg:-mt-6 hover:z-20";
                if (index === 2) layoutClass = "self-start w-[85%] -mt-4 lg:-mt-6 hover:z-20";

                return (
                  <motion.div
                    key={stay.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: animDelay }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleSelectFeatured(stay.searchVal)}
                    className={`group relative bg-gray-900/80 backdrop-blur-md rounded-2xl p-2 md:p-2.5 border border-gray-800/80 shadow-xl cursor-pointer transition-all hover:border-blue-500/40 flex gap-3 ${layoutClass}`}
                  >
                    {/* Stay Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-xl overflow-hidden shrink-0 relative">
                      <img
                        src={stay.image}
                        alt={stay.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-1 left-1.5 bg-gray-950/80 backdrop-blur-md text-[8px] font-extrabold text-blue-300 px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-white/5">
                        {stay.badge}
                      </div>
                    </div>

                    {/* Stay Details */}
                    <div className="flex flex-col justify-between py-1 flex-1">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{stay.location}</p>
                          <div className="flex items-center gap-0.5 bg-gray-950/50 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-amber-400">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {stay.rating}
                          </div>
                        </div>
                        <h4 className="text-white text-xs sm:text-sm font-bold mt-1 group-hover:text-blue-300 transition-colors line-clamp-1">{stay.name}</h4>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-800/40">
                        <p className="text-[10px] text-gray-400">From <span className="text-white font-bold text-xs">{stay.price}</span> / night</p>
                        <span className="text-[10px] font-bold text-blue-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                          Select <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
