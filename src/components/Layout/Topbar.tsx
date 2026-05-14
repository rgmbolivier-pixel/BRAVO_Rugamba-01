import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, Building, Users as UsersIcon, Truck, 
  FileText, CreditCard, LayoutDashboard, Package, 
  AlertTriangle, ArrowRightLeft, Clock, Trash2, 
  Download, CheckSquare, Settings as SettingsIcon,
  LogOut, Terminal, Moon, Sun, Globe, Bell, Menu, X, ChevronDown,
  ChevronLeft, ChevronRight, Heart, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 240;
      navRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'az' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  if (!user) return null;

  const getNavItems = () => {
    const items = [];
    items.push({ path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') });
    
    if (user.role === 'staff') {
      items.push({ path: '/my-shift', icon: Clock, label: t('nav.my_shift') });
      items.push({ path: '/tasks', icon: CheckSquare, label: t('nav.tasks') });
      items.push({ path: '/waste-log', icon: Trash2, label: t('nav.waste_log') });
      items.push({ path: '/receiving', icon: Download, label: t('nav.receiving') });
      items.push({ path: '/inventory', icon: Package, label: t('nav.inventory') });
      items.push({ path: '/alerts', icon: AlertTriangle, label: t('nav.alerts') });
      items.push({ path: '/donations', icon: Heart, label: t('nav.donations') });
    } else if (user.role === 'manager') {
      items.push({ path: '/analytics', icon: BarChart3, label: t('nav.analytics') });
      items.push({ path: '/inventory', icon: Package, label: t('nav.inventory') });
      items.push({ path: '/alerts', icon: AlertTriangle, label: t('nav.alerts') });
      items.push({ path: '/transfers', icon: ArrowRightLeft, label: t('nav.transfers') });
      items.push({ path: '/waste-log', icon: Trash2, label: t('nav.waste_log') });
      items.push({ path: '/receiving', icon: Download, label: t('nav.receiving') });
      items.push({ path: '/tasks', icon: CheckSquare, label: t('nav.tasks') });
      items.push({ path: '/vendors', icon: Truck, label: t('nav.vendors') });
      items.push({ path: '/purchase-orders', icon: FileText, label: t('nav.po') });
      items.push({ path: '/donations', icon: Heart, label: t('nav.donations') });
    } else if (user.role === 'admin') {
      items.push({ path: '/analytics', icon: BarChart3, label: t('nav.analytics') });
      items.push({ path: '/branches', icon: Building, label: t('nav.branches') });
      items.push({ path: '/users', icon: UsersIcon, label: t('nav.users') });
      items.push({ path: '/vendors', icon: Truck, label: t('nav.vendors') });
      items.push({ path: '/purchase-orders', icon: FileText, label: t('nav.po') });
      items.push({ path: '/invoicing', icon: CreditCard, label: t('nav.invoicing') });
      items.push({ path: '/inventory', icon: Package, label: t('nav.inventory') });
      items.push({ path: '/alerts', icon: AlertTriangle, label: t('nav.alerts') });
      items.push({ path: '/donations', icon: Heart, label: t('nav.donations') });
    }
    return items;
  };

  const navItems = getNavItems();
  const timeString = time.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  return (
    <header className="topbar terminal-ui">
      <div className="topbar-container">
        <div className="topbar-left">
          <div className="logo-container" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
            <Terminal size={22} className="logo-icon" />
            <div className="logo-text-group">
              <span className="logo-text">BRAVO_OS</span>
            </div>
          </div>

          <div className="nav-scroll-container">
            <AnimatePresence>
              {showLeftArrow && (
                <motion.button 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="scroll-arrow left" 
                  onClick={() => scroll('left')}
                >
                  <ChevronLeft size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            <nav className="desktop-nav" ref={navRef} onScroll={checkScroll}>
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} className="nav-icon" />
                  <span>{item.label}</span>
                  {location.pathname === item.path && (
                    <motion.div 
                      layoutId="active-pill"
                      className="active-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              ))}
            </nav>

            <AnimatePresence>
              {showRightArrow && (
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="scroll-arrow right" 
                  onClick={() => scroll('right')}
                >
                  <ChevronRight size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="topbar-right">
          <div className="sys-metrics hide-mobile">
            <div className="metric-item">
              <Activity size={14} className="text-primary" />
              <span className="metric-label">LOAD</span>
              <span className="metric-value">0.42</span>
            </div>
            <div className="metric-item">
              <Clock size={14} className="text-primary" />
              <span className="metric-label">UPTIME</span>
              <span className="metric-value">187h</span>
            </div>
          </div>

          <div className="time-display hide-mobile">
            {timeString}
          </div>

          <div className="divider hide-mobile"></div>

          {/* Removed action-group with language/theme toggles as they are moved to dropdown */}


          <div className="user-section">
            <button className="icon-btn relative" title="Notifications" onClick={() => navigate('/alerts')}>
              <Bell size={18} />
              <span className="notification-badge">3</span>
            </button>
            
            <div className="user-dropdown-container hide-mobile">
              <button className="user-btn" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                <div className="avatar">{user.email[0].toUpperCase()}</div>
                <ChevronDown size={14} className={`chevron-icon ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setIsUserDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="user-dropdown"
                    >
                      <div className="dd-user-card">
                        <div className="dd-avatar">{user.email[0].toUpperCase()}</div>
                        <div className="dd-user-info">
                          <span className="dd-email">{user.email}</span>
                          <span className="dd-role">{user.role.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="dd-divider" />
                      <button className="dd-item" onClick={() => { navigate('/settings'); setIsUserDropdownOpen(false); }}>
                        <SettingsIcon size={16} />
                        <span>{t('nav.settings')}</span>
                      </button>
                      <button className="dd-item" onClick={() => { navigate('/alerts'); setIsUserDropdownOpen(false); }}>
                        <Bell size={16} />
                        <span>{t('nav.alerts')}</span>
                        <span className="dd-badge">3</span>
                      </button>
                      <button className="dd-item" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        <span>{theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')}</span>
                      </button>
                      <button className="dd-item" onClick={toggleLanguage}>
                        <Globe size={16} />
                        <span>{i18n.language === 'en' ? 'Azərbaycan dili' : 'English'}</span>
                        <span className="dd-lang-tag">{i18n.language.toUpperCase()}</span>
                      </button>
                      <div className="dd-divider" />
                      <button className="dd-item dd-danger" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>{t('common.logout')}</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-dropdown glass"
          >
            <div className="mobile-user-card">
              <div className="avatar large">{user.email[0].toUpperCase()}</div>
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <span className="user-role-badge">{user.role.toUpperCase()}</span>
              </div>
            </div>

            <div className="mobile-nav-list">
              <div className="section-label">{t('common.navigation')}</div>
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="icon-box">
                    <item.icon size={20} />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mobile-actions-section">
              <div className="section-label">SYSTEM SETTINGS</div>
              <div className="actions-grid">
                <button className="action-tile" onClick={toggleLanguage}>
                  <Globe size={20} />
                  <span>{i18n.language.toUpperCase()}</span>
                </button>
                <button className="action-tile" onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
                </button>
                <button className="action-tile" onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}>
                  <SettingsIcon size={20} />
                  <span>SETTINGS</span>
                </button>
                <button className="action-tile danger" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .topbar {
          height: var(--header-height);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: var(--bg-card);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-glass);
          z-index: 1000;
          font-family: var(--font-mono);
        }

        .topbar-container {
          max-width: 1600px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          gap: 20px;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
          min-width: 0;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .logo-icon { color: var(--primary); }
        .logo-text { font-size: 1.1rem; font-weight: 800; color: var(--primary); letter-spacing: 1px; }

        .nav-scroll-container {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 0;
          padding: 0 20px;
        }

        .scroll-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          transition: var(--transition);
        }
        .scroll-arrow:hover { background: var(--primary); color: white; }
        .scroll-arrow.left { left: -5px; }
        .scroll-arrow.right { right: -5px; }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          scroll-behavior: smooth;
          mask-image: linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent);
        }
        .desktop-nav::-webkit-scrollbar { display: none; }

        .nav-link {
          padding: 8px 16px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 4px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
        }
        .nav-link:hover { color: var(--primary); background: var(--bg-glass); }
        .nav-link.active { color: var(--primary); }

        .active-pill {
          position: absolute;
          bottom: -16px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .sys-metrics {
          display: flex;
          gap: 20px;
          padding-right: 20px;
          border-right: 1px solid var(--border-glass);
        }

        .metric-item { display: flex; flex-direction: column; gap: 2px; }
        .metric-label { font-size: 0.6rem; color: var(--text-dim); font-weight: 800; }
        .metric-value { font-size: 0.75rem; color: var(--text-main); font-weight: 800; }

        .time-display { font-size: 0.8rem; font-weight: 800; color: var(--primary); font-family: var(--font-mono); }

        .action-group { display: flex; align-items: center; gap: 12px; }
        .icon-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 4px; transition: var(--transition); }
        .icon-btn:hover { color: var(--primary); background: var(--bg-glass); }
        .divider { width: 1px; height: 20px; background: var(--border-glass); }

        .user-section { display: flex; align-items: center; gap: 16px; }
        .notification-badge {
          position: absolute; top: 0; right: 0; background: var(--danger); color: white;
          font-size: 0.6rem; padding: 1px 4px; border-radius: 10px; min-width: 16px;
        }

        .user-dropdown-container { position: relative; }
        .user-btn { display: flex; align-items: center; gap: 10px; background: transparent; border: none; color: var(--text-main); cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: var(--transition); }
        .user-btn:hover { background: var(--bg-glass); }
        .avatar { width: 32px; height: 32px; background: var(--primary); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; }
        .chevron-icon { transition: transform 0.2s ease; color: var(--text-dim); }
        .rotate-180 { transform: rotate(180deg); }

        .dropdown-backdrop { position: fixed; inset: 0; z-index: 998; }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 280px;
          background: var(--bg-card);
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          padding: 8px;
          z-index: 999;
          box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px var(--border-glass);
          backdrop-filter: blur(20px);
        }

        .dd-user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background: var(--bg-glass);
          margin-bottom: 4px;
        }
        .dd-avatar {
          width: 40px; height: 40px;
          background: var(--primary); color: #000;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1rem;
          flex-shrink: 0;
        }
        .dd-user-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .dd-email {
          font-size: 0.8rem; font-weight: 700; color: var(--text-main);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .dd-role {
          font-size: 0.6rem; font-weight: 800; color: var(--primary);
          text-transform: uppercase; letter-spacing: 1px;
        }

        .dd-divider { height: 1px; background: var(--border-glass); margin: 4px 0; }

        .dd-item {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 10px 12px;
          background: transparent; border: none;
          color: var(--text-muted); cursor: pointer;
          font-family: var(--font-mono); font-size: 0.8rem; font-weight: 600;
          border-radius: 8px; transition: var(--transition);
          text-align: left;
        }
        .dd-item:hover { 
          background: var(--primary-glow); 
          color: var(--primary);
          transform: translateX(4px);
        }
        .dd-item svg { transition: transform 0.2s ease; }
        .dd-item:hover svg { transform: scale(1.1); }

        .dd-badge {
          margin-left: auto;
          background: var(--danger); color: white;
          font-size: 0.6rem; font-weight: 800;
          padding: 2px 6px; border-radius: 10px;
          min-width: 18px; text-align: center;
        }
        .dd-lang-tag {
          margin-left: auto;
          background: var(--bg-glass); border: 1px solid var(--border-glass);
          font-size: 0.6rem; font-weight: 800;
          padding: 2px 8px; border-radius: 4px;
          color: var(--text-dim);
        }

        .dd-danger { color: var(--danger); }
        .dd-danger:hover { background: rgba(255,0,60,0.08); color: var(--danger); }
        .dd-danger:hover svg { color: var(--danger); }

        /* Mobile Dropdown */
        .mobile-dropdown {
          position: fixed;
          top: var(--header-height);
          left: 0;
          right: 0;
          max-height: calc(100vh - var(--header-height));
          background: var(--bg-card);
          z-index: 999;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border-bottom: 1px solid var(--border-glass);
        }

        .mobile-user-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-glass);
          border-radius: 12px;
          border: 1px solid var(--border-glass);
        }

        .avatar.large { width: 48px; height: 48px; font-size: 1.2rem; }
        .user-info { display: flex; flex-direction: column; gap: 4px; }
        .user-email { font-size: 0.9rem; font-weight: 700; color: var(--text-main); }
        .user-role-badge { font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; }

        .section-label { font-size: 0.65rem; font-weight: 800; color: var(--text-dim); letter-spacing: 2px; margin-bottom: 12px; text-transform: uppercase; }

        .mobile-nav-list { display: flex; flex-direction: column; gap: 4px; }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: 8px;
          transition: var(--transition);
        }
        .mobile-nav-item.active { background: var(--primary-glow); color: var(--primary); }
        .mobile-nav-item:hover { background: var(--bg-glass); color: var(--primary); }
        
        .icon-box {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
        }

        .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .action-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: 12px;
          color: var(--text-main);
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
        }
        .action-tile.danger { color: var(--danger); }

        .mobile-menu-btn { display: none; background: transparent; border: none; color: var(--text-main); cursor: pointer; border-radius: 4px; padding: 4px; transition: var(--transition); }
        .mobile-menu-btn:hover { background: var(--bg-glass); color: var(--primary); }
        .mobile-menu-btn.active { color: var(--primary); background: var(--primary-glow); }

        @media (max-width: 1200px) {
          .nav-scroll-container { display: none; }
          .mobile-menu-btn { display: block; }
          .hide-mobile, .hide-tablet { display: none; }
        }
        @media (max-width: 1400px) {
          .hide-tablet { display: none; }
        }
      `}</style>
    </header>
  );
};
