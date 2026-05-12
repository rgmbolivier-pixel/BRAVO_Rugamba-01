import React from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Eye
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const forecastData = [
  { day: 'Dec 18', demand: 120, predicted: 125 },
  { day: 'Dec 19', demand: 135, predicted: 140 },
  { day: 'Dec 20', demand: 150, predicted: 155 },
  { day: 'Dec 21', demand: 180, predicted: 190 },
  { day: 'Dec 22', demand: 210, predicted: 230 },
  { day: 'Dec 23', demand: 280, predicted: 310 },
  { day: 'Dec 24', demand: 350, predicted: 420 },
];

const anomalies = [
  { id: 1, product: 'Whole Milk 1L', branch: 'Downtown', pos: 142, inv: 98, score: 0.94, status: 'Investigation Required' },
  { id: 2, product: 'Large Brown Eggs', branch: 'Uptown', pos: 500, inv: 423, score: 0.87, status: 'In Progress' },
  { id: 3, product: 'Unsalted Butter', branch: 'Westside', pos: 45, inv: 62, score: 0.82, status: 'New' },
];

export const Intelligence: React.FC = () => {
  return (
    <div className="intelligence-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Intelligence Hub</h1>
          <p className="text-muted">Predictive analytics and anomaly detection engine</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export Intelligence Report</button>
        </div>
      </div>

      <div className="intelligence-grid">
        <div className="stats-panel glass">
          <div className="section-header">
            <h3>Anomaly Detection Stats</h3>
          </div>
          <div className="stats-content">
            <div className="stat-item">
              <span className="stat-label">Model Accuracy</span>
              <span className="stat-value">94.2%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Anomalies (Week)</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Est. Shrinkage</span>
              <span className="stat-value danger">$3,240</span>
            </div>
          </div>
        </div>

        <div className="forecast-panel glass">
          <div className="section-header">
            <h3>30-Day Demand Forecast</h3>
            <div className="forecast-peak warning">
              <TrendingUp size={14} />
              Next peak: Dec 24 (+340%)
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ background: '#121212', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="predicted" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="anomalies-section glass">
        <div className="section-header">
          <h3>Statistical Deviations (Isolation Forest)</h3>
          <div className="header-actions">
            <div className="search-box glass">
              <Search size={16} />
              <input type="text" placeholder="Search anomalies..." />
            </div>
          </div>
        </div>
        <table className="intelligence-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Branch</th>
              <th>POS vs Inv</th>
              <th>Anomaly Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map(anomaly => (
              <tr key={anomaly.id}>
                <td>
                  <div className="product-cell">
                    <div className="product-icon"><BrainCircuit size={14} /></div>
                    {anomaly.product}
                  </div>
                </td>
                <td>{anomaly.branch}</td>
                <td className="mismatch-cell">
                  <span className="pos">{anomaly.pos}</span>
                  <span className="separator">/</span>
                  <span className="inv danger">{anomaly.inv}</span>
                  <div className="mismatch-bar">
                    <div className="bar-inner" style={{ width: `${(anomaly.inv/anomaly.pos)*100}%` }}></div>
                  </div>
                </td>
                <td>
                  <div className="score-badge" style={{ background: `rgba(239, 68, 68, ${anomaly.score * 0.2})`, color: anomaly.score > 0.9 ? 'var(--danger)' : 'var(--warning)' }}>
                    {anomaly.score}
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${anomaly.status.toLowerCase().replace(' ', '-')}`}>
                    {anomaly.status}
                  </span>
                </td>
                <td>
                  <button className="investigate-btn">
                    <Eye size={14} />
                    Investigate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="smart-orders-section">
        <h3 className="section-title">Smart Order Recommendations</h3>
        <div className="order-cards">
          <div className="order-card glass">
            <div className="order-header">
              <div className="product-title">
                <h4>Whole Milk 1L</h4>
                <span className="category">Dairy</span>
              </div>
              <span className="order-date">Required by Dec 22</span>
            </div>
            <div className="order-stats">
              <div className="order-stat">
                <span className="label">Current</span>
                <span className="value">45</span>
              </div>
              <div className="order-stat">
                <span className="label">Predicted</span>
                <span className="value">120</span>
              </div>
              <div className="order-stat highlight">
                <span className="label">Recommended Order</span>
                <span className="value">75</span>
              </div>
            </div>
            <div className="order-actions">
              <button className="btn-primary small">Approve</button>
              <button className="btn-secondary small">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .intelligence-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .intelligence-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 24px;
        }

        .stats-panel, .forecast-panel, .anomalies-section {
          padding: 24px;
          border-radius: var(--radius-lg);
        }

        .stats-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-glass);
        }

        .stat-label {
          color: var(--text-dim);
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
        }

        .forecast-peak {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 100px;
        }

        .forecast-peak.warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }

        .intelligence-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .intelligence-table th {
          text-align: left;
          padding: 12px;
          color: var(--text-dim);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid var(--border-glass);
        }

        .intelligence-table td {
          padding: 16px 12px;
          border-bottom: 1px solid var(--border-glass);
          font-size: 0.9rem;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
        }

        .product-icon {
          width: 28px;
          height: 28px;
          background: var(--bg-glass);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .mismatch-cell {
          position: relative;
          padding-bottom: 24px !important;
        }

        .pos { font-weight: 700; }
        .separator { margin: 0 4px; color: var(--text-dim); }
        .inv { font-weight: 700; }

        .mismatch-bar {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .bar-inner {
          height: 100%;
          background: var(--danger);
        }

        .score-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-family: monospace;
          display: inline-block;
        }

        .status-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
          background: var(--bg-glass);
        }

        .status-pill.investigation-required { color: var(--danger); }
        .status-pill.in-progress { color: var(--warning); }
        .status-pill.new { color: var(--secondary); }

        .investigate-btn {
          background: transparent;
          border: 1px solid var(--border-glass);
          color: var(--text-muted);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: var(--transition);
        }

        .investigate-btn:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .section-title {
          margin-bottom: 20px;
          font-family: 'Outfit', sans-serif;
        }

        .order-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .order-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .product-title h4 { font-size: 1.1rem; }
        .category { font-size: 0.7rem; color: var(--text-dim); text-transform: uppercase; }
        .order-date { font-size: 0.75rem; color: var(--warning); font-weight: 600; }

        .order-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 12px;
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
        }

        .order-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .order-stat .label { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; }
        .order-stat .value { font-size: 1rem; font-weight: 700; }
        .order-stat.highlight .value { color: var(--primary); }

        .order-actions {
          display: flex;
          gap: 8px;
        }

        .btn-primary.small, .btn-secondary.small {
          padding: 6px 12px;
          font-size: 0.8rem;
          flex: 1;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};
