import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, AlertTriangle, Zap, DollarSign, TrendingUp, Users, Activity, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles, Loader2 } from 'lucide-react';
import { analyticsService, inventoryService } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(true);
  const [perf, setPerf] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalSaved: 0, totalWaste: 0, totalAlerts: 0, critAlerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, statsRes, perfRes] = await Promise.all([
        analyticsService.getDashboardSummary(),
        analyticsService.getNetworkStats(),
        analyticsService.getBranchPerformance()
      ]);
      setAiSummary(summaryRes.data);
      setStats(statsRes.data);
      setPerf(perfRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
      setLoadingAi(false);
    }
  };

  const activities = [
    { time: '10:32', branch: 'Nizami', staff: 'Aysel Əliyeva', action: 'Completed task: Stock check - Dairy', type: 'success' },
    { time: '10:15', branch: 'Fountain Sq', staff: 'Nicat İsmayılov', action: 'Logged waste: 12 units Bread', type: 'warning' },
    { time: '09:45', branch: 'Nizami', staff: 'Leyla Məmmədova', action: 'Approved transfer: 30 units Milk → Fountain Sq', type: 'info' },
    { time: '09:30', branch: 'White City', staff: 'Rəşad Quliyev', action: 'Resolved alert: 25% discount on Cheddar Cheese', type: 'success' },
    { time: '09:15', branch: 'Gənclik', staff: 'Günel Hüseynova', action: 'Clocked in - Morning shift', type: 'info' },
    { time: '08:45', branch: 'Nizami', staff: 'Əli Həsənov', action: 'Received PO-001234 from Dairy Fresh Co', type: 'info' },
  ];

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

      {/* AI Summary Section */}
      <div className="panel border-primary" style={{ marginTop: 20, background: 'rgba(var(--primary-rgb), 0.05)' }}>
        <div className="panel-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
            <Sparkles size={18} /> BRAVOOS AI INSIGHTS
          </h2>
          {loadingAi && <Loader2 className="animate-spin text-primary" size={18} />}
        </div>
        {aiSummary ? (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.5', margin: 0, fontWeight: 500 }}>{aiSummary.summary_text}</p>
              <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: '0.85rem' }}>
                {aiSummary.actionable_items.map((item: string, i: number) => (
                  <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-glass)', paddingLeft: 20 }}>
              <div className="text-dim" style={{ fontSize: '0.65rem', fontWeight: 800, marginBottom: 4 }}>SYSTEM HEALTH</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: aiSummary.system_health_score > 80 ? 'var(--success)' : 'var(--warning)' }}>
                {aiSummary.system_health_score}%
              </div>
              <div className="progress-bar" style={{ height: 6 }}>
                <div className="progress" style={{ width: `${aiSummary.system_health_score}%`, background: 'var(--success)' }} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted">AI is analyzing current network operations...</p>
        )}
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginTop: 20 }}>
        <div className="kpi-card panel">
          <div className="kpi-header"><Zap size={20} className="text-primary" /><h3>NETWORK SAVED</h3></div>
          <div className="kpi-value text-primary">${stats.totalSaved.toLocaleString()}</div>
          <div className="kpi-trend positive"><ArrowUpRight size={14} /> +12% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><DollarSign size={20} className="text-warning" /><h3>TOTAL WASTE</h3></div>
          <div className="kpi-value text-warning">${stats.totalWaste.toLocaleString()}</div>
          <div className="kpi-trend positive"><ArrowDownRight size={14} /> -8% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><AlertTriangle size={20} className="text-danger" /><h3>ACTIVE ALERTS</h3></div>
          <div className="kpi-value text-danger">{stats.totalAlerts}</div>
          <div className="kpi-trend negative">!!! {stats.critAlerts} CRITICAL</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><TrendingUp size={20} className="text-primary" /><h3>AVG FEFO SCORE</h3></div>
          <div className="kpi-value">{aiSummary?.system_health_score || 89}%</div>
          <div className="progress-bar mt-2"><div className="progress" style={{ width: `${aiSummary?.system_health_score || 89}%`, background: 'var(--primary)' }} /></div>
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
              {perf.map((b, i) => (
                <tr key={i} onClick={() => navigate('/branches')} style={{ cursor: 'pointer' }}>
                  <td className="font-bold text-main">{b.name}</td>
                  <td className="text-warning" style={{ fontFamily: 'var(--font-mono)' }}>{b.waste}</td>
                  <td className="text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{b.saved}</td>
                  <td>
                    <span>{b.alerts}</span>
                    {b.crit > 0 && <span className="text-danger" style={{ marginLeft: 6, fontWeight: 800 }}>({b.crit}⚠)</span>}
                  </td>
                  <td className="text-muted">{b.actions || 0} executed</td>
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
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.totalStaff || 0}</div>
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>{Math.ceil((stats.totalStaff || 0) * 0.7)} on shift now</div>
        </div>
        <div className="panel" style={{ padding: 16, textAlign: 'center' }}>
          <Building size={20} className="text-primary" style={{ marginBottom: 8 }} />
          <div className="text-dim" style={{ fontSize: '0.6rem', fontWeight: 800, marginBottom: 4 }}>BRANCHES</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.totalBranches || 0}</div>
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
