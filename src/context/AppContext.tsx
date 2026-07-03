import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Host, Booking, UserProfile, Notification, ChatThread, ChatMessage, PurchaseOrder } from '../types';
import { MOCK_PROPERTIES, INITIAL_USER, MOCK_NOTIFICATIONS, MOCK_BOOKINGS, MOCK_CHAT_THREADS, MOCK_ORDERS, currencies, languages } from '../data';

interface SearchCriteria {
  destination: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}

interface FilterCriteria {
  category: string;
  propertyType: string;
  priceRange: [number, number];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  instantBookOnly: boolean;
  superHostOnly: boolean;
}

interface AppContextType {
  // Navigation & Page State
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;
  prevPage: string | null;
  setPrevPage: (page: string | null) => void;

  // Search & Filters State
  searchCriteria: SearchCriteria;
  setSearchCriteria: (criteria: SearchCriteria) => void;
  filters: FilterCriteria;
  setFilters: (filters: FilterCriteria) => void;
  resetFilters: () => void;

  // Currency & Language
  selectedCurrency: typeof currencies[0];
  setCurrencyByCode: (code: string) => void;
  selectedLanguage: typeof languages[0];
  setLanguageByCode: (code: string) => void;
  formatPrice: (priceGBP: number) => string;
  t: (text: string) => string;

  // User & Roles
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  switchRole: (role: 'guest' | 'host' | 'admin') => void;

  // Properties list
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'host'>) => void;
  updateProperty: (id: string, updated: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  toggleVerifyProperty: (id: string) => void;

  // Bookings list
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  cancelBooking: (id: string) => void;

  // Orders list
  orders: PurchaseOrder[];
  addOrder: (order: Omit<PurchaseOrder, 'id' | 'orderDate'>) => void;
  updateOrder: (id: string, updated: Partial<PurchaseOrder>) => void;
  deleteOrder: (id: string) => void;

  // Wishlist list
  wishlist: string[];
  toggleWishlist: (id: string) => void;

  // Messages & Chats
  chats: ChatThread[];
  sendMessage: (threadId: string, text: string) => void;
  addChatThread: (propertyId: string) => string;

  // Notifications
  notifications: Notification[];
  markNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: Notification['type']) => void;
}

const defaultFilters: FilterCriteria = {
  category: 'all',
  propertyType: 'all',
  priceRange: [0, 1000],
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  instantBookOnly: false,
  superHostOnly: false,
};

const TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    // Navigation / Header
    "Home": "Accueil",
    "Explore Stays": "Explorer les séjours",
    "Explore Properties": "Explorer les propriétés",
    "Become a Host": "Devenir hôte",
    "Host Dashboard": "Tableau de bord de l'hôte",
    "Guest Dashboard": "Tableau de bord",
    "Admin": "Admin",
    "Admin Controller": "Contrôleur Admin",
    "Search Properties": "Rechercher des propriétés",
    "Sign In / Register": "Se connecter / S'enregistrer",
    "Sign In or Register": "Se connecter ou s'enregistrer",
    "Sign Out": "Se déconnecter",
    "Where to go?": "Où aller ?",
    "Where would you like to go?": "Où aimeriez-vous aller ?",
    "Check-In": "Arrivée",
    "Check-Out": "Départ",
    "Guests": "Voyageurs",
    "Search": "Rechercher",
    "Notifications": "Notifications",
    "Latest updates": "Dernières mises à jour",
    "No notifications yet.": "Pas encore de notifications.",
    "Wishlist": "Coups de cœur",
    "Wishlist Stays": "Séjours coup de cœur",
    "Preferences": "Préférences",
    "Currency": "Devise",
    "Language": "Langue",
    "Alerts": "Alertes",
    "Switch to": "Passer à",
    "Guest": "Voyageur",
    "Host": "Hôte",
    "Navigate": "Naviguer",
    "My Workspace": "Mon espace",
    "Open Menu": "Ouvrir le menu",

    // Hero / Search Area
    "Search the world's finest boutique stays": "Recherchez les meilleurs séjours de charme au monde",
    "Handpicked Grade-II heritage manors, architectural beach villas, and luxury design cabins.": "Manoirs historiques classés, villas balnéaires d'architectes et cabines de design de luxe sélectionnés à la main.",
    "Destinations": "Destinations",
    "Where to?": "Où aller ?",
    "Guests Count": "Nombre d'invités",
    "Reset Filters": "Réinitialiser les filtres",
    "Search Stays": "Rechercher",
    "All Categories": "Toutes catégories",
    "Popular Filters": "Filtres populaires",
    "Price Range": "Gamme de prix",
    "Stays": "Séjours",

    // Footer
    "Company": "Entreprise",
    "About Stays": "À propos",
    "Premium Careers": "Carrières premium",
    "Investor Relations": "Relations investisseurs",
    "Curation Pressroom": "Salle de presse",
    "Co-Hosting": "Co-hébergement",
    "Listing Checklists": "Listes de contrôle",
    "Host Insurance Coverage": "Assurance hôte",
    "Community Forum": "Forum communautaire",
    "ProNewsletter": "Lettre d'information",
    "Sign up for elite travel newsletters, luxury collections launches, and exclusive early access coupons.": "Inscrivez-vous à nos lettres d'information d'élite, aux lancements de collections de luxe et aux coupons d'accès anticipé exclusifs.",
    "Your premium email": "Votre e-mail premium",
    "Privacy Charter": "Charte de confidentialité",
    "Terms of Service": "Conditions d'utilisation",
    "Cookies Directive": "Directive sur les cookies",
    "Accessibility Statement": "Déclaration d'accessibilité",
  },
  de: {
    // Navigation / Header
    "Home": "Startseite",
    "Explore Stays": "Erkunden",
    "Explore Properties": "Unterkünfte erkunden",
    "Become a Host": "Gastgeber werden",
    "Host Dashboard": "Gastgeber-Dashboard",
    "Guest Dashboard": "Gäste-Dashboard",
    "Admin": "Admin",
    "Admin Controller": "Admin-Controller",
    "Search Properties": "Unterkünfte suchen",
    "Sign In / Register": "Einloggen / Registrieren",
    "Sign In or Register": "Einloggen oder Registrieren",
    "Sign Out": "Abmelden",
    "Where to go?": "Wohin reisen?",
    "Where would you like to go?": "Wohin möchten Sie reisen?",
    "Check-In": "Anreise",
    "Check-Out": "Abreise",
    "Guests": "Gäste",
    "Search": "Suchen",
    "Notifications": "Benachrichtigungen",
    "Latest updates": "Neueste Updates",
    "No notifications yet.": "Noch keine Benachrichtigungen.",
    "Wishlist": "Wunschliste",
    "Wishlist Stays": "Gespeicherte Unterkünfte",
    "Preferences": "Einstellungen",
    "Currency": "Währung",
    "Language": "Sprache",
    "Alerts": "Meldungen",
    "Switch to": "Wechseln zu",
    "Guest": "Gast",
    "Host": "Gastgeber",
    "Navigate": "Navigieren",
    "My Workspace": "Mein Arbeitsbereich",
    "Open Menu": "Menü öffnen",

    // Hero / Search Area
    "Search the world's finest boutique stays": "Suchen Sie die weltweit feinsten Boutique-Unterkünfte",
    "Handpicked Grade-II heritage manors, architectural beach villas, and luxury design cabins.": "Handverlesene historische Herrenhäuser, architektonische Strandvillas und luxuriöse Design-Hütten.",
    "Destinations": "Reiseziele",
    "Where to?": "Wohin?",
    "Guests Count": "Anzahl der Gäste",
    "Reset Filters": "Filter zurücksetzen",
    "Search Stays": "Suchen",
    "All Categories": "Alle Kategorien",
    "Popular Filters": "Beliebte Filter",
    "Price Range": "Preisspanne",
    "Stays": "Unterkünfte",

    // Footer
    "Company": "Unternehmen",
    "About Stays": "Über uns",
    "Premium Careers": "Karriere",
    "Investor Relations": "Investoren",
    "Curation Pressroom": "Pressebereich",
    "Co-Hosting": "Co-Hosting",
    "Listing Checklists": "Checklisten",
    "Host Insurance Coverage": "Haftpflichtversicherung",
    "Community Forum": "Community-Forum",
    "ProNewsletter": "Premium-Newsletter",
    "Sign up for elite travel newsletters, luxury collections launches, and exclusive early access coupons.": "Melden Sie sich für Elite-Reisenewsletter, Luxuskollektionen und exklusive Gutscheine an.",
    "Your premium email": "Ihre Premium-E-Mail",
    "Privacy Charter": "Datenschutz",
    "Terms of Service": "Nutzungsbedingungen",
    "Cookies Directive": "Cookie-Richtlinie",
    "Accessibility Statement": "Barrierefreiheit",
  },
  es: {
    // Navigation / Header
    "Home": "Inicio",
    "Explore Stays": "Explorar",
    "Explore Properties": "Explorar propiedades",
    "Become a Host": "Devenir anfitrión",
    "Host Dashboard": "Panel de anfitrión",
    "Guest Dashboard": "Panel de huésped",
    "Admin": "Admin",
    "Admin Controller": "Panel de control admin",
    "Search Properties": "Buscar propiedades",
    "Sign In / Register": "Iniciar sesión / Registrarse",
    "Sign In or Register": "Iniciar sesión o registrarse",
    "Sign Out": "Cerrar sesión",
    "Where to go?": "¿A dónde vas?",
    "Where would you like to go?": "¿A dónde te gustaría ir?",
    "Check-In": "Llegada",
    "Check-Out": "Salida",
    "Guests": "Huéspedes",
    "Search": "Buscar",
    "Notifications": "Notificaciones",
    "Latest updates": "Últimas actualizaciones",
    "No notifications yet.": "No hay notificaciones aún.",
    "Wishlist": "Favoritos",
    "Wishlist Stays": "Alojamientos favoritos",
    "Preferences": "Preferencias",
    "Currency": "Moneda",
    "Language": "Idioma",
    "Alerts": "Alertas",
    "Switch to": "Cambiar a",
    "Guest": "Huésped",
    "Host": "Anfitrión",
    "Navigate": "Navegar",
    "My Workspace": "Mi espacio de trabajo",
    "Open Menu": "Abrir menú",

    // Hero / Search Area
    "Search the world's finest boutique stays": "Busca los mejores alojamientos boutique del mundo",
    "Handpicked Grade-II heritage manors, architectural beach villas, and luxury design cabins.": "Casas señoriales históricas, villas de playa de diseño arquitectónico y cabañas de lujo seleccionadas a mano.",
    "Destinations": "Destinos",
    "Where to?": "¿A dónde?",
    "Guests Count": "Número de huéspedes",
    "Reset Filters": "Restablecer filtros",
    "Search Stays": "Buscar",
    "All Categories": "Todas las categorías",
    "Popular Filters": "Filtros populares",
    "Price Range": "Rango de precios",
    "Stays": "Alojamientos",

    // Footer
    "Company": "Compañía",
    "About Stays": "Sobre nosotros",
    "Premium Careers": "Empleos premium",
    "Investor Relations": "Relaciones con inversores",
    "Curation Pressroom": "Sala de prensa",
    "Co-Hosting": "Coanfitrión",
    "Listing Checklists": "Listas de verificación",
    "Host Insurance Coverage": "Cobertura de seguro de host",
    "Community Forum": "Foro de la comunidad",
    "ProNewsletter": "Boletín premium",
    "Sign up for elite travel newsletters, luxury collections launches, and exclusive early access coupons.": "Suscríbase a boletines de viajes selectos, lanzamientos de colecciones de lujo y cupones de acceso anticipado.",
    "Your premium email": "Su correo premium",
    "Privacy Charter": "Política de privacidad",
    "Terms of Service": "Términos de servicio",
    "Cookies Directive": "Directiva de cookies",
    "Accessibility Statement": "Declaración de accesibilidad",
  },
  it: {
    // Navigation / Header
    "Home": "Home",
    "Explore Stays": "Esplora",
    "Explore Properties": "Esplora proprietà",
    "Become a Host": "Diventa un host",
    "Host Dashboard": "Dashboard dell'host",
    "Guest Dashboard": "Dashboard dell'ospite",
    "Admin": "Amministratore",
    "Admin Controller": "Pannello amministratore",
    "Search Properties": "Cerca proprietà",
    "Sign In / Register": "Accedi / Registrati",
    "Sign In or Register": "Accedi o registrati",
    "Sign Out": "Disconnetti",
    "Where to go?": "Dove andare?",
    "Where would you like to go?": "Dove vorresti andare?",
    "Check-In": "Check-in",
    "Check-Out": "Check-out",
    "Guests": "Ospiti",
    "Search": "Cerca",
    "Notifications": "Notifiche",
    "Latest updates": "Ultimi aggiornamenti",
    "No notifications yet.": "Nessuna notifica.",
    "Wishlist": "Preferiti",
    "Wishlist Stays": "Soggiorni preferiti",
    "Preferences": "Preferenze",
    "Currency": "Valuta",
    "Language": "Lingua",
    "Alerts": "Avvisi",
    "Switch to": "Passa a",
    "Guest": "Ospite",
    "Host": "Host",
    "Navigate": "Naviga",
    "My Workspace": "Area personale",
    "Open Menu": "Apri menu",

    // Hero / Search Area
    "Search the world's finest boutique stays": "Cerca i migliori soggiorni di charme al mondo",
    "Handpicked Grade-II heritage manors, architectural beach villas, and luxury design cabins.": "Dimore storiche d'epoca, ville sulla spiaggia d'autore e cottage di design selezionati con cura.",
    "Destinations": "Destinazioni",
    "Where to?": "Dove?",
    "Guests Count": "Numero di ospiti",
    "Reset Filters": "Reimposta filtri",
    "Search Stays": "Cerca",
    "All Categories": "Tutte le categorie",
    "Popular Filters": "Filtri popolari",
    "Price Range": "Fascia di prezzo",
    "Stays": "Soggiorni",

    // Footer
    "Company": "Azienda",
    "About Stays": "Chi siamo",
    "Premium Careers": "Opportunità di lavoro",
    "Investor Relations": "Investitori",
    "Curation Pressroom": "Area stampa",
    "Co-Hosting": "Co-hosting",
    "Listing Checklists": "Linee guida",
    "Host Insurance Coverage": "Assicurazione host",
    "Community Forum": "Forum della community",
    "ProNewsletter": "Newsletter premium",
    "Sign up for elite travel newsletters, luxury collections launches, and exclusive early access coupons.": "Iscriviti per ricevere aggiornamenti di viaggio esclusivi, nuove collezioni e sconti speciali.",
    "Your premium email": "La tua email premium",
    "Privacy Charter": "Privacy Policy",
    "Terms of Service": "Termini di servizio",
    "Cookies Directive": "Policy sui cookie",
    "Accessibility Statement": "Accessibilità",
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);

  const setCurrentPage = (page: string) => {
    setPrevPage(currentPage);
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 1,
  });

  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);

  const resetFilters = () => setFilters(defaultFilters);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const setCurrencyByCode = (code: string) => {
    const found = currencies.find(c => c.code === code);
    if (found) setSelectedCurrency(found);
  };

  const setLanguageByCode = (code: string) => {
    const found = languages.find(l => l.code === code);
    if (found) setSelectedLanguage(found);
  };

  const formatPrice = (priceGBP: number) => {
    const converted = priceGBP * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${Math.round(converted).toLocaleString()}`;
  };

  const t = (text: string): string => {
    const code = selectedLanguage.code;
    if (code === 'en') return text;
    const dict = TRANSLATIONS[code];
    return dict && dict[text] ? dict[text] : text;
  };

  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);

  const switchRole = (role: 'guest' | 'host' | 'admin') => {
    if (user) {
      setUser({ ...user, role });
      setCurrentPage(role === 'host' ? 'host-dashboard' : role === 'admin' ? 'admin-panel' : 'user-dashboard');
    }
  };

  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [orders, setOrders] = useState<PurchaseOrder[]>(MOCK_ORDERS);
  const [wishlist, setWishlist] = useState<string[]>(['prop-1', 'prop-2']);
  const [chats, setChats] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const addProperty = (newProp: Omit<Property, 'id' | 'rating' | 'reviewsCount' | 'isVerified' | 'host'>) => {
    const hostObj: Host = {
      id: user?.id || 'host-anon',
      name: user?.name || 'Anonymous Host',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      rating: 4.90,
      reviewsCount: 1,
      isSuperHost: false,
      joinedDate: 'July 2026',
      responseRate: 100,
      responseTime: 'Within an hour',
    };

    const created: Property = {
      ...newProp,
      id: `prop-${properties.length + 1}`,
      rating: 5.0,
      reviewsCount: 0,
      isVerified: false,
      host: hostObj,
    };

    setProperties(prev => [created, ...prev]);
    addNotification('Listing Added', `Your property "${created.title}" is successfully listed! ProStates regional curators will verify it shortly.`, 'system');
  };

  const toggleVerifyProperty = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
    const prop = properties.find(p => p.id === id);
    if (prop) {
      addNotification(
        'Property Verification Updated',
        `The verification status for "${prop.title}" was updated by Admin.`,
        'system'
      );
    }
  };

  const addBooking = (newBooking: Omit<Booking, 'id' | 'status' | 'bookingDate'>) => {
    const created: Booking = {
      ...newBooking,
      id: `bk-${bookings.length + 1}`,
      status: 'upcoming',
      bookingDate: new Date().toISOString().split('T')[0],
    };

    setBookings(prev => [created, ...prev]);
    addNotification(
      'New Booking Created!',
      `You have successfully booked "${created.propertyTitle}" for ${created.checkIn} to ${created.checkOut}.`,
      'booking'
    );
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(bk => (bk.id === id ? { ...bk, status: 'cancelled' as const } : bk))
    );
    const bk = bookings.find(b => b.id === id);
    if (bk) {
      addNotification(
        'Booking Cancelled',
        `Your booking for "${bk.propertyTitle}" has been cancelled. If any refund is due, it will clear into your wallet.`,
        'booking'
      );
    }
  };

  const updateProperty = (id: string, updated: Partial<Property>) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updated } : p))
    );
    addNotification('Property Updated', `Property details updated by Admin.`, 'system');
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    addNotification('Property Deleted', `A property listing was removed by Admin.`, 'system');
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(bk => (bk.id === id ? { ...bk, status } : bk))
    );
    addNotification('Booking Status Updated', `Booking status changed to ${status} by Admin.`, 'system');
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    addNotification('Booking Deleted', `A booking record was deleted by Admin.`, 'system');
  };

  const addOrder = (newOrder: Omit<PurchaseOrder, 'id' | 'orderDate'>) => {
    const created: PurchaseOrder = {
      ...newOrder,
      id: `ord-${orders.length + 1}`,
      orderDate: new Date().toISOString().split('T')[0],
    };
    setOrders(prev => [created, ...prev]);
    addNotification('Order Placed', `A new property transaction order "${created.id}" was recorded.`, 'system');
  };

  const updateOrder = (id: string, updated: Partial<PurchaseOrder>) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === id ? { ...ord, ...updated } : ord))
    );
    addNotification('Order Updated', `Order "${id}" details updated by Admin.`, 'system');
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(ord => ord.id !== id));
    addNotification('Order Deleted', `Order "${id}" was deleted from the ledger by Admin.`, 'system');
  };

  const sendMessage = (threadId: string, text: string) => {
    setChats(prev =>
      prev.map(th => {
        if (th.id === threadId) {
          const newMsg: ChatMessage = {
            id: `msg-${th.messages.length + 1}`,
            senderId: user?.id || 'usr-1',
            senderName: user?.name || 'Alexander Sterling',
            senderAvatar: user?.avatar || '',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...th,
            lastMessage: text,
            lastMessageTime: 'Just Now',
            messages: [...th.messages, newMsg],
          };
        }
        return th;
      })
    );
  };

  const addChatThread = (propertyId: string) => {
    const existing = chats.find(ch => ch.propertyId === propertyId);
    if (existing) return existing.id;

    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return '';

    const newId = `chat-${chats.length + 1}`;
    const newThread: ChatThread = {
      id: newId,
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyImage: prop.images[0],
      recipientName: prop.host.name,
      recipientAvatar: prop.host.avatar,
      recipientRole: prop.host.isSuperHost ? 'host' : 'host',
      lastMessage: 'Started a conversation',
      lastMessageTime: 'Just Now',
      unreadCount: 0,
      messages: [],
    };

    setChats(prev => [newThread, ...prev]);
    return newId;
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: `notif-${notifications.length + 1}`,
      title,
      message,
      date: 'Just Now',
      isRead: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPropertyId,
        setSelectedPropertyId,
        prevPage,
        setPrevPage,
        searchCriteria,
        setSearchCriteria,
        filters,
        setFilters,
        resetFilters,
        selectedCurrency,
        setCurrencyByCode,
        selectedLanguage,
        setLanguageByCode,
        formatPrice,
        t,
        user,
        setUser,
        switchRole,
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleVerifyProperty,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        cancelBooking,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        wishlist,
        toggleWishlist,
        chats,
        sendMessage,
        addChatThread,
        notifications,
        markNotificationsAsRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
