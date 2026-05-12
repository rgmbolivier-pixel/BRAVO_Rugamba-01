import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MoreVertical,
  Star,
  UserPlus,
  Filter,
  Clock
} from 'lucide-react';

export const Directory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'VENDORS'>('USERS');

  return (
    <div className="directory-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Entity Directory</h1>
          <p className="text-muted">Manage staff accounts and vendor partnerships</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            {activeTab === 'USERS' ? <UserPlus size={18} /> : <Plus size={18} />}
            {activeTab === 'USERS' ? 'Invite User' : 'Add Vendor'}
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'USERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('USERS')}
          >
            <Users size={18} />
            Staff & Users
          </button>
          <button 
            className={`tab ${activeTab === 'VENDORS' ? 'active' : ''}`}
            onClick={() => setActiveTab('VENDORS')}
          >
            <Building2 size={18} />
            Vendor Directory
          </button>
        </div>
      </div>

      <div className="directory-content">
        <div className="table-controls">
          <div className="search-box glass">
            <Search size={18} />
            <input type="text" placeholder="Search directory..." />
          </div>
          <button className="filter-btn glass">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {activeTab === 'USERS' ? (
          <div className="users-table glass">
            <table className="dir-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', email: 'john@testos.ai', role: 'Admin', branch: 'All', status: 'Active' },
                  { name: 'Jane Smith', email: 'jane@testos.ai', role: 'Manager', branch: 'Downtown', status: 'Active' },
                  { name: 'Mike Rivera', email: 'mike@testos.ai', role: 'Manager', branch: 'Uptown', status: 'Offline' },
                ].map(user => (
                  <tr key={user.email}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar small">{user.name.charAt(0)}</div>
                        <div className="info">
                          <span className="name">{user.name}</span>
                          <span className="email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td>{user.branch}</td>
                    <td>
                      <span className={`status-dot ${user.status.toLowerCase()}`}></span>
                      {user.status}
                    </td>
                    <td className="text-dim">2h ago</td>
                    <td><button className="icon-btn"><MoreVertical size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="vendors-grid">
            {[
              { name: 'Dairy Vendors Co.', cat: 'Dairy', contact: 'John Wick', score: 94, lead: '2 days' },
              { name: 'Produce Direct', cat: 'Produce', contact: 'Maria S.', score: 88, lead: '1 day' },
              { name: 'Bakery Logistics', cat: 'Bakery', contact: 'Robert D.', score: 91, lead: '3 days' },
            ].map(vendor => (
              <div key={vendor.name} className="vendor-card glass">
                <div className="vendor-header">
                  <div className="vendor-icon"><Building2 size={24} /></div>
                  <div className="vendor-score">
                    <Star size={14} className="star" />
                    <span>{vendor.score}%</span>
                  </div>
                </div>
                <div className="vendor-body">
                  <h3>{vendor.name}</h3>
                  <span className="category">{vendor.cat}</span>
                  <div className="vendor-meta">
                    <div className="meta-item"><Mail size={14} /> {vendor.contact}</div>
                    <div className="meta-item"><Clock size={14} /> {vendor.lead} lead time</div>
                  </div>
                </div>
                <div className="vendor-actions">
                  <button className="btn-secondary small">View Contracts</button>
                  <button className="btn-text">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .directory-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tabs-container { border-bottom: 1px solid var(--border-glass); }
        .tabs { display: flex; gap: 32px; }
        .tab {
          background: transparent;
          border: none;
          color: var(--text-dim);
          padding: 12px 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          transition: var(--transition);
        }
        .tab.active { color: var(--primary); }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .table-controls { display: flex; gap: 12px; margin-bottom: 24px; }
        .search-box { flex: 1; display: flex; align-items: center; gap: 12px; padding: 10px 20px; border-radius: 100px; }
        .search-box input { background: transparent; border: none; color: var(--text-main); outline: none; width: 100%; }

        .users-table { border-radius: var(--radius-lg); overflow: hidden; }
        .dir-table { width: 100%; border-collapse: collapse; }
        .dir-table th { text-align: left; padding: 16px; color: var(--text-dim); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border-glass); background: rgba(255,255,255,0.01); }
        .dir-table td { padding: 16px; border-bottom: 1px solid var(--border-glass); font-size: 0.9rem; }

        .user-cell { display: flex; align-items: center; gap: 12px; }
        .avatar.small { width: 32px; height: 32px; border-radius: 50%; background: var(--primary-glow); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; }
        .info { display: flex; flex-direction: column; }
        .info .name { font-weight: 600; }
        .info .email { font-size: 0.75rem; color: var(--text-dim); }

        .role-badge { font-size: 0.75rem; font-weight: 700; background: var(--bg-glass); padding: 4px 10px; border-radius: 4px; }

        .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; }
        .status-dot.active { background: var(--success); box-shadow: 0 0 8px var(--success); }
        .status-dot.offline { background: var(--text-dim); }

        .vendors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .vendor-card { padding: 24px; border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 16px; }
        .vendor-header { display: flex; justify-content: space-between; align-items: center; }
        .vendor-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--bg-glass); display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .vendor-score { display: flex; align-items: center; gap: 4px; color: var(--warning); font-weight: 700; font-size: 0.9rem; }

        .vendor-body h3 { font-size: 1.25rem; }
        .vendor-body .category { font-size: 0.7rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700; }
        .vendor-meta { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
        .meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); }

        .vendor-actions { display: flex; gap: 12px; margin-top: 8px; border-top: 1px solid var(--border-glass); pt: 16px; }
        .btn-text { background: transparent; border: none; color: var(--text-dim); font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
};
