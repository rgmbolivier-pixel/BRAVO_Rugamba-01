import React, { useState } from 'react';
import { Search, Download, TrendingUp, Package, DollarSign, AlertTriangle, Activity, Building } from 'lucide-react';
import './AllActivities.css';

interface BranchSummary {
  name: string;
  onShift: string;
  tasksDone: number;
  wasteLogged: string;
  actionsTaken: number;
  efficiency: number;
}

interface ActivityLog {
  time: string;
  branch: string;
  staff: string;
  action: string;
  type: 'task' | 'waste' | 'transfer' | 'clock' | 'break' | 'issue';
}

export const AllActivities: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('24h');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const branchSummaries: BranchSummary[] = [
    { name: 'Downtown',  onShift: '5/8', tasksDone: 23, wasteLogged: '67u ($168)', actionsTaken: 12, efficiency: 94 },
    { name: 'Uptown',    onShift: '4/6', tasksDone: 18, wasteLogged: '45u ($112)', actionsTaken: 8,  efficiency: 88 },
    { name: 'Northside', onShift: '3/5', tasksDone: 12, wasteLogged: '89u ($223)', actionsTaken: 5,  efficiency: 82 },
    { name: 'Westside',  onShift: '2/4', tasksDone: 9,  wasteLogged: '34u ($85)',  actionsTaken: 4,  efficiency: 75 },
    { name: 'Eastside',  onShift: '3/6', tasksDone: 11, wasteLogged: '56u ($140)', actionsTaken: 6,  efficiency: 68 }
  ];

  const activities: ActivityLog[] = [
    { time: '10:32', branch: 'Downtown',  staff: 'Sarah Lee',   action: 'Completed task: Stock check',          type: 'task' },
    { time: '10:15', branch: 'Uptown',    staff: 'Mike Johnson', action: 'Logged waste: 12 units Bread',         type: 'waste' },
    { time: '09:45', branch: 'Downtown',  staff: 'Jane Smith',   action: 'Approved transfer: 30 units Milk',     type: 'transfer' },
    { time: '09:30', branch: 'Northside', staff: 'Tom Brown',    action: 'Clocked in — Morning shift',           type: 'clock' },
    { time: '09:15', branch: 'Downtown',  staff: 'Sarah Lee',    action: 'Requested break (APPROVED)',           type: 'break' },
    { time: '09:00', branch: 'Uptown',    staff: 'Lisa Wong',    action: 'Reported issue: Cooler temp',          type: 'issue' },
    { time: '08:45', branch: 'Westside',  staff: 'John Davis',   action: 'Completed task: FEFO rotation',        type: 'task' },
    { time: '08:30', branch: 'Eastside',  staff: 'Amy Chen',     action: 'Logged waste: 8 units Cheese',         type: 'waste' },
    { time: '08:15', branch: 'Downtown',  staff: 'Sarah Lee',    action: 'Clocked in — Morning shift',           type: 'clock' },
    { time: '08:00', branch: 'Northside', staff: 'Tom Brown',    action: 'Completed task: Temperature check',    type: 'task' }
  ];

  const typeIcon = (t: ActivityLog['type']) => {
    switch (t) {
      case 'task':     return '✅';
      case 'waste':    return '🗑️';
      case 'transfer': return '🚛';
      case 'clock':    return '⏰';
      case 'break':    return '☕';
      case 'issue':    return '⚠️';
    }
  };

  const typeClass = (t: ActivityLog['type']) => {
    switch (t) {
      case 'task':     return 'text-success';
      case 'waste':    return 'text-warning';
      case 'transfer': return 'text-primary';
      case 'clock':    return 'text-muted';
      case 'break':    return 'text-dim';
      case 'issue':    return 'text-danger';
    }
  };

  const filtered = activities.filter(a => {
    const matchSearch = a.staff.toLowerCase().includes(searchQuery.toLowerCase()) || a.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBranch = branchFilter === 'ALL' || a.branch === branchFilter;
    const matchType = typeFilter === 'ALL' || a.type === typeFilter;
    return matchSearch && matchBranch && matchType;
  });

  const efficiencyColor = (e: number) => e >= 90 ? 'text-success' : e >= 75 ? 'text-warning' : 'text-danger';

  return (
    <div className="all-activities-container page-container terminal-ui">
      <header className="page-header glow-panel mb-4">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">NETWORK</span>
            <span className="stat-value text-bright">ALL BRANCHES</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TOTAL STAFF</span>
            <span className="stat-value text-primary">24</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">ON SHIFT</span>
            <span className="stat-value text-success">17</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TASKS DONE</span>
            <span className="stat-value text-primary">73</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">WASTE TODAY</span>
            <span className="stat-value text-warning">291u</span>
          </div>
        </div>
      </header>

      {/* KPI Row */}
      <div className="kpi-grid mb-4">
        <div className="kpi-card panel">
          <div className="kpi-header"><DollarSign size={18} className="text-primary" /><h3>TOTAL SALES</h3></div>
          <div className="kpi-value">$127,450</div>
          <div className="kpi-trend positive">▲ +12% vs last period</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><Package size={18} className="text-warning" /><h3>TOTAL WASTE</h3></div>
          <div className="kpi-value">$12,450</div>
          <div className="kpi-trend positive">▼ -8% vs last period</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><TrendingUp size={18} className="text-success" /><h3>TOTAL SAVED</h3></div>
          <div className="kpi-value">$45,230</div>
          <div className="kpi-trend positive">▲ +18% vs last period</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header"><AlertTriangle size={18} className="text-danger" /><h3>WASTE %</h3></div>
          <div className="kpi-value">9.8%</div>
          <div className="kpi-trend positive">▼ -2.1% vs last period</div>
        </div>
      </div>

      {/* Branch Summary Table */}
      <div className="panel mb-4">
        <div className="panel-header">
          <h2>📊 ACTIVITY SUMMARY — ALL BRANCHES</h2>
          <button className="btn-small"><Download size={13} /> EXPORT</button>
        </div>
        <div className="table-responsive">
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>On Shift</th>
                <th>Tasks Done</th>
                <th>Waste Logged</th>
                <th>Actions Taken</th>
                <th>Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {branchSummaries.map(b => (
                <tr key={b.name}>
                  <td>
                    <div className="branch-cell">
                      <Building size={13} className="text-dim" />
                      <span className="font-bold">{b.name}</span>
                    </div>
                  </td>
                  <td>{b.onShift}</td>
                  <td className="text-success">{b.tasksDone}</td>
                  <td className="text-warning">{b.wasteLogged}</td>
                  <td className="text-primary">{b.actionsTaken}</td>
                  <td>
                    <div className="efficiency-cell">
                      <div className="eff-bar-wrap">
                        <div className="eff-bar" style={{ width: `${b.efficiency}%`, background: b.efficiency >= 90 ? 'var(--success)' : b.efficiency >= 75 ? 'var(--warning)' : 'var(--danger)' }}></div>
                      </div>
                      <span className={`eff-label ${efficiencyColor(b.efficiency)}`}>{b.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="panel">
        <div className="panel-header">
          <h2>📋 ALL STAFF ACTIVITIES</h2>
          <div className="aa-filters">
            <div className="input-with-icon">
              <Search className="input-icon" size={14} />
              <input type="text" className="terminal-input" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 32, width: 180 }} />
            </div>
            <select className="terminal-select" value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
              <option value="ALL">Branch: All</option>
              {branchSummaries.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
            <select className="terminal-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="ALL">Type: All</option>
              <option value="task">Tasks</option>
              <option value="waste">Waste</option>
              <option value="transfer">Transfers</option>
              <option value="clock">Clock In/Out</option>
              <option value="break">Breaks</option>
              <option value="issue">Issues</option>
            </select>
            <select className="terminal-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button className="btn-small"><Download size={13} /> EXPORT</button>
          </div>
        </div>

        <div className="activity-feed">
          {filtered.map((a, i) => (
            <div key={i} className="activity-row">
              <div className="act-time">{a.time}</div>
              <div className="act-type">{typeIcon(a.type)}</div>
              <div className="act-branch">
                <span className="branch-tag">{a.branch}</span>
              </div>
              <div className="act-staff font-bold">{a.staff}</div>
              <div className={`act-action ${typeClass(a.type)}`}>{a.action}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-dim" style={{ padding: '30px' }}>No activities match your filters</div>
          )}
        </div>

        <div className="feed-footer">
          <span className="text-dim text-xs">Showing {filtered.length} of {activities.length} activities</span>
          <div className="flex gap-2">
            <button className="btn-secondary small" disabled>PREV</button>
            <button className="btn-secondary small">NEXT</button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="aa-bottom-grid mt-4">
        <div className="panel">
          <div className="panel-header">
            <h2>🏆 BRANCH PERFORMANCE</h2>
          </div>
          <div className="leaderboard">
            {branchSummaries.sort((a, b) => b.efficiency - a.efficiency).map((b, i) => (
              <div key={b.name} className={`lb-row rank-${i + 1}`}>
                <div className="lb-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
                <div className="lb-info">
                  <div className="lb-name">{b.name}</div>
                  <div className="lb-bar-wrap">
                    <div className="lb-bar" style={{ width: `${b.efficiency}%`, background: b.efficiency >= 90 ? 'var(--success)' : b.efficiency >= 75 ? 'var(--warning)' : 'var(--danger)' }}></div>
                  </div>
                </div>
                <div className={`lb-score ${efficiencyColor(b.efficiency)}`}>{b.efficiency}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>📈 NETWORK METRICS</h2>
          </div>
          <div className="network-metrics">
            <div className="metric-card">
              <TrendingUp size={22} className="text-primary" />
              <div className="metric-value">$127,450</div>
              <div className="metric-label">Total Sales</div>
              <div className="metric-trend text-success">▲ +12%</div>
            </div>
            <div className="metric-card">
              <Package size={22} className="text-warning" />
              <div className="metric-value">$12,450</div>
              <div className="metric-label">Total Waste</div>
              <div className="metric-trend text-success">▼ -8%</div>
            </div>
            <div className="metric-card">
              <DollarSign size={22} className="text-success" />
              <div className="metric-value">$45,230</div>
              <div className="metric-label">Total Saved</div>
              <div className="metric-trend text-success">▲ +18%</div>
            </div>
            <div className="metric-card">
              <Activity size={22} className="text-primary" />
              <div className="metric-value">73</div>
              <div className="metric-label">Tasks Done</div>
              <div className="metric-trend text-success">▲ +5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
