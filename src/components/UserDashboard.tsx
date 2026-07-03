import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User, Calendar, Heart, MessageSquare, Wallet, Settings, Send, Trash2,
  ShieldCheck, Check, Compass, CreditCard, ChevronRight, Bell, HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PropertyCard from './PropertyCard';

export default function UserDashboard() {
  const {
    user,
    setUser,
    bookings,
    cancelBooking,
    properties,
    wishlist,
    formatPrice,
    chats,
    sendMessage,
    notifications,
    selectedCurrency,
    orders
  } = useApp();

  const [activeTab, setActiveTab] = useState<'trips' | 'wishlist' | 'chats' | 'wallet' | 'settings' | 'contracts'>('trips');
  const [activeChatId, setActiveChatId] = useState<string | null>(chats[0]?.id || null);
  const [typeText, setTypeText] = useState('');
  const [mobileShowThreadList, setMobileShowThreadList] = useState(true);

  // Local settings/profile state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Deposit funds mockup
  const [depositAmount, setDepositAmount] = useState('');
  const [depositSuccess, setDepositSuccess] = useState(false);

  if (!user) {
    return (
      <div className="pt-32 pb-20 text-center text-gray-500">
        Please sign in to view your dashboard.
      </div>
    );
  }

  // Filter properties in wishlist
  const wishlistedProperties = properties.filter((p) => wishlist.includes(p.id));

  // Current selected chat thread
  const currentChat = chats.find((ch) => ch.id === activeChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeText.trim() || !activeChatId) return;
    sendMessage(activeChatId, typeText.trim());
    setTypeText('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...user,
      name: profileName,
      phone: profilePhone,
      bio: profileBio,
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleAddFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setUser({
      ...user,
      walletBalance: user.walletBalance + (amount / selectedCurrency.rate),
    });
    setDepositAmount('');
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-[#FAFBFD] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm"
            />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Welcome back,</p>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{user.name}</h1>
              <p className="text-xs text-gray-500 mt-0.5">Guest Member • Joined {user.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 divide-x divide-gray-100 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 self-start md:self-auto">
            <div className="pr-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ProWallet Balance</span>
              <p className="text-lg font-black text-blue-600 mt-0.5">{formatPrice(user.walletBalance)}</p>
            </div>
            <div className="pl-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trips Booked</span>
              <p className="text-lg font-black text-gray-800 mt-0.5">
                {bookings.filter((b) => b.status === 'upcoming').length} upcoming
              </p>
            </div>
          </div>
        </div>

        {/* WORKSPACE SECTIONS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* TAB SIDEBAR SELECTOR */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 lg:space-y-2 no-scrollbar w-full">
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'trips'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4.5 h-4.5" /> My Trips
              </span>
              <ChevronRight className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4.5 h-4.5" /> Wishlist Stays
              </span>
              <ChevronRight className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'chats'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4.5 h-4.5" /> Messages & Chat
              </span>
              <ChevronRight className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Wallet className="w-4.5 h-4.5" /> ProWallet Payments
              </span>
              <ChevronRight className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'contracts'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CreditCard className="w-4.5 h-4.5" /> Buying & Installments
              </span>
              <ChevronRight className="hidden lg:block w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-shrink-0 lg:w-full flex items-center justify-between p-3.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-white border border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Settings className="w-4.5 h-4.5" /> Profile & Security
              </span>
              <ChevronRight className="hidden lg:block w-4 h-4" />
            </button>
          </div>

          {/* MAIN MODULE CONTENT */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 min-h-[400px] shadow-xs">
            {/* 1. MY TRIPS TAB */}
            {activeTab === 'trips' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Your Booking History</h2>
                  <p className="text-xs text-gray-400">View upcoming adventures and previous historic stays</p>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Compass className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
                    <p className="text-sm text-gray-500">You have no stay bookings registered yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((bk) => (
                      <div key={bk.id} className="flex flex-col md:flex-row border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors bg-[#FAFBFD]/30">
                        <img
                          src={bk.propertyImage}
                          alt={bk.propertyTitle}
                          className="w-full md:w-40 aspect-4/3 md:aspect-auto md:h-28 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                STAY ID: {bk.id}
                              </span>
                              <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-1">{bk.propertyTitle}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">{bk.propertyCity}, {bk.propertyCountry}</p>
                            </div>
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                bk.status === 'upcoming'
                                  ? 'bg-amber-100 text-amber-800'
                                  : bk.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {bk.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2.5 border-t border-gray-100/60 text-xs">
                            <div className="flex flex-wrap gap-4 text-gray-500">
                              <div>
                                <span>Dates: </span>
                                <strong className="text-gray-800">{bk.checkIn} to {bk.checkOut}</strong>
                              </div>
                              <div>
                                <span>Guests: </span>
                                <strong className="text-gray-800">{bk.guestsCount} Guests</strong>
                              </div>
                              <div>
                                <span>Total Price: </span>
                                <strong className="text-gray-800">{formatPrice(bk.totalPrice)}</strong>
                              </div>
                            </div>

                            {bk.status === 'upcoming' && (
                              <button
                                onClick={() => cancelBooking(bk.id)}
                                className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 font-bold text-[10px] uppercase rounded-lg transition-all cursor-pointer"
                              >
                                Cancel Stays
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Your Wishlisted Sanctuaries</h2>
                  <p className="text-xs text-gray-400">Curate stays that caught your eye for future holiday retreats</p>
                </div>

                {wishlistedProperties.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <Heart className="w-12 h-12 text-gray-200 mx-auto fill-gray-50" />
                    <p className="text-sm text-gray-400">Your wishlist is empty. Explore properties to start saving them!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistedProperties.map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. MESSAGES TAB (LIVE INTERACTIVE CHAT ENGINE) */}
            {activeTab === 'chats' && (
              <div className="space-y-6 h-full flex flex-col">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Host Correspondence</h2>
                  <p className="text-xs text-gray-400">Message verified property hosts about check-in, checkouts, and rules</p>
                </div>

                {chats.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-sm text-gray-400">No chat logs found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch border border-gray-100 rounded-2xl overflow-hidden h-[450px]">
                    {/* Left chat threads */}
                    <div className={`md:col-span-5 border-r border-gray-100 overflow-y-auto divide-y divide-gray-50 h-full ${
                      mobileShowThreadList ? 'block' : 'hidden md:block'
                    }`}>
                      {chats.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setActiveChatId(ch.id);
                            setMobileShowThreadList(false);
                          }}
                          className={`w-full text-left p-3.5 flex gap-3 transition-colors hover:bg-gray-50 cursor-pointer ${
                            activeChatId === ch.id ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <img
                            src={ch.recipientAvatar}
                            alt={ch.recipientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-900 truncate">{ch.recipientName}</span>
                              <span className="text-[9px] text-gray-400 font-semibold">{ch.lastMessageTime}</span>
                            </div>
                            <span className="block text-[10px] text-blue-600 font-bold truncate">{ch.propertyTitle}</span>
                            <p className="text-[11px] text-gray-500 truncate mt-1">{ch.lastMessage}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Right messaging panel */}
                    <div className={`md:col-span-7 flex flex-col justify-between bg-gray-50/30 h-full ${
                      !mobileShowThreadList ? 'flex' : 'hidden md:flex'
                    }`}>
                      {currentChat ? (
                        <>
                          {/* Chat header */}
                          <div className="p-3 bg-white border-b border-gray-100 flex items-center gap-2.5">
                            <button
                              onClick={() => setMobileShowThreadList(true)}
                              className="md:hidden p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 mr-1 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            <img
                              src={currentChat.recipientAvatar}
                              alt={currentChat.recipientName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <span className="text-xs font-bold text-gray-900 block">{currentChat.recipientName}</span>
                              <span className="text-[9px] text-blue-600 font-bold">{currentChat.propertyTitle}</span>
                            </div>
                          </div>

                          {/* Chat message history bubble renderer */}
                          <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {currentChat.messages.length === 0 ? (
                              <p className="text-center text-[11px] text-gray-400 py-10">Send your first message...</p>
                            ) : (
                              currentChat.messages.map((msg) => {
                                const isSelf = msg.senderId === user.id;
                                return (
                                  <div key={msg.id} className={`flex gap-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                    {!isSelf && (
                                      <img
                                        src={msg.senderAvatar}
                                        alt={msg.senderName}
                                        className="w-6 h-6 rounded-full object-cover self-end"
                                      />
                                    )}
                                    <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-xs ${
                                      isSelf
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                      <p>{msg.text}</p>
                                      <span className={`block text-[8px] mt-1 text-right ${
                                        isSelf ? 'text-white/70' : 'text-gray-400'
                                      }`}>
                                        {msg.timestamp}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Chat input panel */}
                          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                              type="text"
                              value={typeText}
                              onChange={(e) => setTypeText(e.target.value)}
                              placeholder="Write a message to your host..."
                              className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50/50"
                            />
                            <button
                              type="submit"
                              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          Select a host thread to initiate messaging.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. WALLET TAB */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">ProWallet Transactions</h2>
                  <p className="text-xs text-gray-400">Instantly pay and keep track of stay refunds or deposits safely</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Balance details */}
                  <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                    <CreditCard className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">ProStates Member Card</span>
                    <p className="text-2xl font-black mt-4">{formatPrice(user.walletBalance)}</p>
                    <p className="text-xs text-white/60 mt-1">Available deposit currency</p>
                    <div className="mt-8 text-[11px] font-mono text-white/80">
                      CARD NO: **** **** **** 8503
                    </div>
                  </div>

                  {/* Add funds mockup */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Deposit Funds</h3>
                    <p className="text-xs text-gray-500 mb-4">Add in-app balance directly to book stays without card check delays.</p>

                    <form onSubmit={handleAddFunds} className="space-y-3.5">
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">
                          {selectedCurrency.symbol}
                        </span>
                        <input
                          type="number"
                          placeholder="Amount in your local currency"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-xs bg-white focus:border-blue-500"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={depositSuccess}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        {depositSuccess ? 'Funds Deposited Successfully!' : 'Deposit Funds'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Profile Settings</h2>
                  <p className="text-xs text-gray-400">Control your public bio, contact information, and notifications</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Mobile Phone Number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Your Biography</label>
                    <textarea
                      rows={3}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2.5 border-t border-gray-100 pt-4">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Email Notifications</h3>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Receive email notifications for booking confirmations</span>
                      <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Receive marketing newsletters for travel inspirations</span>
                      <input type="checkbox" className="accent-blue-600 w-4 h-4" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSuccess}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {profileSuccess ? (
                        <>
                          <Check className="w-4 h-4" /> Profile Updated
                        </>
                      ) : (
                        'Save Profile Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 6. CONTRACTS & INSTALLMENTS TAB */}
            {activeTab === 'contracts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Purchase Orders & Rent-to-Own Plans</h2>
                  <p className="text-xs text-gray-400">Track outright property purchases and periodic installment contracts</p>
                </div>

                {!orders || orders.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <CreditCard className="w-12 h-12 text-gray-300 mx-auto animate-pulse" />
                    <p className="text-sm text-gray-500">You have no active purchase contracts or installment plans yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="flex flex-col md:flex-row border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors bg-[#FAFBFD]/30">
                        <img
                          src={ord.propertyImage}
                          alt={ord.propertyTitle}
                          className="w-full md:w-40 aspect-4/3 md:aspect-auto md:h-28 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                ord.type === 'installment' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                              }`}>
                                {ord.type === 'installment' ? 'Rent-To-Own' : 'Outright Buy'}
                              </span>
                              <h3 className="text-sm font-bold text-gray-900 mt-1.5 line-clamp-1">{ord.propertyTitle}</h3>
                              <p className="text-xs text-gray-400 mt-0.5">Acquirer: {ord.buyerName} ({ord.buyerEmail})</p>
                            </div>
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                ord.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-2.5 border-t border-gray-100/60 text-xs">
                            <div className="flex flex-wrap gap-4 text-gray-500">
                              {ord.type === 'installment' ? (
                                <>
                                  <div>
                                    <span>Term Progress: </span>
                                    <strong className="text-gray-800">{ord.installmentsPaid} of {ord.installmentsTotal} months</strong>
                                  </div>
                                  <div>
                                    <span>Monthly Payment: </span>
                                    <strong className="text-emerald-600">{formatPrice(ord.installmentAmount)}</strong>
                                  </div>
                                  <div>
                                    <span>Remaining Balance: </span>
                                    <strong className="text-gray-800">{formatPrice((ord.installmentsTotal - ord.installmentsPaid) * ord.installmentAmount)}</strong>
                                  </div>
                                </>
                              ) : (
                                <div>
                                  <span>Outright Acquisition Price: </span>
                                  <strong className="text-blue-600">{formatPrice(ord.totalPrice)}</strong>
                                </div>
                              )}
                            </div>

                            {ord.type === 'installment' && ord.status === 'active' && (
                              <button
                                onClick={() => {
                                  ord.installmentsPaid = Math.min(ord.installmentsTotal, ord.installmentsPaid + 1);
                                  if (ord.installmentsPaid === ord.installmentsTotal) {
                                    ord.status = 'completed';
                                  }
                                  setUser({...user});
                                  alert('Processed monthly installment payment of ' + formatPrice(ord.installmentAmount));
                                }}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-lg transition-all cursor-pointer shadow-sm shadow-emerald-500/10"
                              >
                                Pay Installment
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
