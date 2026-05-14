import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Truck, Star, Phone, Mail, MapPin, FileText, Edit2, Trash2, X, Clock, AlertTriangle, Zap, CheckCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import './Vendors.css';

interface Vendor {
  id: number; name: string; contact: string; email: string; phone: string;
  address: string; categories: string[]; leadTime: number; paymentTerms: string;
  since: string; rating: number; status: 'Active' | 'Under Review' | 'Suspended';
  onTime: number; quality: number; fillRate: number; avgResponse: string;
  activePOs: number;
  recentPOs: { code: string; amount: number; date: string; status: 'delivered' | 'late' | 'pending' }[];
  issues: { date: string; detail: string }[];
}

const VENDORS: Vendor[] = [
  {
    id: 1, name: 'Dairy Fresh Co', contact: 'Ahmad Kazımov', email: 'orders@dairyfresh.az', phone: '+994 12 497 0100',
    address: '123 Sənaye küçəsi, Bakı', categories: ['Dairy', 'Eggs', 'Butter'], leadTime: 2, paymentTerms: 'Net 30',
    since: 'Jan 2023', rating: 4.2, status: 'Active', onTime: 94, quality: 96, fillRate: 98, avgResponse: '2.3 hrs', activePOs: 3,
    recentPOs: [
      { code: 'PO-001234', amount: 1237, date: 'Dec 20', status: 'delivered' },
      { code: 'PO-001230', amount: 890, date: 'Dec 15', status: 'delivered' },
      { code: 'PO-001225', amount: 2100, date: 'Dec 10', status: 'late' },
    ],
    issues: [],
  },
  {
    id: 2, name: 'Produce World', contact: 'Leyla Əhmədova', email: 'orders@produceworld.az', phone: '+994 12 498 0200',
    address: '456 Kənd təsərrüfatı pr., Sumqayıt', categories: ['Produce', 'Herbs'], leadTime: 1, paymentTerms: 'Net 15',
    since: 'Mar 2023', rating: 3.8, status: 'Under Review', onTime: 89, quality: 92, fillRate: 95, avgResponse: '4.1 hrs', activePOs: 1,
    recentPOs: [
      { code: 'PO-001240', amount: 560, date: 'Dec 22', status: 'pending' },
      { code: 'PO-001220', amount: 780, date: 'Dec 12', status: 'delivered' },
    ],
    issues: [
      { date: 'Dec 15', detail: 'Shortage: 5 units Lettuce (credit pending)' },
      { date: 'Dec 10', detail: 'Quality: Damaged tomatoes (replaced)' },
    ],
  },
  {
    id: 3, name: 'Bakery Supplies AZ', contact: 'Nicat Məmmədov', email: 'orders@bakerysupplies.az', phone: '+994 12 499 0300',
    address: '789 Çörək zavodu küçəsi, Bakı', categories: ['Bakery', 'Flour', 'Yeast'], leadTime: 3, paymentTerms: 'Net 45',
    since: 'Jun 2023', rating: 4.5, status: 'Active', onTime: 97, quality: 98, fillRate: 99, avgResponse: '1.5 hrs', activePOs: 2,
    recentPOs: [
      { code: 'PO-001245', amount: 1850, date: 'Dec 21', status: 'delivered' },
      { code: 'PO-001235', amount: 920, date: 'Dec 14', status: 'delivered' },
    ],
    issues: [],
  },
];

const EMPTY_FORM = { name: '', contact: '', email: '', phone: '', address: '', categories: ['Dairy'], leadTime: 2, paymentTerms: 'Net 30' };

export const Vendors: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState(VENDORS);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = vendors.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'All' && !v.categories.includes(catFilter)) return false;
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    return true;
  });

  const renderStars = (r: number) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={14} fill={i < Math.floor(r) ? 'var(--warning)' : 'transparent'} color={i < Math.floor(r) ? 'var(--warning)' : 'var(--text-dim)'} />
  ));

  const metricColor = (v: number) => v >= 95 ? 'var(--success)' : v >= 90 ? 'var(--primary)' : v >= 85 ? 'var(--warning)' : 'var(--danger)';
  const statusStyle = (s: string) => s === 'Active' ? { color: 'var(--success)', bg: 'rgba(119,188,31,0.1)' } : s === 'Under Review' ? { color: 'var(--warning)', bg: 'rgba(250,204,21,0.1)' } : { color: 'var(--danger)', bg: 'rgba(255,0,60,0.1)' };

  const handleAdd = () => {
    if (!form.name || !form.email) return;
    const newV: Vendor = { ...form, id: Date.now(), rating: 0, status: 'Active', since: 'Dec 2024', onTime: 0, quality: 0, fillRate: 0, avgResponse: '—', activePOs: 0, recentPOs: [], issues: [] };
    setVendors([...vendors, newV]);
    setShowForm(false);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id: number) => { if (confirm('Remove this vendor?')) setVendors(vendors.filter(v => v.id !== id)); };

  return (
    <div className="vendors-container page-container terminal-ui">
      {/* Search & Controls */}
      <div className="search-bar panel mb-4">
        <div className="input-with-icon w-full">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filters">
          <select className="terminal-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option value="All">Category: All</option><option>Dairy</option><option>Produce</option><option>Bakery</option><option>Herbs</option>
          </select>
          <select className="terminal-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="All">Status: All</option><option>Active</option><option>Under Review</option><option>Suspended</option>
          </select>
          <button className="btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> ADD VENDOR</button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="panel mb-4">
          <div className="panel-header"><h2>➕ ADD NEW VENDOR</h2><button className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label className="text-dim text-xs block mb-1">Company Name *</label><input className="terminal-input w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Contact Person</label><input className="terminal-input w-full" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Email *</label><input className="terminal-input w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Phone</label><input className="terminal-input w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div style={{ gridColumn: 'span 2' }}><label className="text-dim text-xs block mb-1">Address</label><input className="terminal-input w-full" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Lead Time (days)</label><input type="number" className="terminal-input w-full" value={form.leadTime} onChange={e => setForm({ ...form, leadTime: Number(e.target.value) })} /></div>
            <div><label className="text-dim text-xs block mb-1">Payment Terms</label><select className="terminal-select w-full" value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value })}><option>Net 15</option><option>Net 30</option><option>Net 45</option><option>Net 60</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn-primary" onClick={handleAdd}>CREATE VENDOR</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}

      {/* Vendor Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filtered.map(v => {
          const ss = statusStyle(v.status);
          const isExpanded = expandedId === v.id;
          return (
            <div key={v.id} className="panel" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Card Header */}
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : v.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Truck size={24} color="#000" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{v.name}</h3>
                      <span style={{ padding: '2px 10px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 800, background: ss.bg, color: ss.color, border: `1px solid ${ss.color}` }}>{v.status.toUpperCase()}</span>
                    </div>
                    <div className="text-dim" style={{ fontSize: '0.75rem', marginTop: 2 }}>{v.categories.join(' • ')} │ Since {v.since}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{renderStars(v.rating)} <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: 4 }}>({v.rating})</span></div>
                  {isExpanded ? <ChevronUp size={20} className="text-dim" /> : <ChevronDown size={20} className="text-dim" />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-glass)' }}>
                  {/* Contact & Details */}
                  <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, background: 'var(--bg-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} className="text-primary" /><span className="text-muted" style={{ fontSize: '0.85rem' }}>{v.phone}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} className="text-primary" /><span className="text-muted" style={{ fontSize: '0.85rem' }}>{v.email}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} className="text-primary" /><span className="text-muted" style={{ fontSize: '0.85rem' }}>{v.address}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={14} className="text-primary" /><span className="text-muted" style={{ fontSize: '0.85rem' }}>Lead Time: {v.leadTime} days │ {v.paymentTerms}</span></div>
                  </div>

                  {/* Performance Metrics */}
                  <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <Zap size={16} className="text-primary" />
                      <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: 1 }}>PERFORMANCE METRICS (LAST 90 DAYS)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                      {[{ label: 'On-Time Delivery', val: v.onTime }, { label: 'Quality Acceptance', val: v.quality }, { label: 'Fill Rate', val: v.fillRate }].map(m => (
                        <div key={m.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{m.label}</span>
                            <span style={{ fontWeight: 800, color: metricColor(m.val), fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{m.val}%</span>
                          </div>
                          <div className="progress-bar"><div className="progress" style={{ width: `${m.val}%`, background: metricColor(m.val) }} /></div>
                        </div>
                      ))}
                      <div>
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Avg Response</span>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginTop: 4 }}>{v.avgResponse}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent POs */}
                  <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <FileText size={16} className="text-primary" />
                      <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: 1 }}>RECENT PURCHASE ORDERS</span>
                    </div>
                    {v.recentPOs.map((po, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < v.recentPOs.length - 1 ? '1px dashed var(--border-glass)' : 'none' }}>
                        <span className="text-primary" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem', minWidth: 90 }}>{po.code}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: 70 }}>${po.amount.toLocaleString()}</span>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{po.date}</span>
                        <span style={{ marginLeft: 'auto' }}>
                          {po.status === 'delivered' && <span className="text-success" style={{ fontWeight: 800, fontSize: '0.75rem' }}>✅ Delivered</span>}
                          {po.status === 'late' && <span className="text-warning" style={{ fontWeight: 800, fontSize: '0.75rem' }}>⚠ Late</span>}
                          {po.status === 'pending' && <span className="text-muted" style={{ fontWeight: 800, fontSize: '0.75rem' }}>🔄 Pending</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Issues */}
                  {v.issues.length > 0 && (
                    <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)', background: 'rgba(255,0,60,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <AlertTriangle size={16} className="text-warning" />
                        <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--warning)', letterSpacing: 1 }}>OPEN ISSUES ({v.issues.length})</span>
                      </div>
                      {v.issues.map((iss, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', fontSize: '0.8rem' }}>
                          <span className="text-dim" style={{ minWidth: 55 }}>{iss.date}</span>
                          <span className="text-muted">{iss.detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn-secondary small"><Edit2 size={14} /> EDIT</button>
                    <button className="btn-secondary small" onClick={() => navigate('/purchase-orders')}><FileText size={14} /> VIEW ALL ORDERS</button>
                    <button className="btn-secondary small"><MessageSquare size={14} /> CONTACT</button>
                    <button className="btn-primary small" onClick={() => navigate('/purchase-orders')}><Plus size={14} /> NEW PO</button>
                    <button className="btn-icon small text-danger" style={{ marginLeft: 'auto' }} onClick={() => handleDelete(v.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Zap size={18} className="text-primary" /> VENDOR PERFORMANCE AI</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: 16, borderLeft: '3px solid var(--warning)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0' }}>
            <div className="text-warning" style={{ fontWeight: 800, marginBottom: 4 }}>⚠ Issue Detected: Produce World</div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 8 }}>Delivery delays increased 15% this month. On-time rate dropped to 89%.</div>
            <button className="btn-secondary small" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>SEND WARNING</button>
          </div>
          <div style={{ padding: 16, borderLeft: '3px solid var(--success)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0' }}>
            <div className="text-success" style={{ fontWeight: 800, marginBottom: 4 }}>★ Top Performer: Bakery Supplies AZ</div>
            <div className="text-muted" style={{ fontSize: '0.85rem', marginBottom: 8 }}>97% on-time, 98% quality. AI recommends negotiating bulk discount based on volume.</div>
            <button className="btn-primary small">GENERATE PROPOSAL</button>
          </div>
          <div style={{ padding: 16, borderLeft: '3px solid var(--primary)', background: 'var(--bg-glass)', borderRadius: '0 8px 8px 0' }}>
            <div className="text-primary" style={{ fontWeight: 800, marginBottom: 4 }}>💡 Recommendation: Dairy Fresh Co</div>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>PO-001225 was 2 days late. Consider requesting SLA improvement or penalty clause for next contract renewal.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
