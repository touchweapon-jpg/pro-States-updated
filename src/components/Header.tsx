import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { currencies, languages } from '../data';
import {
  Menu, X, Bell, Globe, Heart, Search, User, LogOut,
  Shield, Landmark, Plus, HelpCircle, Compass, ChevronDown, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const {
    currentPage,
    setCurrentPage,
    selectedCurrency,
    setCurrencyByCode,
    selectedLanguage,
    setLanguageByCode,
    user,
    setUser,
    switchRole,
    notifications,
    markNotificationsAsRead,
    wishlist,
    t
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Expanded sidebar accordions
  const [sidebarCurrencyOpen, setSidebarCurrencyOpen] = useState(false);
  const [sidebarLanguageOpen, setSidebarLanguageOpen] = useState(false);
  const [sidebarNotificationsOpen, setSidebarNotificationsOpen] = useState(false);

  // Search overlay toggle
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [destQuery, setDestQuery] = useState('');

  const { searchCriteria, setSearchCriteria } = useApp();

  useEffect(() => {
    setDestQuery(searchCriteria.destination || '');
  }, [searchCriteria.destination]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCriteria({
      ...searchCriteria,
      destination: destQuery
    });
    setSearchOverlayOpen(false);
    setCurrentPage('search');
  };

  const selectCurrency = (code: string) => {
    setCurrencyByCode(code);
    setCurrencyOpen(false);
  };

  const selectLanguage = (code: string) => {
    setLanguageByCode(code);
    setLanguageOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setUserMenuOpen(false);
  };

  const handleLoginRedirect = () => {
    setCurrentPage('auth');
    setUserMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || currentPage !== 'home'
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
            : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent text-white py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* LOGO */}
            <div
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${
                scrolled || currentPage !== 'home' ? 'text-gray-900' : 'text-white'
              }`}>
                Pro<span className="text-blue-600">States</span>
              </span>
            </div>

            {/* INTEGRATED PROFESSIONAL & RESPONSIVE NAVBAR SEARCH BAR */}
            <div className="hidden lg:flex flex-grow max-w-xs xl:max-w-md mx-4">
              <form
                onSubmit={handleSearchSubmit}
                className={`relative flex items-center w-full h-9.5 rounded-full transition-all duration-200 shadow-sm ${
                  scrolled || currentPage !== 'home'
                    ? 'bg-gray-100/90 border border-gray-200 hover:bg-gray-100/75 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10'
                    : 'bg-white/10 border border-white/20 hover:bg-white/15 focus-within:bg-white/25 focus-within:border-white focus-within:ring-2 focus-within:ring-white/15'
                }`}
              >
                <div className="absolute left-3 flex items-center pointer-events-none">
                  <Search className={`w-3.5 h-3.5 ${
                    scrolled || currentPage !== 'home' ? 'text-gray-400' : 'text-white/80'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder={t("Where to go?")}
                  value={destQuery}
                  onChange={(e) => setDestQuery(e.target.value)}
                  className={`w-full pl-8.5 pr-16 bg-transparent border-none text-xs font-semibold outline-none focus:ring-0 ${
                    scrolled || currentPage !== 'home'
                      ? 'text-gray-800 placeholder-gray-400'
                      : 'text-white placeholder-white/60'
                  }`}
                />
                {destQuery && (
                  <button
                    type="button"
                    onClick={() => setDestQuery('')}
                    className={`absolute right-9 p-1 rounded-full transition-colors ${
                      scrolled || currentPage !== 'home'
                        ? 'text-gray-400 hover:bg-gray-200/60 hover:text-gray-600'
                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className={`absolute right-0.75 w-7.5 h-7.5 rounded-full flex items-center justify-center transition-all ${
                    scrolled || currentPage !== 'home'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10'
                      : 'bg-white hover:bg-blue-50 text-blue-600 shadow-sm'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* DESKTOP NAV LINKS */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentPage === 'home'
                    ? 'text-blue-600'
                    : scrolled || currentPage !== 'home' ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {t("Home")}
              </button>
              <button
                onClick={() => {
                  setCurrentPage('search');
                }}
                className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentPage === 'search'
                    ? 'text-blue-600'
                    : scrolled || currentPage !== 'home' ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {t("Explore Stays")}
              </button>
              {user?.role === 'host' ? (
                <button
                  onClick={() => setCurrentPage('host-dashboard')}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    currentPage === 'host-dashboard'
                      ? 'text-blue-600'
                      : scrolled || currentPage !== 'home' ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {t("Host Dashboard")}
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (user) {
                      switchRole('host');
                    } else {
                      setCurrentPage('auth');
                    }
                  }}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                    scrolled || currentPage !== 'home' ? 'text-gray-500 hover:text-blue-600' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> {t("Become a Host")}
                </button>
              )}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin-panel')}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 ${
                    currentPage === 'admin-panel'
                      ? 'text-blue-600'
                      : scrolled || currentPage !== 'home' ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" /> {t("Admin")}
                </button>
              )}
            </nav>

            {/* ACTIONS */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
              {/* WISHLIST ICON SHORTCUT */}
              {user && (
                <button
                  onClick={() => {
                    setCurrentPage('user-dashboard');
                  }}
                  className={`relative p-2 rounded-full hover:bg-gray-100/10 cursor-pointer ${
                    scrolled || currentPage !== 'home' ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              )}

              {/* CURRENCY SELECTOR */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCurrencyOpen(!currencyOpen);
                    setLanguageOpen(false);
                    setNotifOpen(false);
                    setUserMenuOpen(false);
                  }}
                  className={`flex items-center gap-1 text-xs xl:text-sm font-semibold px-2 py-1.5 rounded-lg hover:bg-gray-100/10 cursor-pointer ${
                    scrolled || currentPage !== 'home' ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <span>{selectedCurrency.code}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-100 p-2 text-gray-900 z-50"
                    >
                      <p className="text-[11px] font-semibold text-gray-400 px-3 py-1.5 uppercase tracking-wider">Select Currency</p>
                      {currencies.map(curr => (
                        <button
                          key={curr.code}
                          onClick={() => selectCurrency(curr.code)}
                          className="flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <span className="font-medium">{curr.label}</span>
                          {selectedCurrency.code === curr.code && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* GLOBE LANGUAGE */}
              <div className="relative">
                <button
                  onClick={() => {
                    setLanguageOpen(!languageOpen);
                    setCurrencyOpen(false);
                    setNotifOpen(false);
                    setUserMenuOpen(false);
                  }}
                  className={`p-2 rounded-full hover:bg-gray-100/10 cursor-pointer ${
                    scrolled || currentPage !== 'home' ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {languageOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 p-2 text-gray-900 z-50"
                    >
                      <p className="text-[11px] font-semibold text-gray-400 px-3 py-1.5 uppercase tracking-wider">{t("Language")}</p>
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                          {selectedLanguage.code === lang.code && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* NOTIFICATIONS BELL */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setCurrencyOpen(false);
                    setLanguageOpen(false);
                    setUserMenuOpen(false);
                    if (!notifOpen) markNotificationsAsRead();
                  }}
                  className={`relative p-2 rounded-full hover:bg-gray-100/10 cursor-pointer ${
                    scrolled || currentPage !== 'home' ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-lg border border-gray-100 p-3 text-gray-900 z-50"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                        <span className="font-bold text-gray-900 text-sm">{t("Notifications")}</span>
                        <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">{t("Latest updates")}</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-2.5">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-400 text-xs">{t("No notifications yet.")}</div>
                        ) : (
                          notifications.map(notif => (
                            <div key={notif.id} className="p-2.5 hover:bg-gray-50 rounded-lg transition-colors flex gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-xs font-semibold text-gray-900">{notif.title}</h4>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block">{notif.date}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* USER PROFILE DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setCurrencyOpen(false);
                    setLanguageOpen(false);
                    setNotifOpen(false);
                  }}
                  className={`flex items-center gap-2 p-1.5 pl-2.5 rounded-full border hover:shadow-sm transition-all cursor-pointer ${
                    scrolled || currentPage !== 'home'
                      ? 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="text-xs font-semibold max-w-20 truncate">
                    {user ? user.name.split(' ')[0] : t("Sign In")}
                  </span>
                  {user ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-gray-100 p-2 text-gray-900 z-50"
                    >
                      {user ? (
                        <>
                          {/* User Header */}
                          <div className="px-3 py-2.5 border-b border-gray-100 mb-2">
                            <p className="text-xs text-gray-400">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {user.role} role
                            </span>
                          </div>

                          {/* Options */}
                          <button
                            onClick={() => {
                              setCurrentPage('user-dashboard');
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <User className="w-4 h-4 text-gray-400" /> {t("Guest Dashboard")}
                          </button>
                          <button
                            onClick={() => {
                              setCurrentPage('host-dashboard');
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <Plus className="w-4 h-4 text-gray-400" /> {t("Host Dashboard")}
                          </button>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => {
                                setCurrentPage('admin-panel');
                                setUserMenuOpen(false);
                              }}
                              className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                            >
                              <Shield className="w-4 h-4 text-amber-500" /> {t("Admin Controller")}
                            </button>
                          )}
                          <div className="border-t border-gray-100 my-1.5" />
                          <button
                            onClick={() => {
                              switchRole(user.role === 'host' ? 'guest' : 'host');
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100/70 rounded-lg font-medium cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" /> {t("Switch to")} {user.role === 'host' ? t('Guest') : t('Host')}
                          </button>
                          <div className="border-t border-gray-100 my-1.5" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-red-500" /> {t("Sign Out")}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleLoginRedirect}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            {t("Sign In / Register")}
                          </button>
                          <div className="border-t border-gray-100 my-1.5" />
                          <button
                            onClick={() => {
                              setCurrentPage('search');
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <Compass className="w-4 h-4 text-gray-400" /> {t("Explore Properties")}
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* SIDEBAR MENU BUTTON (MOBILE / TABLET ONLY) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl transition-all hover:bg-gray-100/10 cursor-pointer border border-gray-200/50 hover:bg-gray-50 flex items-center justify-center flex-shrink-0"
              style={{
                color: scrolled || currentPage !== 'home' ? '#1f2937' : '#ffffff',
                borderColor: scrolled || currentPage !== 'home' ? 'rgba(229, 231, 235, 1)' : 'rgba(255, 255, 255, 0.2)'
              }}
              title="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* COMPREHENSIVE SIDEBAR DRAWER NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-[90%] sm:w-[85%] max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col text-gray-900"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div
                  onClick={() => {
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
                    <Compass className="w-4.5 h-4.5 animate-spin-slow" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    Pro<span className="text-blue-600">States</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* 1. COMPREHENSIVE SIDEBAR SEARCH BAR */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{t("Search Properties")}</p>
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full h-11 bg-gray-100 border border-gray-200 rounded-xl focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all shadow-xs">
                    <div className="absolute left-3.5 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={t("Where would you like to go?")}
                      value={destQuery}
                      onChange={(e) => setDestQuery(e.target.value)}
                      className="w-full pl-10 pr-20 bg-transparent border-none text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none focus:ring-0 h-full"
                    />
                    {destQuery && (
                      <button
                        type="button"
                        onClick={() => setDestQuery('')}
                        className="absolute right-11 p-1 rounded-full text-gray-400 hover:bg-gray-200/60"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-1 w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* 2. GENERAL NAVIGATION */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{t("Navigate")}</p>
                  <button
                    onClick={() => {
                      setCurrentPage('home');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === 'home'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Compass className="w-5 h-5 text-gray-400" /> {t("Home")}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('search');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === 'search'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Search className="w-5 h-5 text-gray-400" /> {t("Explore Properties")}
                  </button>
                </div>

                {/* 3. WORKSPACE DASHBOARDS */}
                {user && (
                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{t("My Workspace")}</p>
                    <button
                      onClick={() => {
                        setCurrentPage('user-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                        currentPage === 'user-dashboard'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-5 h-5 text-gray-400" /> {t("Guest Dashboard")}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('host-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                        currentPage === 'host-dashboard'
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Plus className="w-5 h-5 text-gray-400" /> {t("Host Dashboard")}
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentPage('admin-panel');
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full text-left p-3 rounded-xl text-sm font-semibold transition-colors ${
                          currentPage === 'admin-panel'
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Shield className="w-5 h-5 text-amber-500" /> {t("Admin Controller")}
                      </button>
                    )}

                    {/* Wishlist item inside workspace list */}
                    <button
                      onClick={() => {
                        setCurrentPage('user-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full p-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        {t("Wishlist Stays")}
                      </span>
                      {wishlist.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {wishlist.length}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* 4. NOTIFICATIONS */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">{t("Alerts")}</p>
                  <button
                    onClick={() => {
                      setSidebarNotificationsOpen(!sidebarNotificationsOpen);
                      if (!sidebarNotificationsOpen) markNotificationsAsRead();
                    }}
                    className="flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <div className="relative">
                        <Bell className="w-5 h-5 text-gray-400" />
                        {unreadNotifs > 0 && (
                          <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                        )}
                      </div>
                      {t("Notifications")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {unreadNotifs > 0 && (
                        <span className="text-[10px] text-white bg-red-500 px-1.5 py-0.5 rounded-full font-bold">
                          {unreadNotifs} new
                        </span>
                      )}
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sidebarNotificationsOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {sidebarNotificationsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-gray-50/50 rounded-xl border border-gray-100/50"
                      >
                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="text-center text-xs text-gray-400 py-4">{t("No notifications yet.")}</p>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif.id} className="p-2.5 bg-white border border-gray-100 rounded-lg shadow-xs flex gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                                  <span className="text-[9px] text-gray-400 mt-1 block">{notif.date}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. CURRENCY & LANGUAGE LOCALES */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-1">{t("Preferences")}</p>
                  
                  {/* Currency Selector */}
                  <div>
                    <button
                      onClick={() => {
                        setSidebarCurrencyOpen(!sidebarCurrencyOpen);
                        setSidebarLanguageOpen(false);
                      }}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Landmark className="w-5 h-5 text-gray-400" />
                        {t("Currency")}: <span className="text-blue-600 font-bold">{selectedCurrency.code}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sidebarCurrencyOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {sidebarCurrencyOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-xl border border-gray-100/50 mt-1"
                        >
                          <div className="p-2 grid grid-cols-2 gap-1">
                            {currencies.map(curr => (
                              <button
                                key={curr.code}
                                onClick={() => selectCurrency(curr.code)}
                                className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                  selectedCurrency.code === curr.code
                                    ? 'bg-blue-100 text-blue-700 font-bold'
                                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span>{curr.label}</span>
                                {selectedCurrency.code === curr.code && <Check className="w-3.5 h-3.5 text-blue-700" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <button
                      onClick={() => {
                        setSidebarLanguageOpen(!sidebarLanguageOpen);
                        setSidebarCurrencyOpen(false);
                      }}
                      className="flex items-center justify-between w-full p-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        {t("Language")}: <span className="text-blue-600 font-bold">{selectedLanguage.name}</span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sidebarLanguageOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {sidebarLanguageOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-gray-50/50 rounded-xl border border-gray-100/50 mt-1"
                        >
                          <div className="p-2 space-y-1">
                            {languages.map(lang => (
                              <button
                                key={lang.code}
                                onClick={() => selectLanguage(lang.code)}
                                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                                  selectedLanguage.code === lang.code
                                    ? 'bg-blue-100 text-blue-700 font-bold'
                                    : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <span className="text-sm">{lang.flag}</span>
                                <span>{lang.name}</span>
                                {selectedLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-blue-700 ml-auto" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Drawer Footer & User Card */}
              <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 max-w-[80%]">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs"
                        />
                        <div className="truncate">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer flex-shrink-0"
                        title="Sign Out"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        switchRole(user.role === 'host' ? 'guest' : 'host');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all border border-blue-100 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {t("Switch to")} {user.role === 'host' ? t('Guest') : t('Host')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentPage('auth');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-center font-bold shadow-md shadow-blue-600/15 hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {t("Sign In or Register")}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SEARCH FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {searchOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setSearchOverlayOpen(false)}
                className="absolute right-4 top-4 p-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Search className="text-blue-600 w-5 h-5" /> Search Global Stays
              </h2>
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Where would you like to go?</label>
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="e.g. Cotswolds, Kyoto, Amalfi Coast, Positano"
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Check-In</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Check-Out</label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/15 transition-colors cursor-pointer"
                >
                  Search Properties
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Add simple spin slow utility in css or direct inline style
const refreshKeyframe = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .animate-spin-slow {
      animation: spin-slow 15s linear infinite;
    }
    ${refreshKeyframe}
  `;
  document.head.appendChild(style);
}
