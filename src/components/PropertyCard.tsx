import React, { useState } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Star, ChevronLeft, ChevronRight, Wifi, Car, Wind, Users, Bed, Bath, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { wishlist, toggleWishlist, formatPrice, setSelectedPropertyId, setCurrentPage } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(property.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const handleCardClick = () => {
    setSelectedPropertyId(property.id);
    setCurrentPage('property-details');
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* IMAGE CONTAINER WITH CAROUSEL */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* IMAGE GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-gray-700 hover:text-red-500 shadow-md transition-all z-20 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700'
            }`}
          />
        </button>

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {property.isSuperHost && (
            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
              Superhost
            </span>
          )}
          {property.isVerified && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {/* CAROUSEL NAVIGATION BUTTONS */}
        <AnimatePresence>
          {isHovered && property.images.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-lg text-gray-800 z-10 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md shadow-lg text-gray-800 z-10 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* CAROUSEL DOTS INDICATORS */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/25 backdrop-blur-sm px-2 py-1 rounded-full">
            {property.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-2.5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CARD BODY CONTENT */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* CITY, COUNTRY & RATING */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-blue-600">
              {property.city}, {property.country}
            </span>
            <div className="flex items-center gap-1 text-gray-800 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{property.rating.toFixed(2)}</span>
              <span className="text-gray-400 font-normal">({property.reviewsCount})</span>
            </div>
          </div>

          {/* TITLE */}
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          {/* AMENITIES TICKER */}
          <div className="flex items-center gap-3.5 text-gray-500 text-xs mb-4">
            <div className="flex items-center gap-1" title="Guests count limit">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.guestsMax}</span>
            </div>
            <div className="flex items-center gap-1" title="Bedrooms">
              <Bed className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.bedrooms} Bed{property.bedrooms > 1 && 's'}</span>
            </div>
            <div className="flex items-center gap-1" title="Bathrooms">
              <Bath className="w-3.5 h-3.5 text-gray-400" />
              <span>{property.bathrooms} Bath{property.bathrooms > 1 && 's'}</span>
            </div>

            {/* CONDITIONAL FEATURES */}
            <div className="ml-auto flex items-center gap-1">
              {property.amenities.includes('Wi-Fi') && (
                <span title="Wi-Fi Included">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              )}
              {property.amenities.includes('Parking') && (
                <span title="Parking Included">
                  <Car className="w-3.5 h-3.5 text-blue-500" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER: PRICE & INSTANT BOOKING */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            {(!property.transactionMode || property.transactionMode === 'rental') && (
              <>
                <p className="text-xs text-gray-400 font-medium">Nightly Rate</p>
                <p className="text-base font-black text-gray-900">
                  {formatPrice(property.pricePerNight)}{' '}
                  <span className="text-xs text-gray-400 font-normal">/ night</span>
                </p>
              </>
            )}
            {(property.transactionMode === 'buy' || property.transactionMode === 'sell') && (
              <>
                <p className="text-xs text-gray-400 font-medium">{property.transactionMode === 'buy' ? 'Buyout Price' : 'Listed Sale Price'}</p>
                <p className="text-base font-black text-blue-600">
                  {formatPrice(property.salePrice || 750000)}
                </p>
              </>
            )}
            {property.transactionMode === 'installment' && (
              <>
                <p className="text-xs text-gray-400 font-medium">Rent-to-Own</p>
                <p className="text-base font-black text-emerald-600">
                  {formatPrice(property.installmentPrice || 2500)}{' '}
                  <span className="text-[10px] text-gray-400 font-normal">/ month</span>
                </p>
              </>
            )}
          </div>

          {property.isInstantBook && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg">
              <Zap className="w-3 h-3 fill-blue-600 text-blue-600" /> Instant Book
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
