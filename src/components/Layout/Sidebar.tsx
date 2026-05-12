import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Building, Users as UsersIcon, Truck, 
  FileText, CreditCard, LayoutDashboard, Package, 
  AlertTriangle, ArrowRightLeft, Clock, Trash2, 
  Download, CheckSquare, Settings as SettingsIcon,
  LogOut, Terminal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Define navigation items per role
  const getNavItems = () => {
    const items = [];

    // Staff items
    if (user.role === 'STAFF') {
      items.push({ path: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' });
      items.push({ path: '/my-shift', icon: Clock, label: 'MY SHIFT' });
      items.push({ path: '/tasks', icon: CheckSquare, label: 'TASKS' });
      items.push({ path: '/waste-log', icon: Trash2, label: 'WASTE LOG' });
      items.push({ path: '/receiving', icon: Download, label: 'RECEIVING' });
      items.push({ path: '/inventory', icon: Package, label: 'INVENTORY' });
      items.push({ path: '/alerts', icon: AlertTriangle, label: 'ALERTS' });
    }

    // Manager items
    if (user.role === 'MANAGER') {
      items.push({ path: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' });
      items.push({ path: '/inventory', icon: Package, label: 'INVENTORY' });
      items.push({ path: '/alerts', icon: AlertTriangle, label: 'ALERTS' });
      items.push({ path: '/transfers', icon: ArrowRightLeft, label: 'TRANSFERS' });
      items.push({ path: '/waste-log', icon: Trash2, label: 'WASTE LOG' });
      items.push({ path: '/receiving', icon: Download, label: 'RECEIVING' });
      items.push({ path: '/tasks', icon: CheckSquare, label: 'TASKS' });
      items.push({ path: '/purchase-orders', icon: FileText, label: 'PURCHASE ORDERS' });
    }

    // Admin items
    if (user.role === 'ADMIN') {
      items.push({ path: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' });
      items.push({ path: '/analytics', icon: BarChart3, label: 'ANALYTICS' });
      items.push({ path: '/branches', icon: Building, label: 'BRANCHES' });
      items.push({ path: '/users', icon: UsersIcon, label: 'USERS' });
      items.push({ path: '/vendors', icon: Truck, label: 'VENDORS' });
      items.push({ path: '/purchase-orders', icon: FileText, label: 'PURCHASE ORDERS' });
      items.push({ path: '/invoicing', icon: CreditCard, label: 'INVOICING' });
      
      // Admin also gets Manager tools
      items.push({ path: '/inventory', icon: Package, label: 'INVENTORY' });
      items.push({ path: '/alerts', icon: AlertTriangle, label: 'ALERTS' });
      items.push({ path: '/transfers', icon: ArrowRightLeft, label: 'TRANSFERS' });
      items.push({ path: '/waste-log', icon: Trash2, label: 'WASTE LOG' });
      items.push({ path: '/receiving', icon: Download, label: 'RECEIVING' });
      
      items.push({ path: '/settings', icon: SettingsIcon, label: 'SETTINGS' });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <aside className="sidebar terminal-ui">
      <div className="sidebar-header">
        <div className="logo-container">
          <Terminal size={24} className="logo-icon" />
          <div className="logo-text-group">
            <span className="logo-text">_BRAVO_OS</span>
            <span className="logo-tagline">RETAIL.OPERATING.SYSTEM v1.0</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} className="nav-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="operator-info">
          <span className="op-label">{user.role} OPERATOR</span>
          <span className="op-email">{user.email}</span>
          <div className="op-status">
            <span className="status-tag">{user.role}</span>
            {user.branch && <span className="status-tag branch-tag" style={{marginLeft: '4px', background: 'var(--primary-glow-secondary)', borderColor: 'var(--primary-secondary)', color: 'var(--text-bright)'}}>{user.branch}</span>}
          </div>
        </div>
        <button className="exit-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>EXIT</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          background: #000;
          border-right: 1px solid var(--border-glass);
          z-index: 100;
          font-family: var(--font-mono);
          overflow-y: auto;
        }

        .sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 4px;
        }

        .sidebar-header {
          margin-bottom: 40px;
          padding: 0 10px;
          flex-shrink: 0;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          color: var(--primary);
        }

        .logo-text-group {
          display: flex;
          flex-direction: column;
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 2px;
        }

        .logo-tagline {
          font-size: 0.55rem;
          color: var(--text-dim);
          letter-spacing: 1px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 600;
          transition: var(--transition);
          border-left: 2px solid transparent;
        }

        .nav-link:hover {
          color: var(--primary);
          background: rgba(0, 255, 65, 0.05);
        }

        .nav-link.active {
          color: var(--primary);
          background: rgba(0, 255, 65, 0.1);
          border-left: 2px solid var(--primary);
        }

        .nav-icon {
          opacity: 0.7;
        }

        .nav-link.active .nav-icon {
          opacity: 1;
        }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex-shrink: 0;
        }

        .operator-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 0 10px;
        }

        .op-label {
          font-size: 0.6rem;
          color: var(--text-dim);
          font-weight: 800;
        }

        .op-email {
          font-size: 0.65rem;
          color: var(--text-muted);
        }

        .op-status {
          margin-top: 8px;
        }

        .status-tag {
          font-size: 0.6rem;
          background: var(--primary-glow);
          color: var(--primary);
          padding: 2px 6px;
          border: 1px solid var(--primary);
          font-weight: 800;
        }
        
        .branch-tag {
          font-size: 0.55rem;
        }

        .exit-btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 800;
          transition: var(--transition);
          padding: 0 10px;
        }

        .exit-btn:hover {
          color: var(--primary);
        }
      `}</style>
    </aside>
  );
};
