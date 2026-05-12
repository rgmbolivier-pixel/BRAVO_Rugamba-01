import React from 'react';
import { 
  TrendingUp, 
  Search, 
  Download, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ArrowUpRight,
  ShoppingCart
} from 'lucide-react';

export const Forecast: React.FC = () => {
  return (
    <div className="forecast-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Predictive Forecast</h1>
          <p className="text-muted">Demand modeling & intelligent procurement recommendations</p>
        </div>
        <button className="btn-secondary">
          <Download size={18} />
          Export Procurement Plan
        </button>
      </div>

      <div className="forecast-controls glass">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Select product to model..." defaultValue="Organic Milk 2%" />
        </div>
        <div className="date-range glass">
          <Calendar size={16} />
          <span>Next 30 Days</span>
        </div>
      </div>

      <div className="forecast-main">
        <div className="forecast-chart-container glass">
          <div className="chart-header">
            <h3>DEMAND FORECAST - Next 30 Days</h3>
            <div className="chart-legend">
              <span className="legend-item"><div className="dot primary"></div> Predicted</span>
              <span className="legend-item"><div className="dot confidence"></div> Confidence Range</span>
            </div>
          </div>
          
          <div className="main-chart">
            <svg viewBox="0 0 800 240" className="forecast-svg">
              <path 
                className="confidence-area" 
                d="M50,180 Q150,160 250,180 T450,100 T650,120 T750,80 L750,220 L50,220 Z" 
                fill="rgba(99, 102, 241, 0.05)"
              />
              <path 
                className="forecast-line" 
                d="M50,200 Q150,180 250,200 T450,120 T650,140 T750,100" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
              />
              {/* Peak Marker */}
              <circle cx="450" cy="120" r="6" fill="var(--primary)" />
              <text x="460" y="110" className="peak-label" fill="var(--primary)">Holiday Peak (+340%)</text>
            </svg>
            <div className="x-axis">
              <span>12/18</span>
              <span>12/20</span>
              <span>12/22</span>
              <span>12/24</span>
              <span>12/26</span>
              <span>12/28</span>
              <span>12/30</span>
            </div>
          </div>
        </div>

        <div className="order-recommendation glass">
          <div className="rec-header">
            <BrainCircuit size={24} className="text-primary" />
            <div className="title">
              <h3>RECOMMENDED ORDER</h3>
              <p>Based on holiday demand models</p>
            </div>
          </div>
          
          <div className="rec-body">
            <div className="stat-row">
              <span className="label">Current stock:</span>
              <span className="value">45 units</span>
            </div>
            <div className="stat-row">
              <span className="label">Predicted demand (7d):</span>
              <span className="value">210 units</span>
            </div>
            <div className="stat-row">
              <span className="label">Safety stock needed:</span>
              <span className="value">30 units</span>
            </div>
            <div className="rec-total">
              <span className="label">ORDER QUANTITY</span>
              <span className="value">195 units</span>
            </div>
            <p className="rec-deadline">Order by <strong>Dec 19</strong> for delivery <strong>Dec 21</strong></p>
          </div>
          
          <div className="rec-actions">
            <button className="btn-primary full-width"><CheckCircle2 size={18} /> APPROVE ORDER</button>
            <div className="btn-group">
              <button className="btn-secondary">EDIT QTY</button>
              <button className="btn-text danger">REJECT</button>
            </div>
          </div>
        </div>
      </div>

      <div className="other-needs-section glass">
        <div className="section-header">
          <h3>OTHER PRODUCTS NEEDING ORDER THIS WEEK</h3>
        </div>
        <table className="needs-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Current</th>
              <th>Forecast (7d)</th>
              <th>Recommended</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Whole Milk', cur: '32u', fore: '180u', rec: '160u', status: 'normal' },
              { name: 'Farm Fresh Eggs', cur: '89u', fore: '450u', rec: '380u', status: 'normal' },
              { name: 'Unsalted Butter', cur: '8u', fore: '75u', rec: '70u', status: 'critical' },
              { name: 'Cheddar Cheese', cur: '23u', fore: '120u', rec: '100u', status: 'normal' },
            ].map((item, i) => (
              <tr key={i}>
                <td className="font-bold">{item.name}</td>
                <td><span className={item.status === 'critical' ? 'text-danger font-bold' : ''}>{item.cur} {item.status === 'critical' && '🔴'}</span></td>
                <td>{item.fore}</td>
                <td className="text-primary font-bold">{item.rec}</td>
                <td><button className="btn-secondary small"><ShoppingCart size={14} /> ORDER</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .forecast-page { display: flex; flex-direction: column; gap: 24px; }
        .forecast-controls { padding: 16px 24px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; }
        .search-box { width: 400px; display: flex; align-items: center; gap: 12px; }
        .search-box input { background: transparent; border: none; color: var(--text-main); outline: none; width: 100%; font-size: 1rem; }
        .date-range { display: flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }

        .forecast-main { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .forecast-chart-container { padding: 24px; border-radius: var(--radius-lg); }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .chart-header h3 { font-size: 0.9rem; font-weight: 800; color: var(--text-dim); }
        .chart-legend { display: flex; gap: 20px; font-size: 0.75rem; font-weight: 700; }
        .legend-item { display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.primary { background: var(--primary); }
        .dot.confidence { background: rgba(99, 102, 241, 0.2); }

        .main-chart { position: relative; padding: 20px 0; }
        .forecast-svg { width: 100%; height: auto; overflow: visible; }
        .peak-label { font-size: 10px; font-weight: 800; font-family: monospace; }
        .x-axis { display: flex; justify-content: space-between; margin-top: 20px; padding: 0 10px; font-size: 0.75rem; color: var(--text-dim); font-weight: 700; }

        .order-recommendation { padding: 24px; border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: 24px; }
        .rec-header { display: flex; gap: 16px; align-items: center; }
        .rec-header h3 { font-size: 1.1rem; font-weight: 800; }
        .rec-header p { font-size: 0.8rem; color: var(--text-muted); }
        
        .rec-body { display: flex; flex-direction: column; gap: 12px; }
        .stat-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted); }
        .stat-row .value { color: var(--text-main); font-weight: 600; }
        .rec-total { display: flex; justify-content: space-between; align-items: center; pt: 12px; border-top: 1px solid var(--border-glass); margin-top: 12px; }
        .rec-total .label { font-size: 0.8rem; font-weight: 800; color: var(--text-dim); }
        .rec-total .value { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
        .rec-deadline { font-size: 0.8rem; color: var(--text-muted); text-align: center; }

        .rec-actions { display: flex; flex-direction: column; gap: 12px; }
        .rec-actions .btn-group { display: flex; gap: 12px; }
        .rec-actions .btn-group button { flex: 1; }

        .other-needs-section { padding: 24px; border-radius: var(--radius-lg); }
        .section-header h3 { font-size: 0.9rem; font-weight: 800; color: var(--text-dim); margin-bottom: 24px; }
        .needs-table { width: 100%; border-collapse: collapse; text-align: left; }
        .needs-table th { padding: 12px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-dim); letter-spacing: 1px; border-bottom: 1px solid var(--border-glass); }
        .needs-table td { padding: 16px 12px; border-bottom: 1px solid var(--border-glass); font-size: 0.95rem; }
        
        .full-width { width: 100%; justify-content: center; }
      `}</style>
    </div>
  );
};
