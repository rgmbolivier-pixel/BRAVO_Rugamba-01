import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Package, Download, Trash2, DollarSign, Star, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Analytics.css';

const TrashIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (isAdmin) {
    return <AdminAnalytics />;
  }
  return <ManagerAnalytics />;
};

const AdminAnalytics: React.FC = () => {
  return (
    <div className="analytics-container page-container terminal-ui">
      <header className="page-header glow-panel">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">DATE RANGE</span>
            <span className="stat-value text-bright">LAST 30 DAYS</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">COMPARE</span>
            <span className="stat-value text-primary">PREVIOUS PERIOD</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">BRANCHES</span>
            <span className="stat-value text-success">5 ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <DollarSign size={20} className="text-primary" />
            <h3>TOTAL SALES</h3>
          </div>
          <div className="kpi-value">$127,450</div>
          <div className="kpi-trend positive">▲ +12%</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrashIcon size={20} className="text-danger" />
            <h3>TOTAL WASTE</h3>
          </div>
          <div className="kpi-value">$12,450</div>
          <div className="kpi-trend positive">▼ -8%</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrendingUp size={20} className="text-success" />
            <h3>TOTAL SAVED</h3>
          </div>
          <div className="kpi-value">$45,230</div>
          <div className="kpi-trend positive">▲ +18%</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-warning" />
            <h3>WASTE %</h3>
          </div>
          <div className="kpi-value">9.8%</div>
          <div className="kpi-trend positive">▼ -2.1%</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📊 NETWORK OVERVIEW</h2>
            <button className="btn-small"><Download size={14} /> EXPORT</button>
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold">Downtown</td>
                  <td>5/8</td>
                  <td className="text-success">23</td>
                  <td className="text-warning">67u ($168)</td>
                  <td className="text-primary">12</td>
                </tr>
                <tr>
                  <td className="font-bold">Uptown</td>
                  <td>4/6</td>
                  <td className="text-success">18</td>
                  <td className="text-warning">45u ($112)</td>
                  <td className="text-primary">8</td>
                </tr>
                <tr>
                  <td className="font-bold">Northside</td>
                  <td>3/5</td>
                  <td className="text-success">12</td>
                  <td className="text-warning">89u ($223)</td>
                  <td className="text-primary">5</td>
                </tr>
                <tr>
                  <td className="font-bold">Westside</td>
                  <td>2/4</td>
                  <td className="text-success">9</td>
                  <td className="text-warning">34u ($85)</td>
                  <td className="text-primary">4</td>
                </tr>
                <tr>
                  <td className="font-bold">Eastside</td>
                  <td>3/6</td>
                  <td className="text-success">11</td>
                  <td className="text-warning">56u ($140)</td>
                  <td className="text-primary">6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>🗑️ WASTE BY CATEGORY</h2>
          </div>
          <div className="category-bars">
            <div className="bar-group">
              <div className="bar-label">
                <span>Dairy</span>
                <span>34%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '34%', background: 'var(--danger)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Produce</span>
                <span>30%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '30%', background: 'var(--warning)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Bakery</span>
                <span>18%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '18%', background: 'var(--primary)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Meat</span>
                <span>10%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '10%', background: 'var(--primary-dark)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Other</span>
                <span>8%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '8%', background: 'var(--text-dim)'}}></div></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>💰 PROFIT BY CATEGORY</h2>
          </div>
          <div className="category-bars">
            <div className="bar-group">
              <div className="bar-label">
                <span>Dairy</span>
                <span>$45K</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '45%', background: 'var(--success)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Produce</span>
                <span>$38K</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '38%', background: 'var(--success)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Bakery</span>
                <span>$22K</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '22%', background: 'var(--success)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Meat</span>
                <span>$15K</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '15%', background: 'var(--success)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Other</span>
                <span>$10K</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '10%', background: 'var(--success)'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <h2>📉 TOP 5 WASTED PRODUCTS (Network-wide)</h2>
          <button className="btn-small">VIEW ACTIONABLE INSIGHTS</button>
        </div>
        <div className="wasted-products-list">
          <div className="wasted-product-item">
            <div className="product-rank">1</div>
            <div className="product-info">
              <div className="product-name">2% Milk</div>
              <div className="product-details">234 units ($585) - Downtown, Uptown, Northside</div>
            </div>
          </div>
          <div className="wasted-product-item">
            <div className="product-rank">2</div>
            <div className="product-info">
              <div className="product-name">Sourdough Bread</div>
              <div className="product-details">189 units ($283) - Downtown, Westside</div>
            </div>
          </div>
          <div className="wasted-product-item">
            <div className="product-rank">3</div>
            <div className="product-info">
              <div className="product-name">Lettuce</div>
              <div className="product-details">156 units ($187) - All branches</div>
            </div>
          </div>
          <div className="wasted-product-item">
            <div className="product-rank">4</div>
            <div className="product-info">
              <div className="product-name">Eggs</div>
              <div className="product-details">145 units ($217) - Northside, Eastside</div>
            </div>
          </div>
          <div className="wasted-product-item">
            <div className="product-rank">5</div>
            <div className="product-info">
              <div className="product-name">Cheddar Cheese</div>
              <div className="product-details">98 units ($490) - Downtown</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManagerAnalytics: React.FC = () => {
  return (
    <div className="analytics-container page-container terminal-ui">
      <header className="page-header glow-panel">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">STORE</span>
            <span className="stat-value text-bright">DOWNTOWN</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">DATE RANGE</span>
            <span className="stat-value text-primary">LAST 30 DAYS</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">COMPARE</span>
            <span className="stat-value text-primary">PREVIOUS PERIOD</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <DollarSign size={20} className="text-primary" />
            <h3>STORE SALES</h3>
          </div>
          <div className="kpi-value">$12,450</div>
          <div className="kpi-trend positive">▲ +8%</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrashIcon size={20} className="text-danger" />
            <h3>STORE WASTE</h3>
          </div>
          <div className="kpi-value">$1,240</div>
          <div className="kpi-trend positive">▼ -12%</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <TrendingUp size={20} className="text-success" />
            <h3>STORE SAVED</h3>
          </div>
          <div className="kpi-value">$3,450</div>
          <div className="kpi-trend positive">▲ +15%</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-warning" />
            <h3>WASTE %</h3>
          </div>
          <div className="kpi-value">9.1%</div>
          <div className="kpi-trend positive">▼ -2.5%</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📊 STAFF PERFORMANCE SUMMARY</h2>
            <button className="btn-small">VIEW DETAILED STAFF REPORT</button>
          </div>
          <div className="table-responsive">
            <table className="terminal-table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Tasks Done</th>
                  <th>Waste Logged</th>
                  <th>Waste $</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold">Sarah Lee</td>
                  <td className="text-success">45</td>
                  <td>89u</td>
                  <td className="text-warning">$223</td>
                  <td><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /> (5.0)</td>
                </tr>
                <tr>
                  <td className="font-bold">Mike Johnson</td>
                  <td className="text-success">38</td>
                  <td>45u</td>
                  <td className="text-warning">$112</td>
                  <td><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-dim" /> (4.2)</td>
                </tr>
                <tr>
                  <td className="font-bold">John Davis</td>
                  <td className="text-success">29</td>
                  <td>67u</td>
                  <td className="text-warning">$168</td>
                  <td><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-warning" /><Star size={14} className="text-dim" /><Star size={14} className="text-dim" /> (3.5)</td>
                </tr>
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
              <div className="bar-label">
                <span>Expired</span>
                <span>55%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '55%', background: 'var(--danger)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Damaged</span>
                <span>25%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '25%', background: 'var(--warning)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Quality</span>
                <span>12%</span>
              </div>
              <div className="progress-bar"><div className="progress" style={{width: '12%', background: 'var(--primary)'}}></div></div>
            </div>
            <div className="bar-group">
              <div className="bar-label">
                <span>Other</span>
                <span>8%</span>
              </div>
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
          <li><span className="text-success">•</span> Staff Sarah Lee has highest waste prevention rate. Consider training others on her methods.</li>
        </ul>
      </div>
    </div>
  );
};
