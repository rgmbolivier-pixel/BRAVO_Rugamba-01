import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, Plus, Edit2, Trash2, X, Package, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { canAccessManagerOps, canAccessTransfers } from '../../utils/roleAccess';
import './Inventory.css';

interface Product {
  id: number; name: string; sku: string; category: string;
  qty: number; unit: string; cost: number; expiry: string;
  location: string; status: 'In Stock' | 'Low Stock' | 'Expiring' | 'Expired';
}

const INIT_PRODUCTS: Product[] = [
  { id: 1, name: '2% Milk', sku: 'DRY-001', category: 'Dairy', qty: 45, unit: 'units', cost: 2.50, expiry: '2024-12-17', location: 'Cooler A', status: 'Expiring' },
  { id: 2, name: 'Whole Milk', sku: 'DRY-002', category: 'Dairy', qty: 32, unit: 'units', cost: 2.50, expiry: '2024-12-25', location: 'Cooler A', status: 'In Stock' },
  { id: 3, name: 'Greek Yogurt', sku: 'DRY-003', category: 'Dairy', qty: 89, unit: 'units', cost: 3.00, expiry: '2024-12-28', location: 'Cooler A', status: 'In Stock' },
  { id: 4, name: 'Cheddar Cheese', sku: 'DRY-004', category: 'Dairy', qty: 23, unit: 'units', cost: 5.00, expiry: '2024-12-20', location: 'Cooler B', status: 'Expiring' },
  { id: 5, name: 'Lettuce', sku: 'PRD-001', category: 'Produce', qty: 45, unit: 'units', cost: 1.80, expiry: '2024-12-18', location: 'Cooler B', status: 'Expiring' },
  { id: 6, name: 'Tomatoes', sku: 'PRD-002', category: 'Produce', qty: 67, unit: 'units', cost: 2.20, expiry: '2024-12-21', location: 'Cooler B', status: 'In Stock' },
  { id: 7, name: 'Cucumbers', sku: 'PRD-003', category: 'Produce', qty: 34, unit: 'units', cost: 1.50, expiry: '2024-12-19', location: 'Cooler B', status: 'Expiring' },
  { id: 8, name: 'Sourdough Bread', sku: 'BKR-001', category: 'Bakery', qty: 18, unit: 'units', cost: 4.50, expiry: '2024-12-19', location: 'Shelf A', status: 'Low Stock' },
  { id: 9, name: 'Eggs (Dozen)', sku: 'DRY-005', category: 'Dairy', qty: 12, unit: 'dozen', cost: 3.50, expiry: '2024-12-30', location: 'Cooler A', status: 'Low Stock' },
  { id: 10, name: 'Butter', sku: 'DRY-006', category: 'Dairy', qty: 8, unit: 'units', cost: 4.00, expiry: '2025-01-05', location: 'Cooler A', status: 'Low Stock' },
];

const EMPTY: Omit<Product, 'id'> = { name: '', sku: '', category: 'Dairy', qty: 0, unit: 'units', cost: 0, expiry: '', location: 'Cooler A', status: 'In Stock' };

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role ?? 'STAFF';
  const goPurchaseOrders = () => navigate(canAccessManagerOps(role) ? '/purchase-orders' : '/receiving');

  const [products, setProducts] = useState<Product[]>(INIT_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);
  const [catFilter, setCatFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [scanMode, setScanMode] = useState(false);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setScanMode(false); };
  const openScan = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setScanMode(true); };
  const openEdit = (p: Product) => { setForm({ name: p.name, sku: p.sku, category: p.category, qty: p.qty, unit: p.unit, cost: p.cost, expiry: p.expiry, location: p.location, status: p.status }); setEditId(p.id); setShowForm(true); setScanMode(false); };
  const handleDelete = (id: number) => { if (confirm('Delete this product?')) setProducts(products.filter(p => p.id !== id)); };
  const handleSave = () => {
    if (!form.name || !form.sku) return;
    if (editId) {
      setProducts(products.map(p => p.id === editId ? { ...form, id: editId } : p));
    } else {
      setProducts([...products, { ...form, id: Date.now() }]);
    }
    setShowForm(false); setEditId(null); setScanMode(false);
  };

  const simulateScan = () => {
    setForm({ name: 'Organic Milk', sku: 'DRY-' + String(Math.floor(Math.random() * 900 + 100)), category: 'Dairy', qty: 48, unit: 'units', cost: 3.25, expiry: '2025-01-15', location: 'Cooler A', status: 'In Stock' });
    setScanMode(false);
  };

  const filtered = products.filter(p => {
    if (catFilter !== 'All' && p.category !== catFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const isAlertStatus = (s: string) => s === 'Expiring' || s === 'Expired' || s === 'Low Stock';
  const expiringCount = products.filter(p => p.status === 'Expiring' || p.status === 'Expired').length;
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;

  return (
    <div className="inventory-container page-container terminal-ui">
      <div className="search-bar panel mb-4">
        <div className="input-with-icon w-full">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search product by name/SKU/barcode..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filters">
          <select className="terminal-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
            <option>All</option><option>Dairy</option><option>Produce</option><option>Bakery</option>
          </select>
          <button type="button" className="btn-secondary" onClick={openScan}><Camera size={16} /> SCAN BARCODE</button>
          <button type="button" className="btn-primary" onClick={openAdd}><Plus size={16} /> ADD PRODUCT</button>
        </div>
      </div>

      {(expiringCount > 0 || lowStockCount > 0) && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {expiringCount > 0 && (
            <div onClick={() => navigate('/alerts')} style={{ flex: 1, minWidth: 200, padding: '12px 16px', background: 'rgba(255,0,60,0.08)', border: '1px solid var(--danger)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <AlertTriangle size={18} className="text-danger" />
              <span className="text-danger" style={{ fontWeight: 800, fontSize: '0.85rem' }}>⚠ {expiringCount} PRODUCTS EXPIRING — Click to take action in Alerts</span>
            </div>
          )}
          {lowStockCount > 0 && (
            <div onClick={goPurchaseOrders} style={{ flex: 1, minWidth: 200, padding: '12px 16px', background: 'rgba(250,204,21,0.08)', border: '1px solid var(--warning)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <AlertTriangle size={18} className="text-warning" />
              <span className="text-warning" style={{ fontWeight: 800, fontSize: '0.85rem' }}>⚠ {lowStockCount} LOW STOCK — Click to create PO</span>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="panel mb-4">
          <div className="panel-header">
            <h2>{editId ? '✏️ EDIT PRODUCT' : scanMode ? '📷 SCAN & ADD PRODUCT' : '➕ ADD NEW PRODUCT'}</h2>
            <button className="btn-icon" onClick={() => { setShowForm(false); setScanMode(false); }}><X size={18} /></button>
          </div>
          {scanMode && (
            <div style={{ textAlign: 'center', padding: '24px 0', marginBottom: 16, border: '2px dashed var(--primary)', borderRadius: 8, background: 'var(--bg-glass)' }}>
              <Camera size={48} style={{ color: 'var(--primary)', marginBottom: 12 }} />
              <div className="text-main" style={{ fontWeight: 700, marginBottom: 8 }}>Point camera at barcode or QR code</div>
              <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 16 }}>Product data will auto-fill from database</div>
              <button className="btn-primary" onClick={simulateScan} style={{ minWidth: 200 }}><Camera size={16} /> SIMULATE SCAN</button>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
            <div><label className="text-dim text-xs block mb-1">Product Name</label><input className="terminal-input w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">SKU / Barcode</label><input className="terminal-input w-full" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="Scan or type..." /></div>
            <div><label className="text-dim text-xs block mb-1">Category</label><select className="terminal-select w-full" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option>Dairy</option><option>Produce</option><option>Bakery</option></select></div>
            <div><label className="text-dim text-xs block mb-1">Quantity</label><input type="number" className="terminal-input w-full" value={form.qty} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} /></div>
            <div><label className="text-dim text-xs block mb-1">Unit</label><select className="terminal-select w-full" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}><option>units</option><option>kg</option><option>dozen</option><option>liters</option></select></div>
            <div><label className="text-dim text-xs block mb-1">Unit Cost ($)</label><input type="number" step="0.01" className="terminal-input w-full" value={form.cost} onChange={e => setForm({ ...form, cost: Number(e.target.value) })} /></div>
            <div><label className="text-dim text-xs block mb-1">Expiry Date</label><input type="date" className="terminal-input w-full" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Location</label><select className="terminal-select w-full" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}><option>Cooler A</option><option>Cooler B</option><option>Shelf A</option><option>Shelf B</option><option>Dry Storage</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}</button>
            <button className="btn-secondary" onClick={() => { setShowForm(false); setScanMode(false); }}>CANCEL</button>
          </div>
        </div>
      )}

      <div className="panel mb-4">
        <div className="panel-header">
          <h2><Package size={18} className="text-primary" style={{ display: 'inline', marginRight: 8 }} />ALL INVENTORY ({filtered.length} products)</h2>
        </div>
        <div className="table-responsive">
          <table className="terminal-table">
            <thead>
              <tr><th>Product Name</th><th>SKU</th><th>Category</th><th>Qty</th><th>Unit</th><th>Cost</th><th>Expiry Date</th><th>Location</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ background: p.status === 'Expiring' ? 'rgba(255,0,60,0.04)' : p.status === 'Low Stock' ? 'rgba(250,204,21,0.04)' : 'transparent' }}>
                  <td className="font-bold text-main">
                    {p.name}
                    {isAlertStatus(p.status) && <AlertTriangle size={12} className={p.status === 'Low Stock' ? 'text-warning' : 'text-danger'} style={{ marginLeft: 6, display: 'inline' }} />}
                  </td>
                  <td className="text-dim" style={{ fontFamily: 'var(--font-mono)' }}>{p.sku}</td>
                  <td>{p.category}</td>
                  <td className="font-bold" style={{ color: p.status === 'Low Stock' ? 'var(--warning)' : 'var(--text-main)' }}>{p.qty}</td>
                  <td className="text-muted">{p.unit}</td>
                  <td className="text-main" style={{ fontFamily: 'var(--font-mono)' }}>${p.cost.toFixed(2)}</td>
                  <td className={p.status === 'Expiring' || p.status === 'Expired' ? 'text-warning' : 'text-muted'}>{p.expiry}</td>
                  <td className="text-muted">{p.location}</td>
                  <td>
                    {(p.status === 'Expiring' || p.status === 'Expired') ? (
                      <button onClick={() => navigate('/alerts')} style={{ background: 'rgba(255,0,60,0.1)', border: '1px solid var(--danger)', borderRadius: 4, padding: '4px 10px', color: 'var(--danger)', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={12} /> {p.status.toUpperCase()}
                      </button>
                    ) : p.status === 'Low Stock' ? (
                      <button onClick={goPurchaseOrders} style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid var(--warning)', borderRadius: 4, padding: '4px 10px', color: 'var(--warning)', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={12} /> LOW STOCK
                      </button>
                    ) : (
                      <span className="text-success" style={{ fontWeight: 700, fontSize: '0.75rem' }}>● IN STOCK</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-icon small" title="Edit" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                      <button className="btn-icon small text-danger" title="Delete" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel border-danger">
        <div className="panel-header">
          <h2 className="text-danger" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} /> LOW STOCK ALERTS ({lowStockCount})</h2>
        </div>
        <ul className="low-stock-list">
          {products.filter(p => p.status === 'Low Stock').map(p => (
            <li key={p.id}>
              <div className="low-stock-info"><strong>{p.name}</strong> ({p.qty} {p.unit} left)</div>
              <div className="low-stock-action text-primary">→ Reorder recommended</div>
            </li>
          ))}
        </ul>
        <button type="button" className="btn-primary w-full mt-4" onClick={goPurchaseOrders}>GENERATE POs</button>
      </div>
    </div>
  );
};
