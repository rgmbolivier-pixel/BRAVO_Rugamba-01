import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Clock, Plus, BarChart2, Edit2, Trash2, X, Power } from 'lucide-react';
import './Branches.css';

interface Branch {
  id: number; name: string; address: string; city: string;
  manager: string; phone: string; status: 'Active' | 'Inactive';
  staff: number; hours: string; waste: string; saved: string; score: number;
}

const INIT: Branch[] = [
  { id: 1, name: 'NIZAMI STORE', address: 'Nizami küçəsi 45', city: 'Bakı', manager: 'Əli Həsənov', phone: '+994 12 497 0100', status: 'Active', staff: 8, hours: '7am - 11pm', waste: '$1,240 ▼12%', saved: '$3,450 ▲8%', score: 94 },
  { id: 2, name: 'FOUNTAIN SQUARE', address: 'Füzuli küçəsi 12', city: 'Bakı', manager: 'Leyla Məmmədova', phone: '+994 12 492 0200', status: 'Active', staff: 6, hours: '8am - 10pm', waste: '$1,890 ▲5%', saved: '$2,100 ▼3%', score: 88 },
  { id: 3, name: 'WHITE CITY BRANCH', address: 'Həsən Əliyev küçəsi 88', city: 'Bakı', manager: 'Rəşad Quliyev', phone: '+994 12 404 0300', status: 'Inactive', staff: 4, hours: '9am - 9pm', waste: '$890 ▼20%', saved: '$1,200 ▲15%', score: 76 },
];

const EMPTY: Omit<Branch, 'id'> = { name: '', address: '', city: 'Bakı', manager: '', phone: '', status: 'Active', staff: 0, hours: '8am - 10pm', waste: '$0', saved: '$0', score: 0 };

export const Branches: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>(INIT);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Branch, 'id'>>(EMPTY);
  const [search, setSearch] = useState('');

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (b: Branch) => { 
    setForm({ 
      name: b.name, address: b.address, city: b.city, manager: b.manager, 
      phone: b.phone, status: b.status, staff: b.staff, hours: b.hours, 
      waste: b.waste, saved: b.saved, score: b.score 
    }); 
    setEditId(b.id); 
    setShowForm(true); 
  };
  const handleDelete = (id: number) => { if (confirm('Delete this branch?')) setBranches(branches.filter(b => b.id !== id)); };
  const handleSave = () => {
    if (!form.name || !form.address) return;
    if (editId) {
      setBranches(branches.map(b => b.id === editId ? { ...form, id: editId } : b));
    } else {
      setBranches([...branches, { ...form, id: Date.now() }]);
    }
    setShowForm(false); setEditId(null);
  };

  const filtered = branches.filter(b => !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="branches-container page-container terminal-ui">
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ flex: 2, minWidth: 200 }}>
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search branches..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> ADD BRANCH</button>
      </div>

      {showForm && (
        <div className="panel mb-4">
          <div className="panel-header">
            <h2>{editId ? '✏️ EDIT BRANCH' : '➕ ADD NEW BRANCH'}</h2>
            <button className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div><label className="text-dim text-xs block mb-1">Branch Name</label><input className="terminal-input w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Address</label><input className="terminal-input w-full" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">City</label><input className="terminal-input w-full" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Manager</label><input className="terminal-input w-full" value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Phone</label><input className="terminal-input w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Status</label><select className="terminal-select w-full" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}><option>Active</option><option>Inactive</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'UPDATE BRANCH' : 'CREATE BRANCH'}</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h2>🏢 BRANCHES ({filtered.length})</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(b => (
            <div key={b.id} className="branch-card" style={{ padding: 20, border: '1px solid var(--border-glass)', borderLeft: `4px solid ${b.status === 'Active' ? 'var(--success)' : 'var(--text-dim)'}`, background: 'var(--bg-card)', borderRadius: 8, opacity: b.status === 'Inactive' ? 0.6 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-glass)' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin className="text-primary" size={18} /> {b.name}
                </h3>
                <span className={b.status === 'Active' ? 'text-success' : 'text-dim'} style={{ fontWeight: 700, fontSize: '0.8rem' }}>● {b.status.toUpperCase()}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.85rem', marginBottom: 16 }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}><strong className="text-main">Location:</strong> {b.address}, {b.city}</div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}><strong className="text-main">Manager:</strong> {b.manager}</div>
                  <div style={{ color: 'var(--text-muted)' }}><strong className="text-main">Phone:</strong> {b.phone}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><Users size={14} className="text-primary" /> <strong className="text-main">Staff:</strong> <span className="text-muted">{b.staff}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} className="text-primary" /> <strong className="text-main">Hours:</strong> <span className="text-muted">{b.hours}</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 6, marginBottom: 16, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                <span>Waste: <span className="text-primary">{b.waste}</span></span>
                <span>Saved: <span className="text-primary">{b.saved}</span></span>
                <span style={{ fontWeight: 800, color: b.score >= 90 ? 'var(--success)' : b.score >= 80 ? 'var(--warning)' : 'var(--danger)' }}>Score: {b.score}/100</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn-secondary small" style={{ flex: 1 }} onClick={() => openEdit(b)}><Edit2 size={14} /> EDIT</button>
                <button className="btn-secondary small" style={{ flex: 1 }} onClick={() => navigate('/analytics')}><BarChart2 size={14} /> ANALYTICS</button>
                <button className="btn-secondary small text-danger" style={{ flex: 1 }} onClick={() => handleDelete(b.id)}><Trash2 size={14} /> DELETE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
