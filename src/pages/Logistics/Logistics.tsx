import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  FileText, 
  CheckSquare, 
  Clock, 
  MapPin, 
  Search,
  ChevronRight,
  Plus,
  AlertCircle
} from 'lucide-react';

export const Logistics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RECEIVING' | 'TRANSFERS' | 'POs'>('RECEIVING');

  return (
    <div className="logistics-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Logistics Center</h1>
          <p className="text-muted">End-to-end supply chain and inventory movement</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <Plus size={18} />
            Create Transfer
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'RECEIVING' ? 'active' : ''}`}
            onClick={() => setActiveTab('RECEIVING')}
          >
            <Package size={18} />
            Receiving
          </button>
          <button 
            className={`tab ${activeTab === 'TRANSFERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('TRANSFERS')}
          >
            <Truck size={18} />
            Transfers
          </button>
          <button 
            className={`tab ${activeTab === 'POs' ? 'active' : ''}`}
            onClick={() => setActiveTab('POs')}
          >
            <FileText size={18} />
            Purchase Orders
          </button>
        </div>
      </div>

      <div className="logistics-content">
        {activeTab === 'RECEIVING' && (
          <div className="receiving-view animate-fade-in">
            <div className="section-grid">
              <div className="delivery-queue glass">
                <div className="section-header">
                  <h3>Expected Today (3)</h3>
                  <span className="date">Dec 18, 2026</span>
                </div>
                <div className="delivery-list">
                  <div className="delivery-item active">
                    <div className="delivery-time">10:30 AM</div>
                    <div className="delivery-info">
                      <div className="vendor">Dairy Vendors Co.</div>
                      <div className="po-ref">PO-2026-001</div>
                      <div className="driver">Driver: John Wick</div>
                    </div>
                    <button className="receive-btn">Receive Now</button>
                  </div>

                  <div className="delivery-item">
                    <div className="delivery-time">02:00 PM</div>
                    <div className="delivery-info">
                      <div className="vendor">Produce Direct</div>
                      <div className="po-ref">PO-2026-002</div>
                      <div className="driver">Driver: Maria S.</div>
                    </div>
                    <span className="status-label">Pending</span>
                  </div>

                  <div className="delivery-item">
                    <div className="delivery-time">04:30 PM</div>
                    <div className="delivery-info">
                      <div className="vendor">Bakery Logistics</div>
                      <div className="po-ref">PO-2026-003</div>
                      <div className="driver">Driver: Robert D.</div>
                    </div>
                    <span className="status-label">Pending</span>
                  </div>
                </div>
              </div>

              <div className="fefo-score-card glass">
                <h3>FEFO Compliance</h3>
                <div className="compliance-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart primary">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">88%</text>
                  </svg>
                </div>
                <div className="compliance-details">
                  <p className="warning-text">
                    <AlertCircle size={14} />
                    Dairy cooler needs rotation check
                  </p>
                  <button className="btn-secondary small">View Violations</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TRANSFERS' && (
          <div className="transfers-view animate-fade-in">
            <div className="active-transfers">
              <h3>Active Transfers</h3>
              <div className="transfer-card glass">
                <div className="transfer-header">
                  <div className="transfer-id">TR-2026-123</div>
                  <div className="transfer-status in-transit">IN TRANSIT</div>
                </div>
                <div className="transfer-route">
                  <div className="route-node">
                    <span className="node-label">From</span>
                    <span className="node-name">Downtown Branch</span>
                  </div>
                  <div className="route-line">
                    <Truck size={16} />
                  </div>
                  <div className="route-node">
                    <span className="node-label">To</span>
                    <span className="node-name">Uptown Branch</span>
                  </div>
                </div>
                <div className="transfer-details">
                  <div className="detail-item">
                    <span className="label">Product</span>
                    <span className="value">Organic Milk 2% (50 units)</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">ETA</span>
                    <span className="value">2h 15m</span>
                  </div>
                </div>
                <div className="transfer-actions">
                  <button className="btn-secondary small">Track</button>
                  <button className="btn-primary small">Mark Delivered</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'POs' && (
          <div className="pos-view animate-fade-in">
             <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
                <p className="text-muted">Purchase Order Management interface is being initialized.</p>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .logistics-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tabs-container {
          border-bottom: 1px solid var(--border-glass);
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

        .section-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .delivery-queue, .fefo-score-card, .transfer-card {
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .delivery-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .delivery-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px;
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-glass);
        }

        .delivery-item.active {
          border-color: var(--primary);
          background: var(--primary-glow);
        }

        .delivery-time {
          font-family: monospace;
          font-weight: 700;
          color: var(--primary);
          width: 80px;
        }

        .delivery-info {
          flex: 1;
        }

        .vendor { font-weight: 600; font-size: 1rem; }
        .po-ref { font-size: 0.75rem; color: var(--text-dim); }
        .driver { font-size: 0.75rem; color: var(--text-muted); }

        .receive-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }

        .status-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 600;
        }

        .circular-chart {
          display: block;
          margin: 20px auto;
          max-width: 150px;
          max-height: 250px;
        }

        .circle-bg {
          fill: none;
          stroke: var(--border-glass);
          stroke-width: 3.8;
        }

        .circle {
          fill: none;
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke: var(--primary);
        }

        .percentage {
          fill: white;
          font-family: 'Outfit', sans-serif;
          font-size: 0.5rem;
          text-anchor: middle;
          font-weight: 700;
        }

        .compliance-details {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .warning-text {
          font-size: 0.8rem;
          color: var(--warning);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .transfer-card {
          border: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .transfer-header {
          display: flex;
          justify-content: space-between;
        }

        .transfer-id { font-family: monospace; font-weight: 700; }
        .transfer-status {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .in-transit { background: var(--secondary); color: white; }

        .transfer-route {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
        }

        .route-node {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .node-label { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; }
        .node-name { font-weight: 600; }

        .route-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(to right, var(--primary), var(--secondary));
          margin: 0 20px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .transfer-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 16px;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-item .label { font-size: 0.7rem; color: var(--text-dim); }
        .detail-item .value { font-weight: 600; }

        .transfer-actions {
          display: flex;
          gap: 12px;
        }

        .transfer-actions button { flex: 1; }
      `}</style>
    </div>
  );
};
