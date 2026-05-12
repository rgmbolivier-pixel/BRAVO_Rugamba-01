import React, { useState } from 'react';
import { 
  AlertCircle, 
  BrainCircuit, 
  Clock, 
  CheckCircle2, 
  Tag, 
  Truck, 
  Heart, 
  X,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';

interface Alert {
  id: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  product: string;
  category: string;
  branch: string;
  expiry: string;
  units: number;
  estLoss: number;
  aiConfidence: number;
  aiReason: string;
}

const initialAlerts: Alert[] = [
  {
    id: 'AL-001',
    level: 'CRITICAL',
    product: 'Organic Milk 2%',
    category: 'Dairy',
    branch: 'Downtown',
    expiry: '18h',
    units: 45,
    estLoss: 135,
    aiConfidence: 92,
    aiReason: 'High demand drop predicted for this batch location.'
  },
  {
    id: 'AL-002',
    level: 'HIGH',
    product: 'Sourdough Bread',
    category: 'Bakery',
    branch: 'Uptown',
    expiry: '2d',
    units: 28,
    estLoss: 42,
    aiConfidence: 88,
    aiReason: 'Overstocked relative to historical weekend velocity.'
  },
  {
    id: 'AL-003',
    level: 'MEDIUM',
    product: 'Avocados Hass',
    category: 'Produce',
    branch: 'Westside',
    expiry: '3d',
    units: 120,
    estLoss: 180,
    aiConfidence: 75,
    aiReason: 'Quality degradation alert based on storage temperature flux.'
  }
];

export const Operations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'RECOMMENDATIONS' | 'HISTORY'>('ALERTS');
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  return (
    <div className="operations-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Operations Center</h1>
          <p className="text-muted">Unified workflow from detection to resolution</p>
        </div>
        <div className="header-search">
          <div className="search-box glass">
            <Search size={18} />
            <input type="text" placeholder="Search alerts or products..." />
          </div>
          <button className="filter-btn glass">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'ALERTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALERTS')}
          >
            <AlertCircle size={18} />
            Active Alerts
            <span className="count">{alerts.length}</span>
          </button>
          <button 
            className={`tab ${activeTab === 'RECOMMENDATIONS' ? 'active' : ''}`}
            onClick={() => setActiveTab('RECOMMENDATIONS')}
          >
            <BrainCircuit size={18} />
            AI Recommendations
          </button>
          <button 
            className={`tab ${activeTab === 'HISTORY' ? 'active' : ''}`}
            onClick={() => setActiveTab('HISTORY')}
          >
            <Clock size={18} />
            Resolution History
          </button>
        </div>
      </div>

      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card glass ${alert.level.toLowerCase()}`}>
            <div className="alert-badge-container">
              <span className={`alert-level-badge ${alert.level.toLowerCase()}`}>
                {alert.level}
              </span>
              <span className="alert-id">#{alert.id}</span>
            </div>

            <div className="alert-main-content">
              <div className="product-info">
                <h3>{alert.product}</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Branch</span>
                    <span className="value">{alert.branch}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Units</span>
                    <span className="value">{alert.units}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Est. Loss</span>
                    <span className="value danger">${alert.estLoss}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Expires In</span>
                    <span className="value warning">{alert.expiry}</span>
                  </div>
                </div>
              </div>

              <div className="ai-box glass">
                <div className="ai-header">
                  <div className="ai-title">
                    <BrainCircuit size={16} color="var(--primary)" />
                    <span>AI INSIGHT</span>
                  </div>
                  <span className="ai-confidence">{alert.aiConfidence}% confidence</span>
                </div>
                <p className="ai-reason">{alert.aiReason}</p>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn discount">
                <Tag size={16} />
                <span>30% Discount</span>
              </button>
              <button className="action-btn transfer">
                <Truck size={16} />
                <span>Transfer</span>
              </button>
              <button className="action-btn donate">
                <Heart size={16} />
                <span>Donate</span>
              </button>
              <button className="action-btn dismiss">
                <X size={16} />
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .operations-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-search {
          display: flex;
          gap: 12px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 100px;
          width: 300px;
        }

        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-main);
          outline: none;
          width: 100%;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
        }

        .tabs-container {
          border-bottom: 1px solid var(--border-glass);
          margin-bottom: 8px;
        }

        .tabs {
          display: flex;
          gap: 32px;
        }

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

        .tab:hover {
          color: var(--text-main);
        }

        .tab.active {
          color: var(--primary);
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary-glow);
        }

        .count {
          background: var(--primary-glow);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .alert-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: var(--transition);
          border-left: 4px solid transparent;
        }

        .alert-card.critical { border-left-color: var(--danger); }
        .alert-card.high { border-left-color: var(--warning); }
        .alert-card.medium { border-left-color: var(--secondary); }

        .alert-card:hover {
          transform: translateX(8px);
          background: rgba(255, 255, 255, 0.05);
        }

        .alert-badge-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .alert-level-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 100px;
          letter-spacing: 0.5px;
        }

        .alert-level-badge.critical { background: var(--danger-glow); color: var(--danger); border: 1px solid var(--danger); }
        .alert-level-badge.high { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid var(--warning); }
        .alert-level-badge.medium { background: rgba(14, 165, 233, 0.1); color: var(--secondary); border: 1px solid var(--secondary); }

        .alert-id {
          color: var(--text-dim);
          font-family: monospace;
          font-size: 0.8rem;
        }

        .alert-main-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .product-info h3 {
          font-size: 1.25rem;
          margin-bottom: 16px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-item .label {
          font-size: 0.7rem;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 700;
        }

        .info-item .value {
          font-size: 1rem;
          font-weight: 600;
        }

        .info-item .value.danger { color: var(--danger); }
        .info-item .value.warning { color: var(--warning); }

        .ai-box {
          padding: 16px;
          border-radius: var(--radius-md);
          background: rgba(99, 102, 241, 0.03);
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .ai-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .ai-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--primary);
        }

        .ai-confidence {
          font-size: 0.7rem;
          color: var(--success);
          font-weight: 600;
        }

        .ai-reason {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-glass);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          background: var(--bg-glass);
          color: var(--text-main);
          border: 1px solid var(--border-glass);
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .action-btn.discount:hover { border-color: var(--primary); color: var(--primary); }
        .action-btn.transfer:hover { border-color: var(--secondary); color: var(--secondary); }
        .action-btn.donate:hover { border-color: var(--success); color: var(--success); }
        .action-btn.dismiss:hover { border-color: var(--danger); color: var(--danger); }
      `}</style>
    </div>
  );
};
