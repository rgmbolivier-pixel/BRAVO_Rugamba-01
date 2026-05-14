import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Zap, Download, Search, CheckSquare, Filter, RefreshCw, DollarSign, TrendingUp, Clock, Tag, ArrowRightLeft, Heart, PercentIcon, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { canAccessManagerOps, canAccessTransfers } from '../../utils/roleAccess';
import { formatShortDate } from '../../utils/formatDate';
import './Alerts.css';

interface AlertItem {
  id: string; name: string; sku: string; category: string; quantity: number;
  location: string; expiryDate: string; lossAmount: number; batch: string;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'; recommendation: string;
  confidence: number; unitCost: number;
  aiDiscount: number; aiTransferBranch: string; aiTransferQty: number;
}

export const Alerts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? 'STAFF';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [clock, setClock] = useState(() => Date.now());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<Record<string, number>>({});
  const [transferQtys, setTransferQtys] = useState<Record<string, number>>({});
  const [transferBranches, setTransferBranches] = useState<Record<string, string>>({});
  const [actionResults, setActionResults] = useState<Record<string, string>>({});

  const [alerts] = useState<AlertItem[]>([
    { id: '1', name: '2% MILK', sku: 'MK-2001', category: 'Dairy', quantity: 45, location: 'Cooler A', expiryDate: '2026-05-14T22:00:00.000Z', lossAmount: 135, batch: 'L2401', level: 'CRITICAL', recommendation: '30% discount predicted to sell 90% before expiry. Transfer 15 units to Uptown (high demand).', confidence: 94, unitCost: 2.50, aiDiscount: 30, aiTransferBranch: 'Uptown Store', aiTransferQty: 15 },
    { id: '2', name: 'CHEDDAR CHEESE', sku: 'CH-3042', category: 'Dairy', quantity: 23, location: 'Cooler B', expiryDate: '2026-05-16T12:00:00.000Z', lossAmount: 115, batch: 'C2392', level: 'CRITICAL', recommendation: '15% discount or transfer to Uptown (high demand). Transfer saves 100% of value.', confidence: 88, unitCost: 5.00, aiDiscount: 15, aiTransferBranch: 'Uptown Store', aiTransferQty: 10 },
    { id: '3', name: 'SOURDOUGH BREAD', sku: 'BR-1005', category: 'Bakery', quantity: 67, location: 'Shelf 3', expiryDate: '2026-05-19T08:00:00.000Z', lossAmount: 100, batch: 'B2410', level: 'HIGH', recommendation: 'BOGO deal predicted to clear 85%. Transfer 20 units to Fountain Square branch.', confidence: 82, unitCost: 4.50, aiDiscount: 50, aiTransferBranch: 'Fountain Square', aiTransferQty: 20 },
    { id: '4', name: 'GALA APPLES', sku: 'FR-5002', category: 'Produce', quantity: 120, location: 'Aisle 2', expiryDate: '2026-06-01T18:00:00.000Z', lossAmount: 240, batch: 'A9912', level: 'MEDIUM', recommendation: '10% volume discount recommended. Transfer 40 units to White City branch.', confidence: 76, unitCost: 2.00, aiDiscount: 10, aiTransferBranch: 'White City', aiTransferQty: 40 },
  ]);

  const refreshData = useCallback(() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 800); }, []);
  useEffect(() => { const i = setInterval(() => { setClock(Date.now()); refreshData(); }, 30000); return () => clearInterval(i); }, [refreshData]);

  const getLevelColor = (l: string) => l === 'CRITICAL' ? 'var(--danger)' : l === 'HIGH' ? 'var(--warning)' : l === 'MEDIUM' ? '#ff8800' : '#00aaff';
  const getTimeRemaining = (d: string) => { const diff = new Date(d).getTime() - clock; const days = Math.floor(diff / 864e5); const hrs = Math.floor((diff % 864e5) / 36e5); return days > 0 ? `${days}d ${hrs}h left` : `${hrs}h left`; };
  const filteredAlerts = alerts.filter(a => (filterLevel === 'ALL' || a.level === filterLevel) && (a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.sku.toLowerCase().includes(searchTerm.toLowerCase())));
  const toggleSelect = (id: string) => setSelectedItems(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  const getDiscount = (a: AlertItem) => discounts[a.id] ?? a.aiDiscount;
  const getTransferQty = (a: AlertItem) => transferQtys[a.id] ?? a.aiTransferQty;
  const getTransferBranch = (a: AlertItem) => transferBranches[a.id] ?? a.aiTransferBranch;

  const toggleExpand = (id: string) => { setExpandedId(expandedId === id ? null : id); };

  const applyAction = (id: string, action: string) => { setActionResults({ ...actionResults, [id]: action }); };

  return (
    <div className="alerts-container page-container terminal-ui">
      {/* Stats */}
      <div className="stats-bar mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="stat-card glass">
          <div className="stat-icon-bg critical"><AlertTriangle size={24} /></div>
          <div className="stat-info"><span className="stat-label">{t('alerts.critical')}</span><span className="stat-value text-danger">3</span></div>
          <div className="stat-trend negative">MUST ACT NOW</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card glass">
          <div className="stat-icon-bg warning"><Clock size={24} /></div>
          <div className="stat-info"><span className="stat-label">{t('alerts.high')}</span><span className="stat-value text-warning">5</span></div>
          <div className="stat-trend">NEXT 7 DAYS</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card glass">
          <div className="stat-icon-bg secondary"><DollarSign size={24} /></div>
          <div className="stat-info"><span className="stat-label">{t('dashboard.at_risk_value')}</span><span className="stat-value text-bright">$1,240</span></div>
          <div className="stat-trend positive">↑ 12% vs LW</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card glass">
          <div className="stat-icon-bg primary"><TrendingUp size={24} /></div>
          <div className="stat-info"><span className="stat-label">RESOLUTION RATE</span><span className="stat-value text-primary">82%</span></div>
          <div className="stat-trend positive">WELL DONE</div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="control-bar glass mb-4">
        <div className="search-group"><Search size={18} className="text-dim" /><input type="text" placeholder={t('common.search')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <div className="filter-group">
          <div className="filter-item"><Filter size={16} className="text-dim" /><select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}><option value="ALL">ALL LEVELS</option><option value="CRITICAL">CRITICAL</option><option value="HIGH">HIGH</option><option value="MEDIUM">MEDIUM</option></select></div>
          <button className="refresh-btn" onClick={refreshData}><RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} /></button>
          <button type="button" className="btn-secondary small" onClick={() => navigate(canAccessManagerOps(role) ? '/analytics' : '/inventory')}><Download size={16} /> {t('common.export')}</button>
        </div>
      </div>

      {/* Bulk */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bulk-bar glass mb-4">
            <div className="bulk-info"><CheckSquare size={18} className="text-primary" /><span>{selectedItems.length} items selected</span></div>
            <div className="bulk-actions">
              <button type="button" className="btn-primary small">BULK DISCOUNT</button>
              <button type="button" className="btn-secondary small" onClick={() => navigate(canAccessTransfers(role) ? '/transfers' : '/tasks')}>BULK TRANSFER</button>
              <button type="button" className="btn-text small" onClick={() => setSelectedItems([])}>DESELECT ALL</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Cards */}
      <div className="alert-grid">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.map(alert => (
            <motion.div key={alert.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`alert-card-new glass ${selectedItems.includes(alert.id) ? 'selected' : ''}`}>
              <div className="card-header">
                <div className="product-info">
                  <div className="checkbox" onClick={() => toggleSelect(alert.id)}>
                    {selectedItems.includes(alert.id) ? <CheckSquare size={18} className="text-primary" /> : <div className="box" />}
                  </div>
                  <div><h3 className="product-name">{alert.name}</h3><span className="sku text-dim">{alert.sku} • {alert.category}</span></div>
                </div>
                <div className="level-badge" style={{ background: `${getLevelColor(alert.level)}22`, color: getLevelColor(alert.level), borderColor: getLevelColor(alert.level) }}>{alert.level}</div>
              </div>

              <div className="card-body">
                <div className="data-grid">
                  <div className="data-item"><span className="label">AT RISK</span><span className="value">{alert.quantity} units</span></div>
                  <div className="data-item"><span className="label">EXPIRY</span><span className="value text-danger">{getTimeRemaining(alert.expiryDate)}</span><span className="value text-dim" style={{ fontSize: '0.7rem', fontWeight: 500 }}>{formatShortDate(alert.expiryDate, i18n.language)}</span></div>
                  <div className="data-item"><span className="label">EST. LOSS</span><span className="value">${alert.lossAmount}</span></div>
                  <div className="data-item"><span className="label">BATCH</span><span className="value text-dim">{alert.batch}</span></div>
                </div>

                <div className="ai-recommendation-panel">
                  <div className="ai-header"><Zap size={14} className="text-primary" /><span>AI INSIGHT • {alert.confidence}% CONFIDENCE</span></div>
                  <p className="ai-text">{alert.recommendation}</p>
                </div>
              </div>

              {/* Action Result */}
              {actionResults[alert.id] ? (
                <div style={{ padding: 16, background: 'rgba(119,188,31,0.08)', border: '1px solid var(--success)', borderRadius: 8, textAlign: 'center' }}>
                  <div className="text-success" style={{ fontWeight: 800, fontSize: '1rem' }}>{actionResults[alert.id]}</div>
                </div>
              ) : (
                <>
                  {/* Expand/Collapse Toggle */}
                  <div className="card-footer">
                    <div className="action-buttons">
                      <button type="button" className="btn-primary small" onClick={() => toggleExpand(alert.id)}>
                        <Tag size={14} /> {expandedId === alert.id ? 'HIDE ACTIONS' : 'TAKE ACTION'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Action Panel */}
                  <AnimatePresence>
                    {expandedId === alert.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
                        {/* DISCOUNT */}
                        <div style={{ padding: 16, border: '1px solid var(--border-glass)', borderRadius: 8, background: 'var(--bg-glass)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <Tag size={18} className="text-primary" />
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>DISCOUNT</span>
                            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                              <Zap size={12} style={{ display: 'inline' }} /> AI suggests {alert.aiDiscount}% off
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <input type="range" min={5} max={70} value={getDiscount(alert)} onChange={e => setDiscounts({ ...discounts, [alert.id]: Number(e.target.value) })} style={{ flex: 1, accentColor: 'var(--primary)' }} />
                            <div style={{ minWidth: 70, textAlign: 'center', padding: '6px 12px', background: 'var(--primary)', color: '#000', borderRadius: 6, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{getDiscount(alert)}% OFF</div>
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: 6 }}>
                            New: ${(alert.unitCost * (1 - getDiscount(alert) / 100)).toFixed(2)}/unit — Revenue: ${(alert.quantity * alert.unitCost * (1 - getDiscount(alert) / 100)).toFixed(2)}
                          </div>
                          <button className="btn-primary w-full" style={{ marginTop: 10 }} onClick={() => applyAction(alert.id, `✅ ${getDiscount(alert)}% discount applied to ${alert.name}`)}>
                            <PercentIcon size={14} /> APPLY {getDiscount(alert)}% DISCOUNT
                          </button>
                        </div>

                        {/* TRANSFER */}
                        <div style={{ padding: 16, border: '1px solid var(--border-glass)', borderRadius: 8, background: 'var(--bg-glass)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <ArrowRightLeft size={18} className="text-warning" />
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>TRANSFER</span>
                            <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--warning)', fontStyle: 'italic' }}>
                              <Zap size={12} style={{ display: 'inline' }} /> AI suggests {alert.aiTransferQty} units → {alert.aiTransferBranch}
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <div>
                              <label className="text-dim" style={{ fontSize: '0.65rem', display: 'block', marginBottom: 4 }}>BRANCH</label>
                              <select className="terminal-select w-full" value={getTransferBranch(alert)} onChange={e => setTransferBranches({ ...transferBranches, [alert.id]: e.target.value })}>
                                <option>Uptown Store</option><option>Fountain Square</option><option>White City</option><option>Nizami Store</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-dim" style={{ fontSize: '0.65rem', display: 'block', marginBottom: 4 }}>QUANTITY</label>
                              <input type="number" className="terminal-input w-full" min={1} max={alert.quantity} value={getTransferQty(alert)} onChange={e => setTransferQtys({ ...transferQtys, [alert.id]: Number(e.target.value) })} />
                            </div>
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: 10 }}>
                            <MapPin size={12} style={{ display: 'inline' }} /> Transferring {getTransferQty(alert)} of {alert.quantity} units to {getTransferBranch(alert)}
                          </div>
                          <button className="btn-secondary w-full" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }} onClick={() => applyAction(alert.id, `✅ ${getTransferQty(alert)} units of ${alert.name} transferred to ${getTransferBranch(alert)}`)}>
                            <ArrowRightLeft size={14} /> TRANSFER {getTransferQty(alert)} UNITS
                          </button>
                        </div>

                        {/* DONATE */}
                        <div style={{ padding: 16, border: '1px solid var(--border-glass)', borderRadius: 8, background: 'var(--bg-glass)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <Heart size={18} className="text-danger" />
                            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>DONATE TO FOOD BANK</span>
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 10 }}>Tax deduction: ~${(alert.quantity * alert.unitCost * 0.3).toFixed(2)} • Reduces waste by {alert.quantity} units</div>
                          <button className="btn-secondary w-full" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => applyAction(alert.id, `✅ ${alert.name} donated to local food bank`)}>
                            <Heart size={14} /> DONATE ALL {alert.quantity} UNITS
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-card { padding: 20px; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; }
        .stat-icon-bg { width: 48px; height: 48px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .stat-icon-bg.critical { background: rgba(255, 0, 60, 0.1); color: var(--danger); }
        .stat-icon-bg.warning { background: rgba(250, 204, 21, 0.1); color: var(--warning); }
        .stat-icon-bg.secondary { background: rgba(255, 255, 255, 0.05); color: var(--text-main); }
        .stat-icon-bg.primary { background: rgba(119, 188, 31, 0.1); color: var(--primary); }
        .stat-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 1.5rem; font-weight: 800; font-family: 'Outfit', sans-serif; }
        .stat-trend { font-size: 0.6rem; font-weight: 800; padding: 2px 6px; background: var(--bg-glass); border: 1px solid var(--border-glass); width: fit-content; border-radius: 4px; }
        .stat-trend.negative { color: var(--danger); }
        .stat-trend.positive { color: var(--primary); }
        .control-bar { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; }
        .search-group { display: flex; align-items: center; gap: 12px; flex: 1; }
        .search-group input { background: transparent; border: none; color: var(--text-main); font-family: var(--font-mono); width: 100%; outline: none; }
        .filter-group { display: flex; align-items: center; gap: 16px; }
        .filter-item { display: flex; align-items: center; gap: 8px; background: var(--bg-glass); padding: 4px 12px; border-radius: 4px; border: 1px solid var(--border-glass); }
        .filter-item select { background: transparent; border: none; color: var(--text-muted); font-size: 0.75rem; font-weight: 700; outline: none; cursor: pointer; }
        .bulk-bar { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: rgba(119, 188, 31, 0.05) !important; border-color: var(--primary) !important; }
        .bulk-info { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 0.85rem; }
        .bulk-actions { display: flex; gap: 12px; }
        .alert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 20px; }
        .alert-card-new { display: flex; flex-direction: column; gap: 20px; padding: 24px; transition: all 0.3s ease; border: 1px solid var(--border-glass); }
        .alert-card-new:hover { border-color: rgba(255, 255, 255, 0.2); transform: translateY(-4px); }
        .alert-card-new.selected { border-color: var(--primary); background: rgba(119, 188, 31, 0.02) !important; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .product-info { display: flex; gap: 16px; align-items: center; }
        .checkbox { cursor: pointer; }
        .checkbox .box { width: 18px; height: 18px; border: 2px solid var(--text-dim); border-radius: 4px; }
        .product-name { font-size: 1.1rem; font-weight: 800; color: var(--text-bright); }
        .sku { font-size: 0.75rem; }
        .level-badge { padding: 4px 12px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; border: 1px solid transparent; }
        .data-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .data-item { display: flex; flex-direction: column; gap: 4px; }
        .data-item .label { font-size: 0.6rem; color: var(--text-dim); font-weight: 800; text-transform: uppercase; }
        .data-item .value { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
        .ai-recommendation-panel { background: rgba(119, 188, 31, 0.03); border-left: 2px solid var(--primary); padding: 16px; border-radius: 0 4px 4px 0; }
        .ai-header { display: flex; align-items: center; gap: 8px; font-size: 0.65rem; font-weight: 800; color: var(--primary); margin-bottom: 8px; }
        .ai-text { font-size: 0.85rem; line-height: 1.5; color: var(--text-muted); }
        .card-footer { margin-top: auto; display: flex; justify-content: flex-end; }
        .action-buttons { display: flex; flex-wrap: wrap; gap: 12px; }
        @media (max-width: 1024px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } .alert-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .stats-bar { grid-template-columns: 1fr; } .control-bar { flex-direction: column; gap: 16px; align-items: stretch; } .filter-group { flex-wrap: wrap; } .data-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 576px) { .data-grid { grid-template-columns: 1fr; } .action-buttons { flex-direction: column; width: 100%; } .action-buttons button { width: 100%; min-height: var(--touch-min, 44px); justify-content: center; } .card-footer { justify-content: stretch; } }
      `}</style>
    </div>
  );
};
