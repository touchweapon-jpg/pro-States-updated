import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Homepage from './components/Homepage';
import SearchPage from './components/SearchPage';
import PropertyDetails from './components/PropertyDetails';
import UserDashboard from './components/UserDashboard';
import HostDashboard from './components/HostDashboard';
import AdminPanel from './components/AdminPanel';
import AuthPages from './components/AuthPages';
import Footer from './components/Footer';

function AppContent() {
  const { currentPage } = useApp();

  // Scroll to top automatically when page routes change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="flex flex-col min-h-screen text-slate-900 bg-[#FAFBFD] selection:bg-blue-600/10 selection:text-blue-600 antialiased font-sans">
      {/* GLOBAL HEADER */}
      <Header />

      {/* PAGE VIEW ROUTER */}
      <main className="flex-grow">
        {currentPage === 'home' && <Homepage />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'property-details' && <PropertyDetails />}
        {currentPage === 'user-dashboard' && <UserDashboard />}
        {currentPage === 'host-dashboard' && <HostDashboard />}
        {currentPage === 'admin-panel' && <AdminPanel />}
        {currentPage === 'auth' && <AuthPages />}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
