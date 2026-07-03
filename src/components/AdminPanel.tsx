import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield, Users, Home, Landmark, ShieldCheck, Check, X, Settings, HelpCircle,
  Eye, ToggleLeft, ToggleRight, Sparkles, CheckCircle2, AlertCircle,
  DollarSign, Calendar, Plus, Trash2, Briefcase, Layers, Activity,
  FileText, RefreshCw, Percent, ChevronRight, User, Mail, Tag, MapPin, Clock, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, Booking, PurchaseOrder } from '../types';

export default function AdminPanel() {
  const {
    user,
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleVerifyProperty,
    formatPrice,
    bookings,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    cancelBooking,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    addNotification,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'properties' | 'bookings' | 'orders' | 'sales' | 'settings'>('overview');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering states
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'rental' | 'buy' | 'sell' | 'installment'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals / Form toggle states
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);

  // New property form state
  const [newProp, setNewProp] = useState({
    title: '',
    description: '',
    country: 'United Kingdom',
    city: '',
    countryCode: 'GB',
    pricePerNight: 250,
    guestsMax: 4,
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    category: 'luxury',
    transactionMode: 'rental' as 'rental' | 'buy' | 'sell' | 'installment',
    salePrice: 500000,
    installmentPrice: 2500,
    installmentsDurationMonths: 240,
    imageURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    amenitiesInput: 'Wi-Fi, Parking, Air Conditioning, Kitchen, Workspace',
  });

  // New booking form state
  const [newBf, setNewBf] = useState({
    propertyId: '',
    buyerName: 'James Henderson',
    buyerEmail: 'james.h@london-finance.com',
    checkIn: '2026-08-10',
    checkOut: '2026-08-15',
    guestsCount: 2,
  });

  // New order form state
  const [newOf, setNewOf] = useState({
    propertyId: '',
    buyerName: 'Isabella Mercer',
    buyerEmail: 'isabella@mercer-investments.com',
    type: 'buy' as 'buy' | 'sell' | 'installment',
    totalPrice: 950000,
    installmentAmount: 4000,
    installmentsTotal: 240,
  });

  // Inline edit state
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTitle, setEditTitle] = useState<string>('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-32 pb-20 text-center text-red-500 font-bold">
        Access Denied. Admin permissions required.
      </div>
    );
  }

  const unverifiedListingsCount = properties.filter((p) => !p.isVerified).length;

  // Calculate high-fidelity stats based on live properties, bookings, and orders!
  const directSalesTotal = orders
    .filter(o => o.status === 'completed' && (o.type === 'buy' || o.type === 'sell'))
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const activeInstallmentsCount = orders.filter(o => o.status === 'active' && o.type === 'installment').length;
  const installmentsCollected = orders
    .filter(o => o.type === 'installment')
    .reduce((sum, o) => sum + (o.installmentsPaid * o.installmentAmount), 0);

  const rentalIncomeCollected = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const pendingBookingIncome = bookings
    .filter(b => b.status === 'upcoming')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const grossTransactionVolume = directSalesTotal + installmentsCollected + rentalIncomeCollected + pendingBookingIncome;

  const handleUpdateSetting = (settingName: string) => {
    setSuccessMsg(`Setting "${settingName}" saved successfully.`);
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Submit handlers
  const handleCreatePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title || !newProp.city) {
      alert('Please fill out all required fields');
      return;
    }

    const amenitiesList = newProp.amenitiesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addProperty({
      title: newProp.title,
      description: newProp.description || `Exquisite handpicked ProStates property in ${newProp.city}, offering premium living standards and bespoke architectural layouts.`,
      country: newProp.country,
      city: newProp.city,
      countryCode: newProp.countryCode,
      pricePerNight: Number(newProp.pricePerNight),
      currency: 'GBP',
      guestsMax: Number(newProp.guestsMax),
      bedrooms: Number(newProp.bedrooms),
      bathrooms: Number(newProp.bathrooms),
      amenities: amenitiesList,
      images: [newProp.imageURL],
      type: newProp.type,
      category: newProp.category,
      isSuperHost: false,
      isInstantBook: true,
      latitude: Math.floor(Math.random() * 80) + 10,
      longitude: Math.floor(Math.random() * 80) + 10,
      transactionMode: newProp.transactionMode,
      salePrice: newProp.transactionMode !== 'rental' ? Number(newProp.salePrice) : undefined,
      installmentPrice: newProp.transactionMode === 'installment' ? Number(newProp.installmentPrice) : undefined,
      installmentsDurationMonths: newProp.transactionMode === 'installment' ? Number(newProp.installmentsDurationMonths) : undefined,
    });

    setShowAddProperty(false);
    triggerSuccess(`Successfully listed "${newProp.title}" as a ${newProp.transactionMode}!`);
    // Reset
    setNewProp({
      title: '',
      description: '',
      country: 'United Kingdom',
      city: '',
      countryCode: 'GB',
      pricePerNight: 250,
      guestsMax: 4,
      bedrooms: 2,
      bathrooms: 2,
      type: 'Apartment',
      category: 'luxury',
      transactionMode: 'rental',
      salePrice: 500000,
      installmentPrice: 2500,
      installmentsDurationMonths: 240,
      imageURL: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      amenitiesInput: 'Wi-Fi, Parking, Air Conditioning, Kitchen, Workspace',
    });
  };

  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBf.propertyId) {
      alert('Please select a property');
      return;
    }

    const prop = properties.find(p => p.id === newBf.propertyId);
    if (!prop) return;

    // Calculate nights
    const start = new Date(newBf.checkIn);
    const end = new Date(newBf.checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const calculatedTotal = nights * prop.pricePerNight;

    addBooking({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyImage: prop.images[0],
      propertyCity: prop.city,
      propertyCountry: prop.country,
      checkIn: newBf.checkIn,
      checkOut: newBf.checkOut,
      guestsCount: Number(newBf.guestsCount),
      totalPrice: calculatedTotal,
    });

    setShowAddBooking(false);
    triggerSuccess(`Manual booking created for ${newBf.buyerName} - ${nights} nights!`);
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOf.propertyId) {
      alert('Please select a property');
      return;
    }

    const prop = properties.find(p => p.id === newOf.propertyId);
    if (!prop) return;

    addOrder({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyImage: prop.images[0],
      buyerName: newOf.buyerName,
      buyerEmail: newOf.buyerEmail,
      type: newOf.type,
      totalPrice: Number(newOf.totalPrice),
      installmentsPaid: newOf.type === 'installment' ? 0 : 0,
      installmentsTotal: newOf.type === 'installment' ? Number(newOf.installmentsTotal) : 0,
      installmentAmount: newOf.type === 'installment' ? Number(newOf.installmentAmount) : 0,
      status: newOf.type === 'installment' ? 'active' : 'pending',
    });

    setShowAddOrder(false);
    triggerSuccess(`Ledger contract created for "${prop.title}"!`);
  };

  // Process next monthly payment for active installment plans
  const handleProcessInstallmentPayment = (orderId: string) => {
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return;

    const nextPaid = ord.installmentsPaid + 1;
    const completed = nextPaid >= ord.installmentsTotal;

    updateOrder(orderId, {
      installmentsPaid: nextPaid,
      status: completed ? 'completed' : 'active',
    });

    addNotification(
      'Installment Collected',
      `Monthly installment of ${formatPrice(ord.installmentAmount)} successfully processed for Order ${ord.id}. (${nextPaid}/${ord.installmentsTotal})`,
      'system'
    );
    triggerSuccess(`Processed installment payment of ${formatPrice(ord.installmentAmount)}!`);
  };

  // Quick edit property handler
  const handleStartEditing = (p: Property) => {
    setEditingPropId(p.id);
    setEditPrice(p.transactionMode !== 'rental' && p.salePrice ? p.salePrice : p.pricePerNight);
    setEditTitle(p.title);
  };

  const handleSavePropertyEdit = (pId: string, mode: Property['transactionMode']) => {
    if (mode === 'rental') {
      updateProperty(pId, {
        title: editTitle,
        pricePerNight: Number(editPrice),
      });
    } else {
      updateProperty(pId, {
        title: editTitle,
        salePrice: Number(editPrice),
      });
    }
    setEditingPropId(null);
    triggerSuccess('Property edited successfully!');
  };

  // Filter properties
  const filteredProperties = properties.filter(p => {
    if (propertyFilter === 'all') return true;
    if (propertyFilter === 'rental') return !p.transactionMode || p.transactionMode === 'rental';
    return p.transactionMode === propertyFilter;
  });

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (!bookingSearch) return true;
    const term = bookingSearch.toLowerCase();
    return (
      b.propertyTitle.toLowerCase().includes(term) ||
      b.propertyCity.toLowerCase().includes(term) ||
      b.id.toLowerCase().includes(term)
    );
  });

  // Filter orders
  const filteredOrders = orders.filter(o => {
    if (!orderSearch) return true;
    const term = orderSearch.toLowerCase();
    return (
      o.propertyTitle.toLowerCase().includes(term) ||
      o.buyerName.toLowerCase().includes(term) ||
      o.id.toLowerCase().includes(term) ||
      o.type.toLowerCase().includes(term)
    );
  });

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PANEL ADMIN HEADER */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">ProStates Command Center</p>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-none mt-1">Platform Admin Suite</h1>
              <p className="text-xs text-gray-500 mt-1">Primary Administrator Access • ALEXANDER STERLING</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => setAdminTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Dashboard Metrics
              </span>
            </button>
            <button
              onClick={() => setAdminTab('properties')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'properties'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> Stays & Listings ({unverifiedListingsCount} Approval)
              </span>
            </button>
            <button
              onClick={() => setAdminTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'bookings'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Bookings ({bookings.length})
              </span>
            </button>
            <button
              onClick={() => setAdminTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Direct Orders ({orders.length})
              </span>
            </button>
            <button
              onClick={() => setAdminTab('sales')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'sales'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> Sales & Purchases ({activeInstallmentsCount} Installments)
              </span>
            </button>
            <button
              onClick={() => setAdminTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                adminTab === 'settings'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Configurations
              </span>
            </button>
          </div>
        </div>

        {/* FEEDBACK SUCCESS */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-sm"
            >
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 1: METRICS OVERVIEW */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stat card 1 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Transaction Volume</span>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Landmark className="w-4.5 h-4.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{formatPrice(grossTransactionVolume)}</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live platform ledger total
                </div>
              </div>

              {/* Stat card 2 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Properties Inventory</span>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <Home className="w-4.5 h-4.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{properties.length} Stays</p>
                <div className="text-[10px] text-purple-600 font-semibold mt-1.5 flex gap-2">
                  <span>Rentals: {properties.filter(p => !p.transactionMode || p.transactionMode === 'rental').length}</span>
                  <span>Buy/Sell: {properties.filter(p => p.transactionMode === 'buy' || p.transactionMode === 'sell').length}</span>
                  <span>Plans: {properties.filter(p => p.transactionMode === 'installment').length}</span>
                </div>
              </div>

              {/* Stat card 3 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Bookings</span>
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{bookings.length} Booked</p>
                <p className="text-[10px] text-orange-600 font-bold mt-1.5 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> {bookings.filter(b => b.status === 'upcoming').length} Upcoming trips scheduled
                </p>
              </div>

              {/* Stat card 4 */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Installments Portfolio</span>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <DollarSign className="w-4.5 h-4.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{activeInstallmentsCount} Active Plans</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1.5">
                  Collected {formatPrice(installmentsCollected)} from monthly logs
                </p>
              </div>
            </div>

            {/* DYNAMIC REVENUE BREAKDOWN & MINI CHART */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Financial Revenue Streams</h3>
                    <p className="text-xs text-gray-400">Weighted real-time gross revenue breakdown</p>
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-600">
                    Grand Total: {formatPrice(grossTransactionVolume)}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress 1 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Direct Capital Property Buyouts</span>
                      <span>{formatPrice(directSalesTotal)} ({grossTransactionVolume > 0 ? Math.round((directSalesTotal / grossTransactionVolume) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${grossTransactionVolume > 0 ? (directSalesTotal / grossTransactionVolume) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Progress 2 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Rent-to-Own / Installment Payments</span>
                      <span>{formatPrice(installmentsCollected)} ({grossTransactionVolume > 0 ? Math.round((installmentsCollected / grossTransactionVolume) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${grossTransactionVolume > 0 ? (installmentsCollected / grossTransactionVolume) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Progress 3 */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Rental Booking Income (Completed & Upcoming)</span>
                      <span>{formatPrice(rentalIncomeCollected + pendingBookingIncome)} ({grossTransactionVolume > 0 ? Math.round(((rentalIncomeCollected + pendingBookingIncome) / grossTransactionVolume) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${grossTransactionVolume > 0 ? ((rentalIncomeCollected + pendingBookingIncome) / grossTransactionVolume) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-50 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Buys / Sells Contracts</p>
                    <p className="text-base font-black text-blue-600 mt-1">{orders.filter(o => o.type === 'buy' || o.type === 'sell').length} Closed</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Installments Active</p>
                    <p className="text-base font-black text-emerald-600 mt-1">{activeInstallmentsCount} Plans</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Holiday Bookings</p>
                    <p className="text-base font-black text-orange-600 mt-1">{bookings.length} Bookings</p>
                  </div>
                </div>
              </div>

              {/* Audit Log / Actions column */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-4">Portal Action Logs</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Host Verification</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Automated 50-point physical inspection live-sync active.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Escrow Secure</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Escrow release trigger set to T+24 hours post-arrival.</p>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-900">Installments Tracker</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Automated invoice collection processed on 1st of month.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES (RENTAL, BUYS, SELLS, INSTALLMENTS) */}
        {adminTab === 'properties' && (
          <div className="space-y-6">
            
            {/* Filter and Creation Ribbon */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
              <div className="flex flex-wrap gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100">
                {(['all', 'rental', 'buy', 'sell', 'installment'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPropertyFilter(mode)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer capitalize ${
                      propertyFilter === mode
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {mode === 'all' ? 'All Stays' : mode === 'buy' ? 'Buyouts' : mode === 'sell' ? 'Listed For Sale' : mode === 'installment' ? 'Installments' : 'Rentals'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddProperty(!showAddProperty)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto md:ml-0"
              >
                <Plus className="w-4 h-4" /> Add Premium Property
              </button>
            </div>

            {/* EXPANDABLE NEW PROPERTY CREATION FORM */}
            <AnimatePresence>
              {showAddProperty && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleCreatePropertySubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Onboard New Luxury Listing
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddProperty(false)}
                        className="p-1.5 bg-gray-100 text-gray-500 hover:text-gray-800 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Property Name / Title *</label>
                        <input
                          type="text"
                          required
                          value={newProp.title}
                          onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                          placeholder="e.g. Majestic Cotswolds Castle Estate"
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">City *</label>
                        <input
                          type="text"
                          required
                          value={newProp.city}
                          onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                          placeholder="e.g. Cotswolds"
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Country *</label>
                        <input
                          type="text"
                          required
                          value={newProp.country}
                          onChange={(e) => setNewProp({ ...newProp, country: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Type of Stay */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Property Class</label>
                        <select
                          value={newProp.type}
                          onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        >
                          <option value="Villa">Villa</option>
                          <option value="Cabin">Cabin</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Castle">Castle</option>
                          <option value="Tiny Home">Tiny Home</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Market Category</label>
                        <select
                          value={newProp.category}
                          onChange={(e) => setNewProp({ ...newProp, category: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        >
                          <option value="luxury">Luxury Estate</option>
                          <option value="beach">Beachside</option>
                          <option value="mountain">Alpine Cabin</option>
                          <option value="city">Urban Penthouse</option>
                          <option value="countryside">Countryside Retract</option>
                        </select>
                      </div>

                      {/* Operational Model */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Operational Model (Type)</label>
                        <select
                          value={newProp.transactionMode}
                          onChange={(e) => setNewProp({ ...newProp, transactionMode: e.target.value as any })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-blue-50/50 text-blue-900 font-bold"
                        >
                          <option value="rental">Nightly Rental</option>
                          <option value="buy">Direct Purchase buyout</option>
                          <option value="sell">Listed for Sale</option>
                          <option value="installment">Rent-to-Own / Installments</option>
                        </select>
                      </div>

                      {/* Nightly price (if rental) */}
                      {newProp.transactionMode === 'rental' && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nightly Rate (GBP)</label>
                          <input
                            type="number"
                            value={newProp.pricePerNight}
                            onChange={(e) => setNewProp({ ...newProp, pricePerNight: Number(e.target.value) })}
                            className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      )}

                      {/* Sale price (if buy/sell/installment) */}
                      {newProp.transactionMode !== 'rental' && (
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Sale / Buy Value (GBP)</label>
                          <input
                            type="number"
                            value={newProp.salePrice}
                            onChange={(e) => setNewProp({ ...newProp, salePrice: Number(e.target.value) })}
                            className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                          />
                        </div>
                      )}

                      {/* Installment payment monthly */}
                      {newProp.transactionMode === 'installment' && (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Installment Amount (GBP)</label>
                            <input
                              type="number"
                              value={newProp.installmentPrice}
                              onChange={(e) => setNewProp({ ...newProp, installmentPrice: Number(e.target.value) })}
                              className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contract Duration (Months)</label>
                            <input
                              type="number"
                              value={newProp.installmentsDurationMonths}
                              onChange={(e) => setNewProp({ ...newProp, installmentsDurationMonths: Number(e.target.value) })}
                              className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                            />
                          </div>
                        </>
                      )}

                      {/* Guests max */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Max Guests Capacity</label>
                        <input
                          type="number"
                          value={newProp.guestsMax}
                          onChange={(e) => setNewProp({ ...newProp, guestsMax: Number(e.target.value) })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      {/* Bedrooms */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Bedrooms</label>
                        <input
                          type="number"
                          value={newProp.bedrooms}
                          onChange={(e) => setNewProp({ ...newProp, bedrooms: Number(e.target.value) })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      {/* Bathrooms */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Bathrooms</label>
                        <input
                          type="number"
                          value={newProp.bathrooms}
                          onChange={(e) => setNewProp({ ...newProp, bathrooms: Number(e.target.value) })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      {/* Image URL */}
                      <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">High-Res Unsplash Image URL</label>
                        <input
                          type="text"
                          value={newProp.imageURL}
                          onChange={(e) => setNewProp({ ...newProp, imageURL: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      {/* Amenities */}
                      <div className="lg:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Amenities (Comma separated list)</label>
                        <input
                          type="text"
                          value={newProp.amenitiesInput}
                          onChange={(e) => setNewProp({ ...newProp, amenitiesInput: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => setShowAddProperty(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Approve & Launch Listing
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PROPERTIES GRID / DIRECT MANAGEMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((p) => {
                const isRental = !p.transactionMode || p.transactionMode === 'rental';
                const isBuy = p.transactionMode === 'buy';
                const isSell = p.transactionMode === 'sell';
                const isInstallment = p.transactionMode === 'installment';

                return (
                  <div key={p.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      {/* Image header */}
                      <div className="h-44 relative overflow-hidden">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        
                        {/* Transaction Mode Badge */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {isRental && <span className="text-[9px] bg-orange-600 text-white font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">Rental</span>}
                          {isBuy && <span className="text-[9px] bg-blue-600 text-white font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">Buyout</span>}
                          {isSell && <span className="text-[9px] bg-pink-600 text-white font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">Listed Sale</span>}
                          {isInstallment && <span className="text-[9px] bg-emerald-600 text-white font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">Installments</span>}
                        </div>

                        {/* Verification badge */}
                        <div className="absolute top-3 right-3">
                          {p.isVerified ? (
                            <span className="p-1 bg-white/95 text-emerald-600 rounded-lg flex items-center shadow-xs border border-emerald-100">
                              <ShieldCheck className="w-4 h-4" />
                            </span>
                          ) : (
                            <span className="p-1 bg-white/95 text-amber-600 rounded-lg flex items-center shadow-xs border border-amber-100">
                              <AlertCircle className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">{p.type} • {p.category}</span>
                          <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-blue-500" /> {p.city}, {p.countryCode}
                          </span>
                        </div>

                        {editingPropId === p.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-gray-50"
                            />
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-400">Rate/Value:</span>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-24 text-xs p-1.5 rounded-lg border border-gray-200 bg-gray-50"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{p.title}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{p.description}</p>
                          </>
                        )}

                        {/* Pricing details */}
                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-800">
                          {isRental && (
                            <div>
                              <p className="text-[10px] text-gray-400 font-medium">Nightly rate</p>
                              <p className="text-sm font-black text-orange-600">{formatPrice(p.pricePerNight)}<span className="text-[10px] font-normal text-gray-400">/night</span></p>
                            </div>
                          )}
                          {(isBuy || isSell) && (
                            <div>
                              <p className="text-[10px] text-gray-400 font-medium">Capital value</p>
                              <p className="text-sm font-black text-blue-600">{formatPrice(p.salePrice || 750000)}</p>
                            </div>
                          )}
                          {isInstallment && (
                            <div className="flex gap-4">
                              <div>
                                <p className="text-[10px] text-gray-400 font-medium">Monthly pay</p>
                                <p className="text-xs font-black text-emerald-600">{formatPrice(p.installmentPrice || 2500)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-medium">Value / Duration</p>
                                <p className="text-xs font-bold text-gray-600">{formatPrice(p.salePrice || 500000)} • {p.installmentsDurationMonths || 240}m</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="p-5 border-t border-gray-50 bg-gray-50/20 flex items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleVerifyProperty(p.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            p.isVerified
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100'
                          }`}
                          title="Toggle live verification"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteProperty(p.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                          title="Delete Property listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {editingPropId === p.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleSavePropertyEdit(p.id, p.transactionMode || 'rental')}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPropId(null)}
                            className="px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[10px] font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEditing(p)}
                          className="px-3.5 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-[11px] font-bold cursor-pointer"
                        >
                          Quick Edit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS MANAGER */}
        {adminTab === 'bookings' && (
          <div className="space-y-6">
            
            {/* Control Ribbon */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
              <input
                type="text"
                placeholder="Search bookings by property, city or ID..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white w-full max-w-sm"
              />
              <button
                onClick={() => setShowAddBooking(!showAddBooking)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
              >
                <Plus className="w-4 h-4" /> Book Stays Manually
              </button>
            </div>

            {/* EXPANDABLE MANUAL BOOKING FORM */}
            <AnimatePresence>
              {showAddBooking && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleCreateBookingSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" /> Book Stay Manually
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddBooking(false)}
                        className="p-1.5 bg-gray-100 text-gray-500 hover:text-gray-800 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Property selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Property *</label>
                        <select
                          required
                          value={newBf.propertyId}
                          onChange={(e) => setNewBf({ ...newBf, propertyId: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white font-bold"
                        >
                          <option value="">-- Choose stay option --</option>
                          {properties
                            .filter(p => !p.transactionMode || p.transactionMode === 'rental')
                            .map(p => (
                              <option key={p.id} value={p.id}>{p.title} ({formatPrice(p.pricePerNight)}/night)</option>
                            ))
                          }
                        </select>
                      </div>

                      {/* Guest name */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Guest Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newBf.buyerName}
                          onChange={(e) => setNewBf({ ...newBf, buyerName: e.target.value })}
                          placeholder="James Henderson"
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* Guest email */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Guest Email *</label>
                        <input
                          type="email"
                          required
                          value={newBf.buyerEmail}
                          onChange={(e) => setNewBf({ ...newBf, buyerEmail: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* Check-in */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Check-In Date *</label>
                        <input
                          type="date"
                          required
                          value={newBf.checkIn}
                          onChange={(e) => setNewBf({ ...newBf, checkIn: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* Check-out */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Check-Out Date *</label>
                        <input
                          type="date"
                          required
                          value={newBf.checkOut}
                          onChange={(e) => setNewBf({ ...newBf, checkOut: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* Guests count */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Guest Count</label>
                        <input
                          type="number"
                          value={newBf.guestsCount}
                          onChange={(e) => setNewBf({ ...newBf, guestsCount: Number(e.target.value) })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => setShowAddBooking(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Book Stay & Lock Escrow
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BOOKINGS TABLE */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Holiday Booking Portfolio</h3>
                <p className="text-xs text-gray-400">Total processed bookings: {bookings.length} active stays</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <tr>
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Stay Option</th>
                      <th className="p-4">Check In/Out</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Gross Income</th>
                      <th className="p-4">Booking Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-mono font-bold text-gray-900">{b.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={b.propertyImage} alt={b.propertyTitle} className="w-10 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-gray-900">{b.propertyTitle}</p>
                              <p className="text-[10px] text-gray-400">{b.propertyCity}, {b.propertyCountry}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-800">{b.checkIn}</p>
                          <p className="text-[10px] text-gray-400">to {b.checkOut}</p>
                        </td>
                        <td className="p-4 font-bold">{b.guestsCount} guests</td>
                        <td className="p-4 font-black text-gray-900">{formatPrice(b.totalPrice)}</td>
                        <td className="p-4">
                          {b.status === 'upcoming' && <span className="text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-lg uppercase">Upcoming</span>}
                          {b.status === 'completed' && <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg uppercase">Completed</span>}
                          {b.status === 'cancelled' && <span className="text-[10px] font-black bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-lg uppercase">Cancelled</span>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => updateBookingStatus(b.id, 'completed')}
                              className="p-1.5 hover:bg-gray-100 text-emerald-600 rounded-lg"
                              title="Mark Completed"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => cancelBooking(b.id)}
                              className="p-1.5 hover:bg-gray-100 text-amber-600 rounded-lg"
                              title="Cancel Booking"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="p-1.5 hover:bg-gray-100 text-red-600 rounded-lg"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIRECT ORDERS */}
        {adminTab === 'orders' && (
          <div className="space-y-6">
            {/* Control Ribbon */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
              <input
                type="text"
                placeholder="Search orders ledger by buyer, property..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white w-full max-w-sm"
              />
              <button
                onClick={() => setShowAddOrder(!showAddOrder)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
              >
                <Plus className="w-4 h-4" /> Record Capital Order
              </button>
            </div>

            {/* EXPANDABLE NEW ORDER FORM */}
            <AnimatePresence>
              {showAddOrder && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleCreateOrderSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" /> Record New Capital Order
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowAddOrder(false)}
                        className="p-1.5 bg-gray-100 text-gray-500 hover:text-gray-800 rounded-xl"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Property selection */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Select Property *</label>
                        <select
                          required
                          value={newOf.propertyId}
                          onChange={(e) => {
                            const pId = e.target.value;
                            const pr = properties.find(x => x.id === pId);
                            setNewOf({
                              ...newOf,
                              propertyId: pId,
                              type: pr?.transactionMode as any || 'buy',
                              totalPrice: pr?.salePrice || 500000,
                              installmentAmount: pr?.installmentPrice || 2500,
                              installmentsTotal: pr?.installmentsDurationMonths || 240,
                            });
                          }}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white font-bold"
                        >
                          <option value="">-- Choose capital property --</option>
                          {properties
                            .filter(p => p.transactionMode && p.transactionMode !== 'rental')
                            .map(p => (
                              <option key={p.id} value={p.id}>{p.title} ({formatPrice(p.salePrice || 0)})</option>
                            ))
                          }
                        </select>
                      </div>

                      {/* Buyer Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Client Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newOf.buyerName}
                          onChange={(e) => setNewOf({ ...newOf, buyerName: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* Buyer Email */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Client Email *</label>
                        <input
                          type="email"
                          required
                          value={newOf.buyerEmail}
                          onChange={(e) => setNewOf({ ...newOf, buyerEmail: e.target.value })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Contract Agreement</label>
                        <select
                          value={newOf.type}
                          onChange={(e) => setNewOf({ ...newOf, type: e.target.value as any })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <option value="buy">Direct purchase payout</option>
                          <option value="sell">Seller Listing payout</option>
                          <option value="installment">Rent-to-Own installment schedule</option>
                        </select>
                      </div>

                      {/* Total price */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Contract Price (GBP)</label>
                        <input
                          type="number"
                          value={newOf.totalPrice}
                          onChange={(e) => setNewOf({ ...newOf, totalPrice: Number(e.target.value) })}
                          className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                        />
                      </div>

                      {/* installment monthly */}
                      {newOf.type === 'installment' && (
                        <>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Installment (GBP)</label>
                            <input
                              type="number"
                              value={newOf.installmentAmount}
                              onChange={(e) => setNewOf({ ...newOf, installmentAmount: Number(e.target.value) })}
                              className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Total Installment duration (Months)</label>
                            <input
                              type="number"
                              value={newOf.installmentsTotal}
                              onChange={(e) => setNewOf({ ...newOf, installmentsTotal: Number(e.target.value) })}
                              className="w-full text-xs p-3 rounded-xl border border-gray-100 bg-gray-50"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => setShowAddOrder(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Draft Contract Order
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ORDERS TABLE */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Property Orders Ledger</h3>
                <p className="text-xs text-gray-400">Listing buyouts, sells offers, and custom installment agreements</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Property</th>
                      <th className="p-4">Client Buyer</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Contract Value</th>
                      <th className="p-4">Payment Schedule / Info</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-mono font-bold text-gray-900">{o.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={o.propertyImage} alt={o.propertyTitle} className="w-10 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-gray-900 line-clamp-1 max-w-[200px]">{o.propertyTitle}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{o.buyerName}</p>
                          <p className="text-[10px] text-gray-400">{o.buyerEmail}</p>
                        </td>
                        <td className="p-4">
                          {o.type === 'buy' && <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 font-bold px-2 py-0.5 rounded-md uppercase">Direct Buy</span>}
                          {o.type === 'sell' && <span className="text-[9px] bg-pink-50 text-pink-600 border border-pink-100 font-bold px-2 py-0.5 rounded-md uppercase">Listing Sell</span>}
                          {o.type === 'installment' && <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-2 py-0.5 rounded-md uppercase">Installment</span>}
                        </td>
                        <td className="p-4 font-black text-gray-900">{formatPrice(o.totalPrice)}</td>
                        <td className="p-4 text-gray-500 font-medium">
                          {o.type === 'installment' ? (
                            <div>
                              <p className="text-gray-900 font-bold">{o.installmentsPaid} / {o.installmentsTotal} paid</p>
                              <p className="text-[10px] text-gray-400">{formatPrice(o.installmentAmount)}/month</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">One-time payout</span>
                          )}
                        </td>
                        <td className="p-4">
                          {o.status === 'pending' && <span className="text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-lg uppercase">Pending</span>}
                          {o.status === 'active' && <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg uppercase">Active Plan</span>}
                          {o.status === 'completed' && <span className="text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-lg uppercase">Settled</span>}
                          {o.status === 'defaulted' && <span className="text-[10px] font-black bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-lg uppercase">Defaulted</span>}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {o.type === 'installment' && o.status === 'active' && (
                              <button
                                onClick={() => handleProcessInstallmentPayment(o.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                                title="Process monthly payment"
                              >
                                Collect Pay
                              </button>
                            )}
                            {o.status === 'pending' && (
                              <button
                                onClick={() => updateOrder(o.id, { status: o.type === 'installment' ? 'active' : 'completed' })}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => deleteOrder(o.id)}
                              className="p-1.5 hover:bg-gray-100 text-red-600 rounded-lg"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SALES & PURCHASES LEDGER */}
        {adminTab === 'sales' && (
          <div className="space-y-6">
            
            {/* Real Financial Totals Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 rounded-3xl text-white shadow-sm relative overflow-hidden">
                <Briefcase className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Total Direct Property Buyouts</p>
                <h3 className="text-2xl font-black mt-2">{formatPrice(directSalesTotal)}</h3>
                <p className="text-xs text-white/60 mt-1">From successfully closed purchase contracts</p>
              </div>

              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-sm relative overflow-hidden">
                <Landmark className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Total Installments Collected</p>
                <h3 className="text-2xl font-black mt-2">{formatPrice(installmentsCollected)}</h3>
                <p className="text-xs text-white/60 mt-1">Accumulated from Rent-to-Own portfolios</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-3xl text-white shadow-sm relative overflow-hidden">
                <DollarSign className="w-24 h-24 text-white/5 absolute -right-4 -bottom-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Rental Booking Revenue</p>
                <h3 className="text-2xl font-black mt-2">{formatPrice(rentalIncomeCollected + pendingBookingIncome)}</h3>
                <p className="text-xs text-white/60 mt-1">From {bookings.length} holiday stays</p>
              </div>
            </div>

            {/* Active installment contracts tracker */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Active Rent-to-Own Installment Schedules</h3>
                  <p className="text-xs text-gray-400">Process recurring monthly charges, monitor amortization, and track customer default levels</p>
                </div>
                <span className="text-xs bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-xl">
                  {activeInstallmentsCount} Portfolio Plans Active
                </span>
              </div>

              {orders.filter(o => o.type === 'installment').length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No installment plans registered in the platform ledger.</p>
              ) : (
                <div className="space-y-4">
                  {orders.filter(o => o.type === 'installment').map((o) => {
                    const percentPaid = Math.round((o.installmentsPaid / o.installmentsTotal) * 100);
                    return (
                      <div key={o.id} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <img src={o.propertyImage} alt={o.propertyTitle} className="w-12 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-gray-900">{o.propertyTitle}</h4>
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded uppercase">{o.status}</span>
                            </div>
                            <p className="text-[10px] text-gray-500">Client: {o.buyerName} ({o.buyerEmail})</p>
                          </div>
                        </div>

                        {/* Amortization slider */}
                        <div className="w-full lg:w-72 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-gray-600">
                            <span>Amortization Plan: {percentPaid}%</span>
                            <span>{o.installmentsPaid} of {o.installmentsTotal} Months</span>
                          </div>
                          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentPaid}%` }} />
                          </div>
                        </div>

                        {/* Financial stats */}
                        <div className="flex gap-4 text-xs">
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium">Next Payment Due</p>
                            <p className="font-bold text-gray-900">{formatPrice(o.installmentAmount)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium">Total Paid to Date</p>
                            <p className="font-bold text-emerald-600">{formatPrice(o.installmentsPaid * o.installmentAmount)}</p>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="shrink-0 self-end lg:self-auto">
                          {o.status === 'active' ? (
                            <button
                              onClick={() => handleProcessInstallmentPayment(o.id)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <DollarSign className="w-3.5 h-3.5" /> Process Next Payment
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-gray-400">Plan Settled</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE SETTINGS */}
        {adminTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-gray-900">Portal Settings Configurations</h2>
              <p className="text-xs text-gray-400">Configure global parameters, security enforcement levels, and translation catalogs</p>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-4">
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Enforce Host Verification</h4>
                  <p className="text-xs text-gray-400">Require all co-hosts to pass 50-point security checks before listing stays live</p>
                </div>
                <button
                  onClick={() => handleUpdateSetting('Host Verification Enforced')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Enabled (Sync)
                </button>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">SSL Encryption & Sandbox CORS</h4>
                  <p className="text-xs text-gray-400">Secure cross-origin frame headers and prevent cookie Hijack telemetry injection</p>
                </div>
                <button
                  onClick={() => handleUpdateSetting('Secure sandbox headers enforced')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Tighten Sandbox
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
