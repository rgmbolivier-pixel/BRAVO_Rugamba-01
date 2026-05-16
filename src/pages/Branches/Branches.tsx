import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Clock, Plus, BarChart2, Edit2, Trash2, X, Power } from 'lucide-react';
import { inventoryService } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '../../components/Pagination';
import './Branches.css';

interface Branch {
  id: string; name: string; address: string; city: string;
  manager?: string; phone: string; status: 'active' | 'inactive';
  staff_count?: number; opening_time?: string; closing_time?: string;
  waste?: string; saved?: string; score?: number;
}

const EMPTY: any = { name: '', address: '', city: 'Baku', manager: '', phone: '', status: 'active', branch_code: '' };

export const Branches: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { data: branchesData, isLoading, error } = useQuery(['branches', currentPage], async () => {
    const res = await inventoryService.getBranches({ page: currentPage });
    const perf = await import('../../services/api').then(m => m.analyticsService.getBranchPerformance());
    return { branchesRes: res.data, perfRes: perf.data };
  }, { keepPreviousData: true });

  React.useEffect(() => {
    if (!branchesData) return;
    setLoading(false);
    const bData = branchesData.branchesRes;
    let branchList: any[] = [];
    if (bData.results) {
      branchList = bData.results;
      setTotalCount(bData.count);
    } else {
      branchList = Array.isArray(bData) ? bData : [];
      setTotalCount(branchList.length);
    }
    const perfData = branchesData.perfRes;
    const mapped = branchList.map((b: any) => {
      const perfItem = Array.isArray(perfData) ? (perfData.find((p: any) => p.id === b.id) || {}) : {};
      return {
        ...b,
        waste: perfItem.waste || '$0',
        saved: perfItem.saved || '$0',
        score: perfItem.score || 0,
        staff_count: b.staff_count || 0
      };
    });
    setBranches(mapped);
  }, [branchesData]);

  if (isLoading) setLoading(true);
  if (error) console.error('Branches fetch error', error);

  const openAdd = () => { setForm({ ...EMPTY, branch_code: `BR-${Date.now().toString().slice(-4)}` }); setEditId(null); setShowForm(true); };
  
  const openEdit = (b: Branch) => { 
    setForm({ ...b }); 
    setEditId(b.id); 
    setShowForm(true); 
  };

  const handleDelete = async (id: string) => { 
    if (confirm('Delete this branch?')) {
      try {
        await inventoryService.deleteBranch(id);
        fetchBranches();
      } catch (err) {
        alert('Failed to delete branch');
      }
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.address || !form.branch_code) return;
    try {
      if (editId) {
        await inventoryService.updateBranch(editId, form);
      } else {
        await inventoryService.addBranch(form);
      }
      fetchBranches();
      setShowForm(false); setEditId(null);
    } catch (err) {
      alert('Failed to save branch');
    }
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
            <div><label className="text-dim text-xs block mb-1">Status</label><select className="terminal-select w-full" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'UPDATE BRANCH' : 'CREATE BRANCH'}</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: 40 }}><span className="loading-text">SYNCING BRANCH DATA...</span></div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <h2>🏢 BRANCHES ({filtered.length})</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(b => (
              <div key={b.id} className="branch-card" style={{ padding: 20, border: '1px solid var(--border-glass)', borderLeft: `4px solid ${b.status === 'active' ? 'var(--success)' : 'var(--text-dim)'}`, background: 'var(--bg-card)', borderRadius: 8, opacity: b.status === 'inactive' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-glass)' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin className="text-primary" size={18} /> {b.name}
                  </h3>
                  <span className={b.status === 'active' ? 'text-success' : 'text-dim'} style={{ fontWeight: 700, fontSize: '0.8rem' }}>● {b.status.toUpperCase()}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.85rem', marginBottom: 16 }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}><strong className="text-main">Location:</strong> {b.address}, {b.city}</div>
                    <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}><strong className="text-main">Manager:</strong> {b.manager || 'Not Assigned'}</div>
                    <div style={{ color: 'var(--text-muted)' }}><strong className="text-main">Phone:</strong> {b.phone}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}><Users size={14} className="text-primary" /> <strong className="text-main">Staff:</strong> <span className="text-muted">{b.staff_count}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} className="text-primary" /> <strong className="text-main">Hours:</strong> <span className="text-muted">{b.opening_time} - {b.closing_time}</span></div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-glass)', borderRadius: 6, marginBottom: 16, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                  <span>Waste: <span className="text-primary">{b.waste}</span></span>
                  <span>Saved: <span className="text-primary">{b.saved}</span></span>
                  <span style={{ fontWeight: 800, color: (b.score || 0) >= 90 ? 'var(--success)' : (b.score || 0) >= 80 ? 'var(--warning)' : 'var(--danger)' }}>Score: {b.score}/100</span>
                </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn-secondary small" style={{ flex: 1 }} onClick={() => openEdit(b)}><Edit2 size={14} /> EDIT</button>
                <button className="btn-secondary small" style={{ flex: 1 }} onClick={() => navigate('/analytics')}><BarChart2 size={14} /> ANALYTICS</button>
                <button className="btn-secondary small text-danger" style={{ flex: 1 }} onClick={() => handleDelete(b.id)}><Trash2 size={14} /> DELETE</button>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={10}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </div>
      )}
    </div>
  );
};
