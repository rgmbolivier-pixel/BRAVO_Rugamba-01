import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, AlertTriangle, Zap, DollarSign, TrendingUp, Users, Activity, Clock, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const branches = [
    { name: 'Nizami Store', waste: '$1,240', saved: '$3,450', alerts: 12, crit: 3, actions: 45, score: 94, trend: 'up' },
    { name: 'Fountain Square', waste: '$1,890', saved: '$2,100', alerts: 8, crit: 1, actions: 32, score: 88, trend: 'down' },
    { name: 'White City', waste: '$2,340', saved: '$1,800', alerts: 15, crit: 5, actions: 28, score: 76, trend: 'down' },
    { name: 'Gənclik Mall', waste: '$890', saved: '$4,200', alerts: 6, crit: 0, actions: 52, score: 97, trend: 'up' },
  ];

  const activities = [
    { time: '10:32', branch: 'Nizami', staff: 'Aysel Əliyeva', action: 'Completed task: Stock check - Dairy', type: 'success' },
    { time: '10:15', branch: 'Fountain Sq', staff: 'Nicat İsmayılov', action: 'Logged waste: 12 units Bread', type: 'warning' },
    { time: '09:45', branch: 'Nizami', staff: 'Leyla Məmmədova', action: 'Approved transfer: 30 units Milk → Fountain Sq', type: 'info' },
    { time: '09:30', branch: 'White City', staff: 'Rəşad Quliyev', action: 'Resolved alert: 25% discount on Cheddar Cheese', type: 'success' },
    { time: '09:15', branch: 'Gənclik', staff: 'Günel Hüseynova', action: 'Clocked in - Morning shift', type: 'info' },
    { time: '08:45', branch: 'Nizami', staff: 'Əli Həsənov', action: 'Received PO-001234 from Dairy Fresh Co', type: 'info' },
  ];

  const totalSaved = 45230; const totalWaste = 12450; const totalAlerts = 47; const critAlerts = 12;

  return (
    <div className="dashboard-container page-container terminal-ui">
      {/* Header */}
      <header className="page-header glow-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>HQ ADMIN DASHBOARD</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Network Overview</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary small" onClick={() => navigate('/analytics')}><BarChart3 size={14} /> ANALYTICS</button>
          <button className="btn-secondary small" onClick={() => navigate('/branches')}><Building size={14} /> BRANCHES</button>
        </div>
      </header>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <div className="kpi-card panel">
          <div className="kpi-header"><Zap size={20} className="text-primary" /><h3>NETWORK SAVED</h3></div>
          <div className="kpi-value text-primary">${totalSaved.toLocaleString()}</div>
          <div className="kpi-trend positive"><ArrowUpRight size={14} /> +12% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><DollarSign size={20} className="text-warning" /><h3>TOTAL WASTE</h3></div>
          <div className="kpi-value text-warning">${totalWaste.toLocaleString()}</div>
          <div className="kpi-trend positive"><ArrowDownRight size={14} /> -8% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><AlertTriangle size={20} className="text-danger" /><h3>ACTIVE ALERTS</h3></div>
          <div className="kpi-value text-danger">{totalAlerts}</div>
          <div className="kpi-trend negative">!!! {critAlerts} CRITICAL</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><TrendingUp size={20} className="text-primary" /><h3>AVG FEFO SCORE</h3></div>
          <div className="kpi-value">89%</div>
          <div className="progress-bar mt-2"><div className="progress" style={{ width: '89%', background: 'var(--primary)' }} /></div>
        </div>
      </div>

      {/* Branch Performance Table */}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Building size={18} className="text-primary" /> BRANCH PERFORMANCE SUMMARY</h2>
          <button className="btn-secondary small" onClick={() => navigate('/branches')}>VIEW ALL</button>
        </div>
        <div className="table-responsive">
          <table className="terminal-table">
            <thead>
              <tr><th>Branch</th><th>Waste $</th><th>Saved $</th><th>Alerts</th><th>Actions</th><th>Score</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {branches.map((b, i) => (
                <tr key={i} onClick={() => navigate('/branches')} style={{ cursor: 'pointer' }}>
                  <td className="font-bold text-main">{b.name}</td>
                  <td className="text-warning" style={{ fontFamily: 'var(--font-mono)' }}>{b.waste}</td>
                  <td className="text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{b.saved}</td>
                  <td>
                    <span>{b.alerts}</span>
                    {b.crit > 0 && <span className="text-danger" style={{ marginLeft: 6, fontWeight: 800 }}>({b.crit}⚠)</span>}
                  </td>
                  <td className="text-muted">{b.actions} executed</td>
                  <td>
                    <span style={{ fontWeight: 800, color: b.score >= 90 ? 'var(--success)' : b.score >= 80 ? 'var(--warning)' : 'var(--danger)' }}>{b.score}/100</span>
                  </td>
                  <td>
                    {b.trend === 'up' ? <ArrowUpRight size={16} className="text-success" /> : <ArrowDownRight size={16} className="text-danger" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Activity Log */}
      <div className="panel" style={{ marginTop: 20 }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={18} className="text-primary" /> RECENT STAFF ACTIVITIES (ALL BRANCHES)</h2>
        </div>
        <div className="system-log" style={{ height: 'auto', maxHeight: 300 }}>
          {activities.map((a, i) => (
            <div className="log-entry" key={i} style={{ padding: '8px 0', borderBottom: '1px dashed var(--border-glass)' }}>
              <span className="log-time" style={{ minWidth: 50 }}>[{a.time}]</span>
              <span style={{ color: 'var(--primary)', fontWeight: 800, minWidth: 90, fontSize: '0.75rem' }}>{a.branch}</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 700, minWidth: 130 }}>{a.staff}</span>
              <span className={a.type === 'success' ? 'log-success' : a.type === 'warning' ? 'log-error' : 'log-info'}>{a.action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>
        <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
          <Users size={20} className="text-primary" style={{ marginBottom: 8 }} />
          <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 4 }}>TOTAL STAFF</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>48</div>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>32 on shift now</div>
        </div>
        <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
          <Building size={20} className="text-primary" style={{ marginBottom: 8 }} />
          <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 4 }}>BRANCHES</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>4</div>
          <div className="text-success" style={{ fontSize: '0.7rem' }}>All operational</div>
        </div>
        <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
          <Clock size={20} className="text-primary" style={{ marginBottom: 8 }} />
          <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 4 }}>AVG RESPONSE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>14m</div>
          <div className="text-primary" style={{ fontSize: '0.7rem' }}>to resolve alerts</div>
        </div>
        <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
          <TrendingUp size={20} className="text-primary" style={{ marginBottom: 8 }} />
          <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 4 }}>RESOLUTION RATE</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>94%</div>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>↑ 3% this week</div>
        </div>
      </div>
    </div>
  );
};
