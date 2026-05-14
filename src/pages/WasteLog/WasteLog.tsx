import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, Upload, Download, Edit3, ScanLine, Package, AlertTriangle, TrendingDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './WasteLog.css';

interface WasteEntry { id: number; date: string; product: string; qty: number; reason: string; employee: string; loss: number; batch: string; }

const PRODUCTS = [
  { name: '2% Milk', sku: 'MLK-002', cat: 'Dairy', cost: 2.50, batches: [
    { id: 'L2401', exp: 'TODAY', qty: 45, urgency: 'critical' },
    { id: 'L2405', exp: 'Dec 25', qty: 32, urgency: 'good' },
    { id: 'L2410', exp: 'Dec 30', qty: 23, urgency: 'good' },
  ]},
  { name: 'Sourdough Bread', sku: 'BRD-010', cat: 'Bakery', cost: 1.50, batches: [
    { id: 'B3301', exp: 'TODAY', qty: 15, urgency: 'critical' },
    { id: 'B3305', exp: 'Dec 26', qty: 40, urgency: 'good' },
  ]},
  { name: 'Cheddar Cheese', sku: 'CHE-005', cat: 'Dairy', cost: 5.00, batches: [
    { id: 'C1101', exp: 'Dec 22', qty: 18, urgency: 'warning' },
  ]},
  { name: 'Greek Yogurt', sku: 'YGT-003', cat: 'Dairy', cost: 1.50, batches: [
    { id: 'Y4401', exp: 'Dec 21', qty: 30, urgency: 'warning' },
  ]},
  { name: 'Roma Tomatoes', sku: 'TOM-001', cat: 'Produce', cost: 0.80, batches: [
    { id: 'T5501', exp: 'Dec 20', qty: 50, urgency: 'critical' },
  ]},
  { name: 'Butter Sticks', sku: 'BUT-002', cat: 'Dairy', cost: 3.20, batches: [
    { id: 'BT601', exp: 'Jan 5', qty: 24, urgency: 'good' },
  ]},
];

const REASONS = ['Expired (date passed)', 'Damaged packaging', 'Quality issue (color/smell)', 'Customer return', 'Theft / Missing', 'Other'];

const INIT_LOGS: WasteEntry[] = [
  { id: 1, date: 'Dec 18 10:32', product: '2% Milk', qty: 45, reason: 'Expired', employee: 'Aysel Ə.', loss: 112.50, batch: 'L2401' },
  { id: 2, date: 'Dec 18 09:15', product: 'Sourdough Bread', qty: 15, reason: 'Quality', employee: 'Aysel Ə.', loss: 22.50, batch: 'B3301' },
  { id: 3, date: 'Dec 17 16:20', product: 'Cheddar Cheese', qty: 8, reason: 'Damaged', employee: 'Rəşad Q.', loss: 40.00, batch: 'C1101' },
  { id: 4, date: 'Dec 17 11:00', product: 'Greek Yogurt', qty: 23, reason: 'Expired', employee: 'Aysel Ə.', loss: 34.50, batch: 'Y4401' },
  { id: 5, date: 'Dec 16 14:10', product: 'Roma Tomatoes', qty: 12, reason: 'Quality', employee: 'Nicat İ.', loss: 9.60, batch: 'T5501' },
  { id: 6, date: 'Dec 16 08:45', product: 'Butter Sticks', qty: 4, reason: 'Damaged', employee: 'Günel H.', loss: 12.80, batch: 'BT601' },
];

const TREND_DATA = [
  { day: 'Mon', val: 245 }, { day: 'Tue', val: 180 }, { day: 'Wed', val: 310 },
  { day: 'Thu', val: 150 }, { day: 'Fri', val: 220 }, { day: 'Sat', val: 193 }, { day: 'Sun', val: 170 },
];

import { inventoryService, wasteService } from '../../services/api';
import { Loader2 } from 'lucide-react';
import { Pagination } from '../../components/Pagination';

export const WasteLog: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<'log' | 'today' | 'trends'>('log');
  const [logs, setLogs] = useState<WasteEntry[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form state
  const [scanMode, setScanMode] = useState(true);
  const [barcode, setBarcode] = useState('');
  const [selProduct, setSelProduct] = useState<number | null>(null);
  const [selBatch, setSelBatch] = useState<number | null>(null);
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState(0);
  const [notes, setNotes] = useState('');
  const [scanning, setScanning] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (tab === 'today') {
      fetchLogs(currentPage);
    }
  }, [currentPage, tab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [stockRes, wasteRes] = await Promise.all([
        inventoryService.getStock({ page_size: 100 }), // Get some products for the dropdown
        wasteService.getRecords({ page: 1 })
      ]);
      
      const stockData = stockRes.data;
      const productsData = (stockData.results || stockData).map((s: any) => ({
        id: s.id,
        name: s.product_name,
        sku: s.sku,
        cat: s.category_name,
        cost: parseFloat(s.cost_price),
        unit: s.unit,
        batches: [
          { id: s.sku, exp: s.expiry_date, qty: s.quantity, urgency: 'good' } // Simplified batch logic
        ]
      }));
      setProducts(productsData);

      const wasteData = wasteRes.data;
      if (wasteData.results) {
        setLogs(mapWasteLogs(wasteData.results));
        setTotalCount(wasteData.count);
      } else {
        setLogs(mapWasteLogs(wasteData));
        setTotalCount(wasteData.length);
      }
    } catch (err) {
      console.error('Failed to fetch waste data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await wasteService.getRecords({ page });
      const data = res.data;
      if (data.results) {
        setLogs(mapWasteLogs(data.results));
        setTotalCount(data.count);
      } else {
        setLogs(mapWasteLogs(data));
        setTotalCount(data.length);
      }
    } catch (err) {
      console.error('Failed to fetch waste logs', err);
    } finally {
      setLoading(false);
    }
  };

  const mapWasteLogs = (data: any[]): WasteEntry[] => {
    return data.map((l: any) => ({
      id: l.id,
      date: new Date(l.created_at).toLocaleString(),
      product: l.product_name,
      qty: l.quantity,
      reason: l.reason,
      employee: l.reported_by_name || 'N/A',
      loss: parseFloat(l.loss_value),
      batch: l.batch_number || 'N/A'
    }));
  };

  const product = selProduct !== null ? products[selProduct] : null;
  const batch = product?.batches[selBatch ?? 0];
  const maxQty = batch?.qty ?? 0;
  const loss = (product?.cost ?? 0) * qty;

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { 
      setScanning(false); 
      setSelProduct(0); 
      setSelBatch(0); 
      setQty(products[0]?.batches[0]?.qty || 10); 
      setBarcode(products[0]?.sku || 'SCAN-001'); 
    }, 1500);
  };

  const handleSubmit = async () => {
    if (!product || qty <= 0) return;
    try {
      await wasteService.addRecord({
        product: product.id,
        quantity: qty,
        reason: REASONS[reason].split(' (')[0],
        notes,
        loss_value: loss,
        batch_number: batch?.id
      });
      setSubmitted(true);
      fetchInitialData(); // Refresh logs
      setTimeout(() => { setSubmitted(false); setQty(0); setNotes(''); setBarcode(''); }, 2000);
    } catch (err) {
      alert('Failed to log waste');
    }
  };

  // Today's summary
  const todayLogs = logs.slice(0, 4);
  const catSummary = [
    { cat: 'Dairy', qty: 76, loss: 187.00, pct: 55, color: 'var(--danger)' },
    { cat: 'Produce', qty: 12, loss: 9.60, pct: 15, color: 'var(--warning)' },
    { cat: 'Bakery', qty: 15, loss: 22.50, pct: 20, color: 'var(--primary)' },
    { cat: 'Other', qty: 4, loss: 12.80, pct: 10, color: 'var(--text-dim)' },
  ];
  const totalLoss = catSummary.reduce((s, c) => s + c.loss, 0);
  const maxTrend = Math.max(...TREND_DATA.map(d => d.val));

  return (
    <div className="wastelog-container page-container terminal-ui">
      {/* Header */}
      <header className="page-header glow-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>BRAVOOS › WASTE LOG</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>Downtown Store — Waste Management</div>
        </div>
        <button className="btn-secondary small"><Download size={14} /> EXPORT CSV</button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginTop: 16, marginBottom: 16 }}>
        {([['log', '📝 LOG WASTE'], ['today', '📊 TODAY\'S WASTE'], ['trends', '📈 TRENDS']] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={tab === k ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, justifyContent: 'center' }}>{l}</button>
        ))}
      </div>

      {/* TAB: LOG WASTE */}
      {tab === 'log' && (
        <div className="panel">
          <div className="panel-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Edit3 size={18} className="text-primary" /> LOG NEW WASTE</h2>
          </div>

          {submitted && (
            <div style={{ padding: 16, background: 'rgba(119,188,31,0.1)', border: '1px solid var(--primary)', borderRadius: 8, marginBottom: 16, textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
              ✅ Waste log submitted successfully!
            </div>
          )}

          {/* Scan vs Manual Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button onClick={() => setScanMode(true)} className={scanMode ? 'btn-primary small' : 'btn-secondary small'} style={{ flex: 1 }}><ScanLine size={14} /> SCAN BARCODE</button>
            <button onClick={() => setScanMode(false)} className={!scanMode ? 'btn-primary small' : 'btn-secondary small'} style={{ flex: 1 }}><Search size={14} /> MANUAL SELECT</button>
          </div>

          {/* Option 1: Scan */}
          {scanMode && (
            <div style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 8, border: '1px solid var(--border-glass)', marginBottom: 20 }}>
              <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 1, marginBottom: 12 }}>OPTION 1: SCAN BARCODE (RECOMMENDED)</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={handleScan} className="btn-primary" style={{ minWidth: 160 }} disabled={scanning}>
                  {scanning ? '⏳ SCANNING...' : '📷 SCAN'}
                </button>
                <span className="text-dim" style={{ fontSize: '0.8rem' }}>or enter manually:</span>
                <input className="terminal-input" style={{ flex: 1, minWidth: 160 }} placeholder="Enter barcode number..." value={barcode} onChange={e => setBarcode(e.target.value)} />
              </div>
              {barcode && <div className="text-primary" style={{ marginTop: 8, fontSize: '0.8rem', fontWeight: 700 }}>✓ Barcode: {barcode} — Product matched: {product?.name}</div>}
            </div>
          )}

          {/* Option 2: Manual */}
          {!scanMode && (
            <div style={{ padding: 20, background: 'var(--bg-glass)', borderRadius: 8, border: '1px solid var(--border-glass)', marginBottom: 20 }}>
              <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 1, marginBottom: 12 }}>OPTION 2: MANUAL PRODUCT SELECTION</div>
              <select className="terminal-select w-full" value={selProduct} onChange={e => { setSelProduct(Number(e.target.value)); setSelBatch(0); setQty(0); }}>
                {PRODUCTS.map((p, i) => <option key={i} value={i}>{p.name} — {p.sku} ({p.cat})</option>)}
              </select>
            </div>
          )}

          {/* Batch Selection */}
          {product && (
            <div style={{ marginBottom: 20 }}>
              <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 1, marginBottom: 12 }}>SELECT BATCH</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.batches.map((b, i) => {
                  const urg = b.urgency === 'critical' ? { c: 'var(--danger)', bg: 'rgba(255,0,60,0.06)', lbl: '🔴 CRITICAL' } : b.urgency === 'warning' ? { c: 'var(--warning)', bg: 'rgba(250,204,21,0.06)', lbl: '🟡 EXPIRING SOON' } : { c: 'var(--success)', bg: 'rgba(119,188,31,0.06)', lbl: '🟢 Good' };
                  return (
                    <label key={i} onClick={() => { setSelBatch(i); setQty(b.qty); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: selBatch === i ? urg.bg : 'var(--bg-glass)', border: `1px solid ${selBatch === i ? urg.c : 'var(--border-glass)'}`, borderRadius: 8, cursor: 'pointer', transition: 'var(--transition)' }}>
                      <input type="radio" name="batch" checked={selBatch === i} readOnly style={{ display: 'none' }} />
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selBatch === i ? urg.c : 'var(--text-dim)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {selBatch === i && <div style={{ width: 10, height: 10, borderRadius: '50%', background: urg.c }} />}
                      </div>
                      <span style={{ fontWeight: 700 }}>Batch {b.id}</span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>Expires {b.exp}</span>
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>({b.qty} units)</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 800, color: urg.c }}>{urg.lbl}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: 6 }}>QUANTITY TO WASTE *</label>
              <input type="number" className="terminal-input w-full" value={qty} min={0} max={maxQty} onChange={e => setQty(Math.min(Number(e.target.value), maxQty))} />
              <div className="text-dim" style={{ fontSize: '0.7rem', marginTop: 4 }}>Max available: {maxQty} units</div>
            </div>
            <div>
              <label className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: 6 }}>ESTIMATED LOSS</label>
              <div style={{ padding: '10px 16px', background: 'rgba(255,0,60,0.08)', border: '1px solid var(--danger)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--danger)' }}>
                ${loss.toFixed(2)}
              </div>
              <div className="text-dim" style={{ fontSize: '0.7rem', marginTop: 4 }}>${product?.cost.toFixed(2)} × {qty} units</div>
            </div>
          </div>

          {/* Waste Reason */}
          <div style={{ marginBottom: 20 }}>
            <label className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: 8 }}>WASTE REASON *</label>
            <div className="radio-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
              {REASONS.map((r, i) => (
                <label key={i} className="radio-label" onClick={() => setReason(i)} style={{ padding: '10px 14px', background: reason === i ? 'rgba(119,188,31,0.06)' : 'var(--bg-glass)', border: `1px solid ${reason === i ? 'var(--primary)' : 'var(--border-glass)'}`, borderRadius: 6, cursor: 'pointer' }}>
                  <input type="radio" name="reason" checked={reason === i} readOnly />
                  <span className="radio-custom" />
                  <span style={{ fontSize: '0.8rem' }}>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <label className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: 6 }}>NOTES (OPTIONAL)</label>
            <textarea className="terminal-input w-full" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional details..." />
          </div>

          {/* Photo */}
          <div style={{ marginBottom: 20 }}>
            <label className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, display: 'block', marginBottom: 8 }}>📸 PHOTO EVIDENCE (OPTIONAL)</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }}><Camera size={16} /> TAKE PHOTO</button>
              <button className="btn-secondary" style={{ flex: 1 }}><Upload size={16} /> UPLOAD</button>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, borderTop: '1px solid var(--border-glass)', paddingTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={handleSubmit} disabled={qty <= 0}>SUBMIT WASTE LOG</button>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setQty(0); setNotes(''); }}>CANCEL</button>
          </div>
        </div>
      )}

      {/* TAB: TODAY'S WASTE */}
      {tab === 'today' && (
        <>
          {/* Category Summary */}
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-header"><h2>📊 TODAY'S WASTE BY CATEGORY</h2></div>
            {loading ? (
              <div className="flex items-center justify-center p-10">
                <Loader2 className="animate-spin text-primary mr-2" />
                <span>SYNCING...</span>
              </div>
            ) : (
            <div className="table-responsive">
              <table className="terminal-table">
                <thead><tr><th>Category</th><th>Qty</th><th>Loss $</th><th>% of Total</th></tr></thead>
                <tbody>
                  {catSummary.map((c, i) => (
                    <tr key={i}>
                      <td className="font-bold text-main">{c.cat}</td>
                      <td>{c.qty}u</td>
                      <td style={{ color: c.color, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>${c.loss.toFixed(2)}</td>
                      <td style={{ minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-bar" style={{ flex: 1 }}><div className="progress" style={{ width: `${c.pct}%`, background: c.color }} /></div>
                          <span className="text-muted" style={{ fontSize: '0.75rem', minWidth: 30 }}>{c.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid var(--border-glass)', marginTop: 12 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--danger)' }}>TOTAL TODAY: ${totalLoss.toFixed(2)}</div>
              <div className="text-success" style={{ fontSize: '0.85rem', fontWeight: 700 }}>▼ 15% vs yesterday</div>
            </div>
          </div>

          {/* Recent Logs Table */}
          <div className="panel">
            <div className="panel-header"><h2>📋 RECENT WASTE LOGS (LAST 7 DAYS)</h2></div>
            {loading ? (
              <div className="flex items-center justify-center p-10">
                <Loader2 className="animate-spin text-primary mr-2" />
                <span>SYNCING...</span>
              </div>
            ) : (
            <>
            <div className="table-responsive">
              <table className="terminal-table">
                <thead><tr><th>Date</th><th>Product</th><th>Qty</th><th>Batch</th><th>Reason</th><th>Employee</th><th>Loss</th></tr></thead>
                <tbody>
                  {logs.map(l => (
                    <tr key={l.id}>
                      <td className="text-dim" style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{l.date}</td>
                      <td className="font-bold text-main">{l.product}</td>
                      <td>{l.qty}u</td>
                      <td className="text-primary" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{l.batch}</td>
                      <td><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 800, background: l.reason === 'Expired' ? 'rgba(255,0,60,0.1)' : l.reason === 'Damaged' ? 'rgba(250,204,21,0.1)' : 'rgba(119,188,31,0.1)', color: l.reason === 'Expired' ? 'var(--danger)' : l.reason === 'Damaged' ? 'var(--warning)' : 'var(--primary)' }}>{l.reason}</span></td>
                      <td className="text-muted">{l.employee}</td>
                      <td style={{ fontWeight: 800, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>${l.loss.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination 
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={10}
              onPageChange={setCurrentPage}
              loading={loading}
            />
            </>
            )}
          </div>
        </>
      )}

      {/* TAB: TRENDS */}
      {tab === 'trends' && (
        <>
          {/* Bar Chart */}
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-header"><h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><TrendingDown size={18} className="text-primary" /> 7-DAY WASTE TREND</h2></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, padding: '20px 0' }}>
              {TREND_DATA.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>${d.val}</span>
                  <div style={{ width: '100%', height: `${(d.val / maxTrend) * 140}px`, background: d.val > 250 ? 'var(--danger)' : d.val > 200 ? 'var(--warning)' : 'var(--primary)', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', minHeight: 20 }} />
                  <span className="text-dim" style={{ fontSize: '0.7rem', fontWeight: 700 }}>{d.day}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-glass)', padding: '12px 0' }}>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Weekly Average: <strong style={{ color: 'var(--text-main)' }}>${Math.round(TREND_DATA.reduce((s, d) => s + d.val, 0) / 7)}/day</strong></span>
            </div>
          </div>

          {/* Insights */}
          <div className="panel">
            <div className="panel-header"><h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} className="text-warning" /> AI WASTE INSIGHTS</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 16, borderLeft: '3px solid var(--danger)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0' }}>
                <div className="text-danger" style={{ fontWeight: 800, marginBottom: 4 }}>⚠ Dairy waste spike on Wednesday ($310)</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>62% of Wednesday waste was dairy. Check cooler temperature logs and receiving procedures.</div>
              </div>
              <div style={{ padding: 16, borderLeft: '3px solid var(--primary)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0' }}>
                <div className="text-primary" style={{ fontWeight: 800, marginBottom: 4 }}>💡 Top waste driver: Expiration (68% of total)</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>AI recommends increasing FEFO rotation frequency and earlier discount triggers for near-expiry items.</div>
              </div>
              <div style={{ padding: 16, borderLeft: '3px solid var(--success)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0' }}>
                <div className="text-success" style={{ fontWeight: 800, marginBottom: 4 }}>★ Positive trend: Weekend waste down 22%</div>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>Staff discount actions on Friday reduced Saturday/Sunday waste significantly.</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
