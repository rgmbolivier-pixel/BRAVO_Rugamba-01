import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Package, Download, Trash2, DollarSign, Star, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { analyticsService } from '../../services/api';
import './Analytics.css';

const TrashIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [perf, setPerf] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, perfRes] = await Promise.all([
        analyticsService.getNetworkStats(),
        analyticsService.getBranchPerformance()
      ]);
      setStats(statsRes.data);
      setPerf(perfRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container terminal-ui"><div className="panel" style={{ textAlign: 'center', padding: 100 }}><span className="loading-text">CALCULATING NETWORK ANALYTICS...</span></div></div>;

  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return <AdminAnalytics stats={stats} perf={perf} />;
  }
  return <ManagerAnalytics stats={stats} perf={perf.filter(p => p.id === user?.branch)} />;
};

const AdminAnalytics: React.FC<{ stats: any, perf: any[] }> = ({ stats, perf }) => {
  return (
    <div className="analytics-container page-container terminal-ui">
      <header className="page-header glow-panel">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">DATE RANGE</span>
            <span className="stat-value text-bright">REAL-TIME</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">NETWORK HEALTH</span>
            <span className="stat-value text-primary">OPTIMIZED</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">BRANCHES</span>
            <span className="stat-value text-success">{perf.length} ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <DollarSign size={20} className="text-primary" />
            <h3>POTENTIAL SAVED</h3>
          </div>
          <div className="kpi-value">${stats?.totalSaved || 0}</div>
          <div className="kpi-trend positive">▲ LIVE</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrashIcon size={20} className="text-danger" />
            <h3>TOTAL WASTE</h3>
          </div>
          <div className="kpi-value">${stats?.totalWaste || 0}</div>
          <div className="kpi-trend negative">▼ CURRENT</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-warning" />
            <h3>ACTIVE ALERTS</h3>
          </div>
          <div className="kpi-value">{stats?.totalAlerts || 0}</div>
          <div className="kpi-trend negative">!!! {stats?.critAlerts || 0} CRITICAL</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <Zap size={20} className="text-success" />
            <h3>FEFO SCORE</h3>
          </div>
          <div className="kpi-value">92%</div>
          <div className="kpi-trend positive">▲ OPTIMIZED</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📊 NETWORK PERFORMANCE</h2>
            <button className="btn-small"><Download size={14} /> EXPORT</button>
          </div>
          <div className="table-responsive">
            <table className="terminal-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Compliance Score</th>
                  <th>Waste</th>
                  <th>Saved</th>
                  <th>Alerts</th>
                </tr>
              </thead>
              <tbody>
                {perf.map(p => (
                  <tr key={p.id}>
                    <td className="font-bold">{p.name}</td>
                    <td style={{ color: p.score > 90 ? 'var(--success)' : 'var(--warning)' }}>{p.score}% {p.trend === 'up' ? '▲' : '▼'}</td>
                    <td className="text-danger">{p.waste}</td>
                    <td className="text-success">{p.saved}</td>
                    <td className="text-warning">{p.alerts} ({p.crit} crit)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>🗑️ WASTE BY CATEGORY</h2>
          </div>
          <div className="category-bars">
            {(stats?.wasteByCategory || []).map((cat: any, i: number) => (
              <div className="bar-group" key={i}>
                <div className="bar-label">
                  <span>{cat.name}</span>
                  <span>{cat.percentage}%</span>
                </div>
                <div className="progress-bar"><div className="progress" style={{width: `${cat.percentage}%`, background: i === 0 ? 'var(--danger)' : i === 1 ? 'var(--warning)' : 'var(--primary)'}}></div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>💰 PROFIT BY CATEGORY</h2>
          </div>
          <div className="category-bars">
            {(stats?.profitByCategory || []).map((cat: any, i: number) => (
              <div className="bar-group" key={i}>
                <div className="bar-label">
                  <span>{cat.name}</span>
                  <span>${cat.value}</span>
                </div>
                <div className="progress-bar"><div className="progress" style={{width: `${cat.percentage}%`, background: 'var(--success)'}}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <h2>📉 TOP 5 WASTED PRODUCTS (Network-wide)</h2>
          <button className="btn-small">VIEW ACTIONABLE INSIGHTS</button>
        </div>
        <div className="wasted-products-list">
          {(stats?.topWastedProducts || []).map((p: any, i: number) => (
            <div className="wasted-product-item" key={i}>
              <div className="product-rank">{i + 1}</div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-details">{p.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ManagerAnalytics: React.FC<{ stats: any, perf: any[] }> = ({ stats, perf }) => {
  const p = perf[0] || {};
  return (
    <div className="analytics-container page-container terminal-ui">
      <header className="page-header glow-panel">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">STORE</span>
            <span className="stat-value text-bright">{p.name || 'DOWNTOWN'}</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">DATE RANGE</span>
            <span className="stat-value text-primary">REAL-TIME</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">HEALTH SCORE</span>
            <span className="stat-value text-success">{p.score || 0}%</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <DollarSign size={20} className="text-primary" />
            <h3>STORE SAVED</h3>
          </div>
          <div className="kpi-value">{p.saved || '$0'}</div>
          <div className="kpi-trend positive">▲ LIVE</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrashIcon size={20} className="text-danger" />
            <h3>STORE WASTE</h3>
          </div>
          <div className="kpi-value">{p.waste || '$0'}</div>
          <div className="kpi-trend negative">▼ CURRENT</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-warning" />
            <h3>STORE ALERTS</h3>
          </div>
          <div className="kpi-value">{p.alerts || 0}</div>
          <div className="kpi-trend negative">!!! {p.crit || 0} CRITICAL</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <Zap size={20} className="text-success" />
            <h3>FEFO SCORE</h3>
          </div>
          <div className="kpi-value">{p.score || 0}%</div>
          <div className="kpi-trend positive">▲ OPTIMIZED</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📊 STORE PERFORMANCE TRENDS</h2>
            <button className="btn-small">VIEW DETAILED REPORT</button>
          </div>
          <div className="table-responsive">
            <table className="terminal-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Waste</th>
                  <th>Saved</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Dairy</td><td className="text-danger">$145</td><td className="text-success">$560</td><td>94%</td></tr>
                <tr><td>Produce</td><td className="text-danger">$89</td><td className="text-success">$420</td><td>88%</td></tr>
                <tr><td>Bakery</td><td className="text-danger">$34</td><td className="text-success">$210</td><td>98%</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>🗑️ WASTE BY REASON</h2>
          </div>
          <div className="category-bars">
            <div className="bar-group">
              <div className="bar-label"><span>Expired</span><span>55%</span></div>
              <div className="progress-bar"><div className="progress" style={{width: '55%', background: 'var(--danger)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label"><span>Damaged</span><span>25%</span></div>
              <div className="progress-bar"><div className="progress" style={{width: '25%', background: 'var(--warning)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label"><span>Quality</span><span>12%</span></div>
              <div className="progress-bar"><div className="progress" style={{width: '12%', background: 'var(--primary)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label"><span>Other</span><span>8%</span></div>
              <div className="progress-bar"><div className="progress" style={{width: '8%', background: 'var(--text-dim)'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel mt-4 border-primary">
        <div className="panel-header">
          <h2 className="text-primary flex items-center gap-2">
            <Zap size={18} /> 💡 AI INSIGHTS FOR YOUR STORE
          </h2>
        </div>
        <ul className="insight-list">
          <li><span className="text-danger">•</span> Dairy waste is 15% higher than network average. Check cooler temps.</li>
          <li><span className="text-primary">•</span> Best discount time: 4-6 PM (67% of discounted items sell)</li>
          <li><span className="text-success">•</span> Store is currently operating at {p.score}% FEFO compliance.</li>
        </ul>
      </div>
    </div>
  );
};
