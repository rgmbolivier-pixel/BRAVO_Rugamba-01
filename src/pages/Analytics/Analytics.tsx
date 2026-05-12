import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Package, Download } from 'lucide-react';
import './Analytics.css'; // We'll create a shared dashboard CSS or component specific ones

export const Analytics: React.FC = () => {
  return (
    <div className="analytics-container page-container terminal-ui">
      <header className="page-header glow-panel">
        <div className="header-stats">
          <div className="stat-group">
            <span className="stat-label">NETWORK HEALTH</span>
            <span className="stat-value text-primary">87/100</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">ACTIVE STORES</span>
            <span className="stat-value text-bright">12</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">TOTAL STAFF</span>
            <span className="stat-value text-bright">48</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">ROI</span>
            <span className="stat-value text-primary">466%</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrendingUp size={20} className="text-primary" />
            <h3>TOTAL SAVED</h3>
          </div>
          <div className="kpi-value">$127,450</div>
          <div className="kpi-trend positive">▲ +18% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrashIcon size={20} className="text-danger" />
            <h3>TOTAL WASTE</h3>
          </div>
          <div className="kpi-value">$54,230</div>
          <div className="kpi-trend positive">▼ -12% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <Package size={20} className="text-warning" />
            <h3>RECOVERED</h3>
          </div>
          <div className="kpi-value">$23,450</div>
          <div className="kpi-trend positive">▲ +8% vs last month</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-danger" />
            <h3>ACTIVE ALERTS</h3>
          </div>
          <div className="kpi-value">47</div>
          <div className="kpi-trend negative">Needs attention</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📊 BRANCH PERFORMANCE LEADERBOARD</h2>
            <button className="btn-small"><Download size={14} /> EXPORT</button>
          </div>
          <table className="terminal-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Branch</th>
                <th>Waste %</th>
                <th>FEFO</th>
                <th>Actions</th>
                <th>Saved</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 🏆</td>
                <td>Downtown Store</td>
                <td className="text-primary">6.2%</td>
                <td>96%</td>
                <td>127</td>
                <td className="text-primary">$18.2K</td>
                <td>94</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Uptown Store</td>
                <td>7.8%</td>
                <td>93%</td>
                <td>98</td>
                <td>$14.5K</td>
                <td>88</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Northside Store</td>
                <td>8.9%</td>
                <td>90%</td>
                <td>76</td>
                <td>$11.2K</td>
                <td>82</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Westside Store</td>
                <td className="text-warning">10.2%</td>
                <td>87%</td>
                <td>54</td>
                <td>$8.9K</td>
                <td>75</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Eastside Store</td>
                <td className="text-danger">12.5%</td>
                <td>83%</td>
                <td>42</td>
                <td>$6.2K</td>
                <td>68</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>📈 WASTE BY CATEGORY</h2>
          </div>
          <div className="category-bars">
            <div className="bar-group">
              <div className="bar-label">
                <span>Dairy</span>
                <span>$18,450 (34%)</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '68%', background: 'var(--danger)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Produce</span>
                <span>$16,200 (30%)</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '60%', background: 'var(--warning)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Bakery</span>
                <span>$9,800 (18%)</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '36%', background: 'var(--primary)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Meat</span>
                <span>$5,600 (10%)</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '20%', background: 'var(--primary-dark)'}}></div></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>🤖 AI INSIGHTS</h2>
          </div>
          <ul className="insight-list">
            <li><span className="text-danger">•</span> Dairy waste up 12% - check cooler temperatures</li>
            <li><span className="text-primary">•</span> Downtown store best practice: morning FEFO rotation</li>
            <li><span className="text-warning">•</span> Eastside needs training - waste 2x network average</li>
            <li><span className="text-primary">•</span> Bulk discount program saved $23K this month</li>
          </ul>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <h2>💰 ROI CALCULATOR (Real-time)</h2>
        </div>
        <div className="roi-calculator">
          <div className="calc-row"><span>Monthly subscription:</span> <span>$500/store × 12 stores = $6,000</span></div>
          <div className="calc-row"><span>Monthly waste reduction:</span> <span className="text-primary">$18,450</span></div>
          <div className="calc-row"><span>Monthly recovered value (transfers/discounts):</span> <span className="text-primary">$8,200</span></div>
          <div className="calc-divider"></div>
          <div className="calc-row highlight">
            <span>NET MONTHLY BENEFIT:</span>
            <span className="text-primary text-xl">$20,650</span>
          </div>
          <div className="calc-progress">
            <div className="calc-progress-label">ROI: 344%</div>
            <div className="progress-bar"><div className="progress" style={{width: '100%', background: 'var(--primary)'}}></div></div>
          </div>
          <div className="calc-row text-center mt-2">
            <span className="text-primary">ANNUAL PROJECTION: $247,800 savings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrashIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);
