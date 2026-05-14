import React, { useState } from 'react';
import { Search, UserPlus, Shield, Edit2, Trash2, X, Key } from 'lucide-react';
import './Users.css';

interface User {
  id: number; name: string; email: string; role: 'ADMIN' | 'MANAGER' | 'STAFF';
  branch: string; phone: string; status: 'Active' | 'Inactive'; lastLogin: string;
}

const INIT: User[] = [
  { id: 1, name: 'Əli Həsənov', email: 'ali@bravoos.az', role: 'ADMIN', branch: 'HQ', phone: '+994 50 123 4567', status: 'Active', lastLogin: 'Just now' },
  { id: 2, name: 'Leyla Məmmədova', email: 'leyla@bravoos.az', role: 'MANAGER', branch: 'Nizami Store', phone: '+994 50 234 5678', status: 'Active', lastLogin: '2 mins ago' },
  { id: 3, name: 'Rəşad Quliyev', email: 'rashad@bravoos.az', role: 'MANAGER', branch: 'Fountain Square', phone: '+994 50 345 6789', status: 'Active', lastLogin: '15 mins ago' },
  { id: 4, name: 'Aysel Əliyeva', email: 'aysel@bravoos.az', role: 'STAFF', branch: 'Nizami Store', phone: '+994 50 456 7890', status: 'Active', lastLogin: '1 hour ago' },
  { id: 5, name: 'Nicat İsmayılov', email: 'nicat@bravoos.az', role: 'STAFF', branch: 'Fountain Square', phone: '+994 50 567 8901', status: 'Active', lastLogin: '30 mins ago' },
  { id: 6, name: 'Günel Hüseynova', email: 'gunel@bravoos.az', role: 'STAFF', branch: 'White City', phone: '+994 50 678 9012', status: 'Inactive', lastLogin: '5 days ago' },
];

const EMPTY: Omit<User, 'id'> = { name: '', email: '', role: 'STAFF', branch: 'Nizami Store', phone: '', status: 'Active', lastLogin: 'Never' };

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INIT);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<User, 'id'>>(EMPTY);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (u: User) => { 
    setForm({ 
      name: u.name, email: u.email, role: u.role, branch: u.branch, 
      phone: u.phone, status: u.status, lastLogin: u.lastLogin 
    }); 
    setEditId(u.id); 
    setShowForm(true); 
  };
  const handleDelete = (id: number) => { if (confirm('Delete this user?')) setUsers(users.filter(u => u.id !== id)); };
  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editId) {
      setUsers(users.map(u => u.id === editId ? { ...form, id: editId } : u));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    setShowForm(false); setEditId(null);
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleBadge = (r: string) => r === 'ADMIN' ? 'badge badge-danger' : r === 'MANAGER' ? 'badge badge-warning' : 'badge badge-success';

  return (
    <div className="users-container page-container terminal-ui">
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div className="input-with-icon" style={{ flex: 2, minWidth: 200 }}>
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search users by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="terminal-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ minWidth: 120 }}>
          <option>All</option><option>ADMIN</option><option>MANAGER</option><option>STAFF</option>
        </select>
        <button className="btn-primary" onClick={openAdd}><UserPlus size={16} /> CREATE USER</button>
      </div>

      {showForm && (
        <div className="panel mb-4">
          <div className="panel-header">
            <h2>{editId ? '✏️ EDIT USER' : '➕ CREATE NEW USER'}</h2>
            <button className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div><label className="text-dim text-xs block mb-1">Full Name</label><input className="terminal-input w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Email</label><input type="email" className="terminal-input w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Role</label><select className="terminal-select w-full" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}><option>ADMIN</option><option>MANAGER</option><option>STAFF</option></select></div>
            <div><label className="text-dim text-xs block mb-1">Branch</label><select className="terminal-select w-full" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}><option>HQ</option><option>Nizami Store</option><option>Fountain Square</option><option>White City</option></select></div>
            <div><label className="text-dim text-xs block mb-1">Phone</label><input className="terminal-input w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Status</label><select className="terminal-select w-full" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}><option>Active</option><option>Inactive</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'UPDATE USER' : 'CREATE USER'}</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h2>👥 USER MANAGEMENT ({filtered.length} users)</h2>
        </div>
        <div className="table-responsive">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Branch</th><th>Phone</th><th>Status</th><th>Last Login</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ opacity: u.status === 'Inactive' ? 0.5 : 1 }}>
                  <td className="font-bold text-main">{u.name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td><span className={roleBadge(u.role)}>{u.role === 'ADMIN' && <Shield size={10} style={{ display: 'inline', marginRight: 4 }} />}{u.role}</span></td>
                  <td>{u.branch}</td>
                  <td className="text-muted">{u.phone}</td>
                  <td><span className={u.status === 'Active' ? 'text-success' : 'text-dim'} style={{ fontWeight: 700 }}>● {u.status}</span></td>
                  <td className="text-dim">{u.lastLogin}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-icon small" title="Edit" onClick={() => openEdit(u)}><Edit2 size={14} /></button>
                      <button className="btn-icon small" title="Reset Password"><Key size={14} /></button>
                      <button className="btn-icon small text-danger" title="Delete" onClick={() => handleDelete(u.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-glass)' }}>
          <div className="text-sm text-muted">Showing {filtered.length} of {users.length} users</div>
        </div>
      </div>
    </div>
  );
};
