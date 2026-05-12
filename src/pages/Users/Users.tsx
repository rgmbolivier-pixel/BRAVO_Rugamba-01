import React from 'react';
import { Search, UserPlus, Shield, Edit2, Trash2, Mail, Key } from 'lucide-react';
import './Users.css'; // Let's just rely on global styles if no custom css needed

export const Users: React.FC = () => {
  return (
    <div className="users-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <div className="input-with-icon flex-2">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search users by name, email, or role..." />
        </div>
        <div className="filters flex-1 flex gap-2">
          <select className="terminal-select flex-1">
            <option>Role: All</option>
            <option>ADMIN</option>
            <option>MANAGER</option>
            <option>STAFF</option>
          </select>
          <select className="terminal-select flex-1">
            <option>Branch: All</option>
            <option>HQ</option>
            <option>Downtown Store</option>
            <option>Uptown Store</option>
          </select>
        </div>
        <button className="btn-primary"><UserPlus size={16} className="mr-1" /> ADD USER</button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>👥 USER MANAGEMENT (48 total)</h2>
        </div>
        <table className="terminal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Branch</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold text-main">John Admin</td>
              <td className="text-muted">admin@bravoos.com</td>
              <td><span className="badge badge-danger"><Shield size={10} className="inline mr-1" /> ADMIN</span></td>
              <td>HQ</td>
              <td><span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Active</span></td>
              <td className="text-dim">Just now</td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-icon small" title="Edit"><Edit2 size={14} /></button>
                  <button className="btn-icon small" title="Reset Password"><Key size={14} /></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="font-bold text-main">Jane Smith</td>
              <td className="text-muted">manager@downtown.com</td>
              <td><span className="badge badge-warning">MANAGER</span></td>
              <td>Downtown Store</td>
              <td><span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Active</span></td>
              <td className="text-dim">2 mins ago</td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-icon small" title="Edit"><Edit2 size={14} /></button>
                  <button className="btn-icon small" title="Reset Password"><Key size={14} /></button>
                  <button className="btn-icon small text-danger" title="Deactivate"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="font-bold text-main">Sarah Staff</td>
              <td className="text-muted">staff@downtown.com</td>
              <td><span className="badge badge-success">STAFF</span></td>
              <td>Downtown Store</td>
              <td><span className="text-success flex items-center gap-1"><span className="status-dot online"></span> Active</span></td>
              <td className="text-dim">15 mins ago</td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-icon small" title="Edit"><Edit2 size={14} /></button>
                  <button className="btn-icon small" title="Reset Password"><Key size={14} /></button>
                  <button className="btn-icon small text-danger" title="Deactivate"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
            <tr className="opacity-50">
              <td className="font-bold text-main">Mike Johnson</td>
              <td className="text-muted">mike@uptown.com</td>
              <td><span className="badge badge-warning">MANAGER</span></td>
              <td>Uptown Store</td>
              <td><span className="text-dim flex items-center gap-1">Inactive</span></td>
              <td className="text-dim">5 days ago</td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-icon small" title="Edit"><Edit2 size={14} /></button>
                  <button className="btn-secondary small px-2 py-1">ACTIVATE</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="flex justify-between items-center mt-4 border-t border-glass pt-4">
          <div className="text-sm text-muted">Showing 1-4 of 48 users</div>
          <div className="flex gap-2">
            <button className="btn-secondary small" disabled>PREV</button>
            <button className="btn-secondary small">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};
