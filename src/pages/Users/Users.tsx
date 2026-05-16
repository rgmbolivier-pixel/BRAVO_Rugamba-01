import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Shield, Edit2, Trash2, X, Key } from 'lucide-react';
import { userService, inventoryService } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '../../components/Pagination';
import './Users.css';

interface User {
  id: string; first_name: string; last_name: string; email: string; role: 'admin' | 'manager' | 'staff';
  branch: string; branch_name?: string; phone: string; status: 'active' | 'inactive'; last_login: string;
}

const EMPTY: any = { first_name: '', last_name: '', email: '', role: 'staff', branch: '', phone: '', status: 'active' };

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [roleFilter, setRoleFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // keep existing signature; data loaded by react-query
  }, [currentPage]);

  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: async () => {
      const res = await userService.getUsers({ page: currentPage });
      return res.data;
    },
    placeholderData: (prev) => prev
  });

  const { data: branchesData, isLoading: branchesLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const res = await inventoryService.getBranches();
      return res.data;
    }
  });

  useEffect(() => {
    if (usersData) {
      if (usersData.results) {
        setUsers(usersData.results);
        setTotalCount(usersData.count);
      } else {
        setUsers(usersData);
        setTotalCount(usersData.length);
      }
    }
    if (branchesData) {
      setBranches(Array.isArray(branchesData) ? branchesData : (branchesData.results || []));
    }
    setLoading(Boolean(usersLoading || branchesLoading));
    if (usersError) console.error('Failed to fetch user data', usersError);
  }, [usersData, branchesData, usersLoading, branchesLoading, usersError]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  
  const openEdit = (u: User) => { 
    setForm({ ...u }); 
    setEditId(u.id); 
    setShowForm(true); 
  };

  const handleDelete = async (id: string) => { 
    if (confirm('Delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleSave = async () => {
    if (!form.email || !form.first_name) return;
    try {
      if (editId) {
        await userService.updateUser(editId, form);
      } else {
        await userService.createUser(form);
      }
      fetchData();
      setShowForm(false); setEditId(null);
    } catch (err) {
      alert('Failed to save user');
    }
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    if (search && !fullName.includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const roleBadge = (r: string) => r.toLowerCase() === 'admin' ? 'badge badge-danger' : r.toLowerCase() === 'manager' ? 'badge badge-warning' : 'badge badge-success';

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
            <div><label className="text-dim text-xs block mb-1">First Name</label><input className="terminal-input w-full" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Last Name</label><input className="terminal-input w-full" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Email</label><input type="email" className="terminal-input w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Role</label><select className="terminal-select w-full" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}><option value="admin">ADMIN</option><option value="manager">MANAGER</option><option value="staff">STAFF</option></select></div>
            <div><label className="text-dim text-xs block mb-1">Branch</label><select className="terminal-select w-full" value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}><option value="">Select Branch</option>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
            <div><label className="text-dim text-xs block mb-1">Phone</label><input className="terminal-input w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="text-dim text-xs block mb-1">Status</label><select className="terminal-select w-full" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="btn-primary" onClick={handleSave}>{editId ? 'UPDATE USER' : 'CREATE USER'}</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>CANCEL</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="panel" style={{ textAlign: 'center', padding: 40 }}><span className="loading-text">SYNCING USER DIRECTORY...</span></div>
      ) : (
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
                  <tr key={u.id} style={{ opacity: u.status === 'inactive' ? 0.5 : 1 }}>
                    <td className="font-bold text-main">{u.first_name} {u.last_name}</td>
                    <td className="text-muted">{u.email}</td>
                    <td><span className={roleBadge(u.role)}>{u.role === 'admin' && <Shield size={10} style={{ display: 'inline', marginRight: 4 }} />}{u.role.toUpperCase()}</span></td>
                    <td>{u.branch_name || 'N/A'}</td>
                    <td className="text-muted">{u.phone}</td>
                    <td><span className={u.status === 'active' ? 'text-success' : 'text-dim'} style={{ fontWeight: 700 }}>● {u.status.toUpperCase()}</span></td>
                    <td className="text-dim">{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
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
        </div>
      )}
        <Pagination 
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={10}
          onPageChange={setCurrentPage}
          loading={loading}
        />
    </div>
  );
};
