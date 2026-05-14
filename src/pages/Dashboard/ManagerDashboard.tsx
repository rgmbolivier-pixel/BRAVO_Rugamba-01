import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Zap, Users, Clock, CheckSquare, Target, DollarSign, MessageSquare, Coffee, ArrowUpRight, ArrowDownRight, ShieldAlert } from 'lucide-react';
import { userService, taskService } from '../../services/api';

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [breakApproved, setBreakApproved] = useState<Record<number, boolean>>({});

  const [staff, setStaff] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, tasksRes] = await Promise.all([
        userService.getUsers(),
        taskService.getTasks()
      ]);
      setStaff(Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data.results || []));
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : (tasksRes.data.results || []));
    } catch (err) {
      console.error('Failed to fetch manager dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = [
    { id: 1, staff: 'Günel Hüseynova', type: 'break', detail: 'Requested break at 11:30 AM', time: '10:28 AM' },
    { id: 2, staff: 'Nicat İsmayılov', type: 'issue', detail: 'Reported: Cooler A temperature at 8°C (should be 4°C)', time: '10:15 AM' },
  ];

  const statusColor = (s: string) => s === 'on-shift' ? 'var(--success)' : s === 'on-break' ? 'var(--warning)' : 'var(--text-dim)';
  const statusLabel = (s: string) => s === 'on-shift' ? '● On Shift' : s === 'on-break' ? '◐ On Break' : '○ Off Shift';

  return (
    <div className="dashboard-container page-container terminal-ui">
      {/* Header */}
      <header className="page-header glow-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>STORE MANAGER DASHBOARD</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Nizami Store — Downtown</div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800 }}>SHIFT</div>
            <div style={{ fontWeight: 800 }}>Morning (4 staff)</div>
          </div>
          <div style={{ width: 1, height: 30, background: 'var(--border-glass)' }} />
          <div style={{ textAlign: 'right' }}>
            <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800 }}>WASTE TARGET</div>
            <div className="text-primary" style={{ fontWeight: 800 }}>92%</div>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <div className="kpi-card panel">
          <div className="kpi-header"><Zap size={20} className="text-primary" /><h3>SAVED THIS MONTH</h3></div>
          <div className="kpi-value text-primary">$3,450</div>
          <div className="kpi-trend positive"><ArrowUpRight size={14} /> +8% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><DollarSign size={20} className="text-warning" /><h3>WASTE THIS MONTH</h3></div>
          <div className="kpi-value text-warning">$1,240</div>
          <div className="kpi-trend positive"><ArrowDownRight size={14} /> -12% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><ShieldAlert size={20} className="text-danger" /><h3>ACTIVE ALERTS</h3></div>
          <div className="kpi-value text-danger">12</div>
          <div className="kpi-trend negative">!!! 3 CRITICAL</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><Target size={20} className="text-primary" /><h3>FEFO SCORE</h3></div>
          <div className="kpi-value">94%</div>
          <div className="progress-bar mt-2"><div className="progress" style={{ width: '94%', background: 'var(--primary)' }} /></div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="panel" style={{ marginTop: 20, borderLeft: '3px solid var(--danger)' }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} className="text-danger" /> CRITICAL ALERTS — NEED ACTION NOW</h2>
          <button className="btn-secondary small" onClick={() => navigate('/alerts')}>VIEW ALL ALERTS</button>
        </div>
        <div className="alert-list">
          <div className="alert-card critical">
            <div className="alert-info">
              <h4>🥛 2% MILK</h4>
              <p>Expires TODAY at 10:00 PM (8h left) | 45 units at risk | Est. Loss: $135</p>
              <div className="ai-rec text-primary"><Zap size={14} /> AI: 30% discount predicted to sell 90%</div>
            </div>
            <div className="alert-actions">
              <button className="btn-primary small" onClick={() => navigate('/alerts')}>TAKE ACTION</button>
            </div>
          </div>
          <div className="alert-card critical">
            <div className="alert-info">
              <h4>🍞 SOURDOUGH BREAD</h4>
              <p>Expires in 18 HOURS | 28 units at risk | Est. Loss: $42</p>
              <div className="ai-rec text-primary"><Zap size={14} /> AI: Transfer to Fountain Square (high demand)</div>
            </div>
            <div className="alert-actions">
              <button className="btn-primary small" onClick={() => navigate('/alerts')}>TAKE ACTION</button>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Users size={18} className="text-primary" /> MY STAFF — TODAY'S ACTIVITIES</h2>
        </div>
        <div className="table-responsive">
          <table className="terminal-table">
            <thead>
              <tr><th>Staff</th><th>Status</th><th>Today's Tasks</th><th>Actions Taken</th></tr>
            </thead>
            <tbody>
              {staff.map(s => {
                const staffTasks = tasks.filter(t => t.assigned_to === s.id);
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="font-bold text-main">{s.first_name} {s.last_name}</div>
                      {s.last_login && <div className="text-dim" style={{ fontSize: '0.7rem' }}>Last login: {new Date(s.last_login).toLocaleTimeString()}</div>}
                    </td>
                    <td><span style={{ color: statusColor(s.status), fontWeight: 800, fontSize: '0.8rem' }}>{statusLabel(s.status)}</span></td>
                    <td>
                      {staffTasks.slice(0, 2).map((t, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', marginBottom: 2 }}>
                          <span>{t.status === 'completed' ? '✅' : '🔄'} {t.title}</span>
                        </div>
                      ))}
                      {staffTasks.length > 2 && <div className="text-xs text-dim">+{staffTasks.length - 2} more</div>}
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.8rem' }}>
                      <span className="text-dim">Tracking actions...</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <button className="btn-secondary small" onClick={() => navigate('/tasks')}><CheckSquare size={14} /> REVIEW TASKS</button>
          <button className="btn-secondary small"><MessageSquare size={14} /> MESSAGE STAFF</button>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="panel" style={{ marginTop: 20, borderLeft: '3px solid var(--warning)' }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={18} className="text-warning" /> PENDING REQUESTS FROM STAFF</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pendingRequests.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--bg-glass)', borderRadius: 8, border: '1px solid var(--border-glass)', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{r.staff}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{r.detail}</div>
                <div className="text-dim" style={{ fontSize: '0.7rem', marginTop: 4 }}>{r.time}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {r.type === 'break' ? (
                  breakApproved[r.id] ? (
                    <span className="text-success" style={{ fontWeight: 800 }}>✅ APPROVED</span>
                  ) : (
                    <>
                      <button className="btn-primary small" onClick={() => setBreakApproved({ ...breakApproved, [r.id]: true })}><Coffee size={14} /> APPROVE</button>
                      <button className="btn-secondary small" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>DENY</button>
                    </>
                  )
                ) : (
                  <button className="btn-secondary small" onClick={() => navigate('/alerts')}>VIEW ISSUE</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
