import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Compass, ShieldCheck, Globe, Instagram, Facebook, ArrowRight, HelpCircle } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage, selectedCurrency, selectedLanguage, t } = useApp();
  const [emailValue, setEmailValue] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue.trim()) return;
    setNewsSuccess(true);
    setEmailValue('');
    setTimeout(() => setNewsSuccess(false), 2000);
  };

  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-800 pt-16 pb-12 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Logo Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <div
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Pro<span className="text-blue-500">States</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              ProStates Ltd is a premier, design-first vacation stays marketplace based in the United Kingdom. We curate elite Grade-II stone manors, infinity ocean villas, and off-grid design cabins in 45 countries with physical 50-point host inspections.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ATOL & ABTA Protected Agency Services</span>
            </div>
          </div>

          {/* Links col 1 */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t("Company")}</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => setCurrentPage('home')} className="hover:text-white transition-colors cursor-pointer">{t("About Stays")}</button></li>
              <li><button className="hover:text-white transition-colors cursor-not-allowed">{t("Premium Careers")}</button></li>
              <li><button className="hover:text-white transition-colors cursor-not-allowed">{t("Investor Relations")}</button></li>
              <li><button className="hover:text-white transition-colors cursor-not-allowed">{t("Curation Pressroom")}</button></li>
            </ul>
          </div>

          {/* Links col 2 */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t("Co-Hosting")}</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => setCurrentPage('auth')} className="hover:text-white transition-colors cursor-pointer">{t("Become a Host")}</button></li>
              <li><button className="hover:text-white transition-colors cursor-not-allowed">{t("Listing Checklists")}</button></li>
              <li><button className="hover:text-white transition-colors cursor-not-allowed">{t("Host Insurance Coverage")}</button></li>
              <li><button className="hover:text-white transition-colors cursor-not-allowed">{t("Community Forum")}</button></li>
            </ul>
          </div>

          {/* Links col 3 */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t("ProNewsletter")}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t("Sign up for elite travel newsletters, luxury collections launches, and exclusive early access coupons.")}
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder={t("Your premium email")}
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              >
                {newsSuccess ? 'Saved' : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* BOTTOM SECTION BAR */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 font-medium">
          <div>
            <p>© 2026 ProStates Ltd. All global rights reserved. Registered Office: London, SW1, United Kingdom.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4.5">
            <span className="hover:text-white transition-colors cursor-pointer">{t("Privacy Charter")}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t("Terms of Service")}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t("Cookies Directive")}</span>
            <span className="hover:text-white transition-colors cursor-pointer">{t("Accessibility Statement")}</span>

            <div className="flex items-center gap-1.5 text-gray-400 bg-slate-800 px-2.5 py-1 rounded-md">
              <Globe className="w-3.5 h-3.5" />
              <span>{selectedLanguage.name} • {selectedCurrency.code}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
