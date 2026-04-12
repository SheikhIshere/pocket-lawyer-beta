import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Scale, Menu, X, User, ChevronDown,
  Settings, FileText, Briefcase,
  Phone, Mail, MapPin, ExternalLink,
  Shield, Lock, Globe, Sun, Moon,
  MessageSquare, Star
} from 'lucide-react';


// Logo Component
const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gradient-to-br from-teal-600 to-emerald-700 p-2.5 rounded-lg flex items-center justify-center shadow-lg ${className || ''}`}>
    <Scale className="w-6 h-6 text-white" />
  </div>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [bottomMenuOpen, setBottomMenuOpen] = useState(false);
  const bottomMenuRef = useRef<HTMLDivElement>(null);
  const [bottomMenuStartY, setBottomMenuStartY] = useState(0);
  const [bottomMenuCurrentY, setBottomMenuCurrentY] = useState(0);
  const [bottomMenuIsDragging, setBottomMenuIsDragging] = useState(false);
  const [bottomMenuDragDelta, setBottomMenuDragDelta] = useState(0);

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Scroll lock for bottom menu
  useEffect(() => {
    if (bottomMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [bottomMenuOpen]);

  const handleBottomMenuDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setBottomMenuStartY(clientY);
    setBottomMenuIsDragging(true);
    setBottomMenuDragDelta(0);
  };

  const handleBottomMenuDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!bottomMenuIsDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setBottomMenuCurrentY(clientY);
    const delta = clientY - bottomMenuStartY;
    if (delta > 0) { // Only allow dragging downwards
      setBottomMenuDragDelta(delta);
    }
  };

  const handleBottomMenuDragEnd = () => {
    setBottomMenuIsDragging(false);
    if (bottomMenuDragDelta > 80) { // If dragged more than 80px downwards, close the menu
      setBottomMenuOpen(false);
    }
    setBottomMenuDragDelta(0); // Reset drag transformation
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors duration-500 pb-[env(safe-area-inset-bottom,1.5rem)] lg:pb-0">
      {!location.pathname.includes('/chat') && <Header setBottomMenuOpen={setBottomMenuOpen} />}
      <main className={`flex-1 ${location.pathname.includes('/chat') ? 'h-full' : 'pb-20 lg:pb-0'}`}>{children}</main>
      {!location.pathname.includes('/chat') && <Footer />}
      <AnimatePresence>
        {bottomMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBottomMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[75]"
            />
            <motion.div
              ref={bottomMenuRef}
              initial={{ y: '100%' }}
              animate={{ y: bottomMenuDragDelta }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-[80] p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col max-h-[85vh]"
              onTouchStart={handleBottomMenuDragStart}
              onTouchMove={handleBottomMenuDragMove}
              onTouchEnd={handleBottomMenuDragEnd}
            >
              {/* Handle Bar */}
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8 shrink-0" />

              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                  A
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white capitalize">Anonymous User</div>
                  <div className="text-sm font-medium text-slate-500 dark:text-gray-400">demo@pocketlawyer.ai</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto -mx-6 px-6 scrollbar-hide">
                <div className="grid grid-cols-1 gap-2">
                  {[
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setBottomMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                        <item.icon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">{item.desc}</p>
                      </div>
                    </Link>
                  ))}

                  <button
                    onClick={() => {
                      toggleTheme();
                      setBottomMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                      {isDark ? <Sun className="w-5.5 h-5.5" /> : <Moon className="w-5.5 h-5.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-white">{isDark ? 'Light Mode' : 'Dark Mode'}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-500">Toggle visual theme</p>
                    </div>
                  </button>

                  <div className="my-4 h-px bg-slate-100 dark:bg-slate-800 mx-4" />

                  <Link
                    to="/chat"
                    onClick={() => setBottomMenuOpen(false)}
                    className="w-full p-4 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-teal-500/20"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Start New Chat
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export const Header: React.FC<{ setBottomMenuOpen?: (isOpen: boolean) => void }> = ({ setBottomMenuOpen = () => { } }) => {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  
  const navLinks: any[] = [];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 shadow-lg shadow-gray-100/50 dark:shadow-none'
        : 'bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18 lg:h-20 flex-nowrap overflow-hidden">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-1.5 sm:p-2 rounded-lg lg:p-2.5 lg:rounded-xl shadow-lg">
                  <Scale className="w-5 h-5 sm:w-6 lg:w-7 lg:h-7 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none block truncate">PocketLawyer</span>
                  <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-[10px] font-black rounded-md border border-teal-200 dark:border-teal-800/50 uppercase tracking-tighter">BETA</span>
                </div>
                <span className="hidden sm:block text-[9px] lg:text-[10px] font-medium text-teal-600 dark:text-teal-400 tracking-wider uppercase mt-0.5">
                  AI Legal Assistant
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.path)
                    ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-3">
                <Link
                  to="/chat"
                  className="px-4 sm:px-8 py-2.5 sm:py-3 bg-[#0E8E82] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Start Chatting</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </header>

    </>
  );
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubscribing) return;

    setIsSubscribing(true);
    setSubscribeMessage('');

    try {
      await api.newsletterService.subscribe(email.trim());
      setSubscribeMessage('Successfully subscribed! Check your email for confirmation.');
      setEmail('');
    } catch (error: any) {
      setSubscribeMessage(error?.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-16 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-2.5 rounded-xl shadow-lg">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">PocketLawyer</div>
                <div className="text-sm text-teal-400 font-medium">AI Legal Assistant</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6">
              Professional AI-powered legal assistance platform.
              Empowering individuals and businesses with accessible,
              reliable legal guidance 24/7.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-teal-700 transition-colors group">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-teal-700 transition-colors group">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-400" />
              Services
            </h4>
            <ul className="space-y-3">
              {['Document Review', 'Contract Analysis', 'Legal Research', 'Case Evaluation', 'Compliance Check'].map((service) => (
                <li key={service}>
                  <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
                { label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
                { label: 'Disclaimer', icon: <Shield className="w-4 h-4" /> },
                { label: 'Cookie Policy', icon: <Globe className="w-4 h-4" /> },
                { label: 'GDPR Compliance', icon: <Shield className="w-4 h-4" /> },
              ].map((item) => (
                <li key={item.label}>
                  <a href="#" className="text-sm text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-400" />
              Stay Updated
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for legal insights and updates.
            </p>
            <form className="space-y-3" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-700 text-white py-3 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-teal-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
              {subscribeMessage && (
                <div className={`text-sm ${subscribeMessage.includes('Successfully') ? 'text-green-400' : 'text-red-400'}`}>
                  {subscribeMessage}
                </div>
              )}
            </form>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>[Network Protected Mode]</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                <Mail className="w-4 h-4" />
                <span>[Support Access Restricted]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © 2024 PocketLawyer AI. All rights reserved.
              <span className="block md:inline mt-1 md:mt-0 md:ml-2 text-gray-600">
                This platform provides AI-assisted legal guidance and is not a substitute for professional legal advice.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors">
                Sitemap
              </a>
              <a href="#" className="text-gray-500 hover:text-teal-400 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};