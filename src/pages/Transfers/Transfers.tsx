import React, { useState } from 'react';
import { Truck, ArrowRightLeft, MapPin, CheckCircle, Navigation, Zap, Package, Clock, Send, X, History, Plus, FileText, Download } from 'lucide-react';
import './Transfers.css';

type TransferView = 'OUTGOING' | 'INCOMING' | 'HISTORY' | 'REQUEST';

interface Transfer {
  id: string;
  to?: string;
  from?: string;
  product: string;
  quantity: number;
  batch: string;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'PENDING' | 'RECEIVED' | 'APPROVED';
  reason: string;
  driver?: string;
  eta?: string;
  deliveredAt?: string;
  receivedAt?: string;
  receivedBy?: string;
  stockLocation?: string;
  expiry?: string;
  value?: number;
}

export const Transfers: React.FC = () => {
  const [view, setView] = useState<TransferView>('OUTGOING');

  const outgoingTransfers: Transfer[] = [
    {
      id: '1', to: 'Uptown Store', product: '2% Milk', quantity: 45, batch: 'L2401',
      status: 'DELIVERED', reason: 'Preventing waste — expires today',
      deliveredAt: 'Dec 18, 11:30 AM',
      value: 112.50
    },
    {
      id: '2', to: 'Northside Store', product: 'Cheddar Cheese', quantity: 23, batch: 'C2392',
      status: 'IN_TRANSIT', reason: 'Surplus stock, Northside has demand',
      driver: 'John',
      eta: '1 hour',
      value: 57.50
    }
  ];

  const incomingTransfers: Transfer[] = [
    {
      id: '3',
      from: 'Westside Store',
      product: 'Eggs',
      quantity: 60,
      batch: 'E2405',
      status: 'RECEIVED',
      reason: 'Stock balance',
      receivedAt: 'Dec 18, 9:15 AM',
      receivedBy: 'Sarah Lee',
      stockLocation: 'Cooler B',
      expiry: 'Dec 25, 2024'
    },
    {
      id: '4',
      from: 'Uptown Store',
      product: 'Sourdough Bread',
      quantity: 30,
      batch: 'B2415',
      status: 'PENDING',
      reason: 'Surplus transfer',
      eta: 'Dec 18, 2:00 PM'
    }
  ];

  const aiRecommendations = [
    {
      product: 'Sourdough Bread',
      quantity: 45,
      expiry: 'Dec 19',
      toBranch: 'Uptown',
      needed: 30,
      reason: 'out of stock',
      wasteSavings: 45,
      salesSavings: 60,
      totalValue: 105
    },
    {
      product: 'Cheddar Cheese',
      quantity: 23,
      expiry: 'Dec 20',
      toBranch: 'Northside',
      needed: 20,
      reason: 'high demand',
      wasteSavings: 100,
      salesSavings: 80,
      totalValue: 180
    }
  ];

  const historyItems = [
    { date: 'Dec 15', desc: 'Sent 50u Milk → Uptown', status: 'Completed', saved: '$125', dir: 'out' },
    { date: 'Dec 12', desc: 'Recv 30u Eggs ← Northside', status: 'Completed', saved: 'In stock', dir: 'in' },
    { date: 'Dec 10', desc: 'Sent 25u Bread → Westside', status: 'Completed', saved: '$37', dir: 'out' },
    { date: 'Dec 8',  desc: 'Sent 18u Cheese → Eastside', status: 'Completed', saved: '$54', dir: 'out' },
    { date: 'Dec 5',  desc: 'Recv 40u Milk ← Uptown', status: 'Completed', saved: 'In stock', dir: 'in' },
  ];

  const tabs: { key: TransferView; label: string; icon: string }[] = [
    { key: 'OUTGOING', label: 'OUTGOING', icon: '📤' },
    { key: 'INCOMING', label: 'INCOMING', icon: '📥' },
    { key: 'HISTORY',  label: 'HISTORY',  icon: '✅' },
    { key: 'REQUEST',  label: 'REQUEST',  icon: '📝' },
  ];

  return (
    <div className="transfers-container page-container terminal-ui">
      {/* Header */}
      <header className="page-header glow-panel mb-4">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">BRANCH</span>
            <span className="stat-value text-bright">DOWNTOWN STORE</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">OUTGOING</span>
            <span className="stat-value text-primary">{outgoingTransfers.length}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">INCOMING</span>
            <span className="stat-value text-success">{incomingTransfers.length}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">SAVED THIS MONTH</span>
            <span className="stat-value text-primary">$1,240</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="transfer-tabs mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            className={`tab-btn ${view === t.key ? 'active' : ''}`}
            onClick={() => setView(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="main-grid">
        {/* Main Panel */}
        <div className="panel col-span-2">

          {/* OUTGOING */}
          {view === 'OUTGOING' && (
            <>
              <div className="panel-header">
                <h2>📤 OUTGOING TRANSFERS</h2>
                <span className="text-dim text-xs">What you have sent to other branches</span>
              </div>
              <div className="transfer-list">
                {outgoingTransfers.map((transfer) => (
                  <div key={transfer.id} className={`transfer-card ${transfer.status === 'DELIVERED' ? 'border-success' : 'border-primary'}`}>
                    <div className="transfer-route">
                      <div className="route-point">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-primary font-bold">Downtown</span>
                      </div>
                      <div className="route-arrow">
                        <div className="route-line-track"></div>
                        <Send size={14} className="text-primary" />
                        <div className="route-line-track"></div>
                      </div>
                      <div className="route-point">
                        <MapPin size={14} className="text-muted" />
                        <span>{transfer.to}</span>
                      </div>
                    </div>
                    <div className="transfer-details">
                      <div className="transfer-product-row">
                        <div>
                          <span className="transfer-product-name">{transfer.product}</span>
                          <span className="transfer-qty"> ({transfer.quantity} units)</span>
                        </div>
                        <span className="badge badge-warning font-mono">Batch: {transfer.batch}</span>
                      </div>
                      <div className="text-muted text-xs mb-2">Reason: {transfer.reason}</div>
                      <div className="transfer-status-row">
                        {transfer.status === 'DELIVERED' ? (
                          <span className="status-delivered">
                            <CheckCircle size={14} /> DELIVERED at {transfer.deliveredAt}
                          </span>
                        ) : (
                          <span className="status-transit">
                            <Truck size={14} /> IN TRANSIT — Driver: {transfer.driver} | ETA: {transfer.eta}
                          </span>
                        )}
                        {transfer.value && (
                          <span className="text-primary text-xs font-bold">
                            Value: ${transfer.value.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="transfer-actions">
                      <button type="button" className="btn-secondary small">
                        <FileText size={13} /> VIEW DETAILS
                      </button>
                      <button type="button" className="btn-secondary small">
                        <Download size={13} /> PRINT SLIP
                      </button>
                      {transfer.status === 'IN_TRANSIT' && (
                        <button type="button" className="btn-secondary small">
                          <Navigation size={13} /> TRACK DELIVERY
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* INCOMING */}
          {view === 'INCOMING' && (
            <>
              <div className="panel-header">
                <h2>📥 INCOMING TRANSFERS</h2>
                <span className="text-dim text-xs">What you have received from other branches</span>
              </div>
              <div className="transfer-list">
                {incomingTransfers.map((transfer) => (
                  <div key={transfer.id} className={`transfer-card ${transfer.status === 'RECEIVED' ? 'border-success' : 'border-warning'}`}>
                    <div className="transfer-route">
                      <div className="route-point">
                        <MapPin size={14} className="text-muted" />
                        <span>{transfer.from}</span>
                      </div>
                      <div className="route-arrow">
                        <div className="route-line-track"></div>
                        <ArrowRightLeft size={14} className="text-primary" />
                        <div className="route-line-track"></div>
                      </div>
                      <div className="route-point">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-primary font-bold">Downtown</span>
                      </div>
                    </div>
                    <div className="transfer-details">
                      <div className="transfer-product-row">
                        <div>
                          <span className="transfer-product-name">{transfer.product}</span>
                          <span className="transfer-qty"> ({transfer.quantity} units)</span>
                        </div>
                        <span className="badge badge-success font-mono">Batch: {transfer.batch}</span>
                      </div>
                      <div className="transfer-status-row">
                        {transfer.status === 'RECEIVED' ? (
                          <span className="status-delivered">
                            <CheckCircle size={14} /> RECEIVED at {transfer.receivedAt}
                          </span>
                        ) : (
                          <span className="status-pending">
                            <Clock size={14} /> PENDING RECEIPT — Expected: {transfer.eta}
                          </span>
                        )}
                      </div>
                      {transfer.status === 'RECEIVED' && (
                        <div className="transfer-meta-row">
                          <span><span className="text-dim">Received by:</span> {transfer.receivedBy}</span>
                          <span><span className="text-dim">Location:</span> {transfer.stockLocation}</span>
                          <span><span className="text-dim">Expiry:</span> {transfer.expiry}</span>
                        </div>
                      )}
                    </div>
                    <div className="transfer-actions">
                      <button type="button" className="btn-secondary small">
                        <FileText size={13} /> VIEW DETAILS
                      </button>
                      {transfer.status === 'PENDING' && (
                        <button type="button" className="btn-primary small">
                          <CheckCircle size={13} /> CONFIRM RECEIPT
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* HISTORY */}
          {view === 'HISTORY' && (
            <>
              <div className="panel-header">
                <h2>✅ TRANSFER HISTORY</h2>
                <button className="btn-small"><Download size={13} /> EXPORT</button>
              </div>
              <div className="history-table-wrap">
                <table className="terminal-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Direction</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Value / Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyItems.map((h, i) => (
                      <tr key={i}>
                        <td className="text-dim">{h.date}</td>
                        <td>
                          <span className={h.dir === 'out' ? 'text-primary' : 'text-success'}>
                            {h.dir === 'out' ? '📤 OUT' : '📥 IN'}
                          </span>
                        </td>
                        <td className="text-main">{h.desc}</td>
                        <td><span className="badge badge-success">{h.status}</span></td>
                        <td className="text-primary font-bold">{h.saved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="history-footer">
                <span className="text-primary font-bold">Total waste prevented by transfers this month: $1,240</span>
              </div>
            </>
          )}

          {/* REQUEST */}
          {view === 'REQUEST' && (
            <>
              <div className="panel-header">
                <h2>📝 REQUEST NEW TRANSFER</h2>
              </div>
              <form
                className="transfer-form"
                onSubmit={(e) => { e.preventDefault(); setView('OUTGOING'); }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product to send</label>
                    <select className="terminal-select w-full" defaultValue="milk">
                      <option value="milk">2% Milk</option>
                      <option value="cheese">Cheddar Cheese</option>
                      <option value="bread">Sourdough Bread</option>
                      <option value="eggs">Eggs</option>
                    </select>
                    <div className="form-hint">Available: 45 units (Batch L2401 — Expires TODAY)</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity to transfer</label>
                    <input type="number" className="terminal-input w-full" min={1} defaultValue={30} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">To Branch</label>
                    <select className="terminal-select w-full" defaultValue="uptown">
                      <option value="uptown">Uptown Store</option>
                      <option value="northside">Northside Store</option>
                      <option value="westside">Westside Store</option>
                      <option value="eastside">Eastside Store</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="terminal-select w-full">
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <textarea className="terminal-input w-full" rows={3} defaultValue="Preventing waste - expires today" />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary">
                    <Send size={14} /> REQUEST TRANSFER
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setView('OUTGOING')}>
                    <X size={14} /> CANCEL
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* AI Recommendations */}
          <div className="panel mb-4 ai-panel">
            <div className="panel-header border-none mb-0">
              <h2 className="text-primary flex items-center gap-2">
                <Zap size={16} /> AI RECOMMENDED
              </h2>
            </div>
            <p className="text-muted text-xs mb-3">Your store has surplus that could help other stores:</p>
            {aiRecommendations.map((rec, idx) => (
              <div key={idx} className="ai-rec-card">
                <div className="ai-rec-product">
                  <Package size={13} className="text-primary" />
                  <span className="font-bold">{rec.product}</span>
                  <span className="text-dim text-xs">({rec.quantity}u exp. {rec.expiry})</span>
                </div>
                <div className="ai-rec-need">
                  → {rec.toBranch} NEEDS {rec.needed} units ({rec.reason})
                </div>
                <div className="ai-rec-value">
                  <Zap size={12} /> Save ${rec.wasteSavings} waste + ${rec.salesSavings} sales = <strong>${rec.totalValue}</strong>
                </div>
                <button
                  type="button"
                  className="btn-primary small w-full mt-2"
                  onClick={() => setView('REQUEST')}
                >
                  TRANSFER {rec.needed} UNITS
                </button>
              </div>
            ))}
          </div>

          {/* Quick History */}
          {view !== 'HISTORY' && (
            <div className="panel">
              <div className="panel-header">
                <h2>📋 RECENT HISTORY</h2>
              </div>
              <ul className="history-list">
                {historyItems.slice(0, 3).map((h, i) => (
                  <li key={i}>
                    <div className="hist-main">
                      <span className="text-dim text-xs">{h.date}</span>
                      <span className="text-main text-xs">{h.desc}</span>
                    </div>
                    <div className="hist-meta">
                      <span className="badge badge-success text-xs">{h.status}</span>
                      <span className="text-primary text-xs">{h.saved}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="history-footer-sm">
                <span className="text-primary font-bold text-xs">$1,240 saved this month</span>
              </div>
              <button type="button" className="btn-text w-full mt-2 text-primary text-xs" onClick={() => setView('HISTORY')}>
                VIEW FULL HISTORY →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
