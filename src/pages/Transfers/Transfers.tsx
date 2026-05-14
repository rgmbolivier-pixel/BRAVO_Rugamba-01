import React, { useState, useEffect } from 'react';
import { Truck, ArrowRightLeft, MapPin, CheckCircle, Navigation, Zap, Package, Clock, Send, X, History, Plus, FileText, Download, Loader2 } from 'lucide-react';
import { inventoryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Pagination } from '../../components/Pagination';
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
  const { user: currentUser } = useAuth();
  const [view, setView] = useState<TransferView>('OUTGOING');
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTransfers(currentPage);
  }, [currentPage, view]);

  const fetchTransfers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await inventoryService.getTransfers({ page });
      const data = res.data;
      let results: any[] = [];
      
      if (data.results) {
        results = data.results;
        setTotalCount(data.count);
      } else {
        results = Array.isArray(data) ? data : [];
        setTotalCount(results.length);
      }

      const mapped: Transfer[] = results.map((t: any) => ({
        id: String(t.id),
        from: t.from_branch_name,
        to: t.to_branch_name,
        product: t.product_name,
        quantity: t.quantity,
        batch: 'SYNCING...', 
        status: t.status.toUpperCase().replace(' ', '_') as any,
        reason: t.reason,
        driver: t.driver_name,
        eta: t.eta,
        deliveredAt: t.delivered_at ? new Date(t.delivered_at).toLocaleString() : undefined,
        receivedAt: t.received_at ? new Date(t.received_at).toLocaleString() : undefined,
        receivedBy: t.received_by_name
      }));
      setTransfers(mapped);
    } catch (err) {
      console.error('Failed to fetch transfers', err);
    } finally {
      setLoading(false);
    }
  };

  const outgoingTransfers = transfers.filter(t => t.from === currentUser?.branch_name);
  const incomingTransfers = transfers.filter(t => t.to === currentUser?.branch_name);
  const historyItems = transfers.filter(t => t.status === 'DELIVERED' || t.status === 'RECEIVED').map(t => ({
    date: t.deliveredAt || t.receivedAt || 'N/A',
    desc: `${t.from === currentUser?.branch_name ? 'Sent' : 'Recv'} ${t.quantity}u ${t.product} ${t.from === currentUser?.branch_name ? '→ ' + t.to : '← ' + t.from}`,
    status: t.status === 'RECEIVED' ? 'Received' : 'Delivered',
    saved: '$---',
    dir: t.from === currentUser?.branch_name ? 'out' : 'in'
  }));

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
    }
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
            <span className="stat-value text-bright">{currentUser?.branch_name || 'BRAVO STORE'}</span>
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
            <span className="stat-label">TOTAL COUNT</span>
            <span className="stat-value text-primary">{totalCount}</span>
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

      {loading ? (
        <div className="panel flex items-center justify-center p-20 col-span-3">
          <Loader2 className="animate-spin text-primary mr-3" />
          <span className="font-bold">SYNCING TRANSFERS...</span>
        </div>
      ) : (
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
          <Pagination 
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={10}
            onPageChange={setCurrentPage}
            loading={loading}
          />
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
                <span className="text-primary font-bold text-xs">$--- saved this month</span>
              </div>
              <button type="button" className="btn-text w-full mt-2 text-primary text-xs" onClick={() => setView('HISTORY')}>
                VIEW FULL HISTORY →
              </button>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
