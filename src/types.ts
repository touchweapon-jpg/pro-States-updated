export interface Host {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  isSuperHost: boolean;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
}

export interface ReviewBreakdown {
  cleanliness: number;
  communication: number;
  checkIn: number;
  accuracy: number;
  location: number;
  value: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  breakdown?: ReviewBreakdown;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  countryCode: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  guestsMax: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  type: string; // 'Villa', 'Cabin', 'Apartment', 'Castle', 'Tiny Home', etc.
  category: string; // 'luxury', 'beach', 'mountain', 'city', 'countryside', 'pet-friendly', 'business'
  isSuperHost: boolean;
  isVerified: boolean;
  isInstantBook: boolean;
  host: Host;
  latitude: number; // 0-100 coordinates for our interactive canvas/SVG map
  longitude: number; // 0-100 coordinates for our interactive canvas/SVG map
  featured?: boolean;
  transactionMode?: 'rental' | 'buy' | 'sell' | 'installment';
  salePrice?: number;
  installmentPrice?: number;
  installmentsDurationMonths?: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyCity: string;
  propertyCountry: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  bookingDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'booking' | 'system' | 'message' | 'offer';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  recipientName: string;
  recipientAvatar: string;
  recipientRole: 'guest' | 'host' | 'support';
  messages: ChatMessage[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'guest' | 'host' | 'admin';
  joinedDate: string;
  walletBalance: number;
  currency: string;
  language: string;
  phone?: string;
  address?: string;
  bio?: string;
  preferences?: {
    notificationsEmail: boolean;
    notificationsPush: boolean;
    marketingEmails: boolean;
    autoInstantBook: boolean;
  };
}

export interface PurchaseOrder {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  buyerName: string;
  buyerEmail: string;
  type: 'buy' | 'sell' | 'installment';
  totalPrice: number;
  installmentsPaid: number;
  installmentsTotal: number;
  installmentAmount: number;
  status: 'pending' | 'active' | 'completed' | 'defaulted';
  orderDate: string;
}

