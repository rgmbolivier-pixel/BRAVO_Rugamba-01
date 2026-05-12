import React from 'react';
import { AlertTriangle, Clock, Activity, Target, Zap, ShieldAlert, Package } from 'lucide-react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container page-container terminal-ui">
      <header className="page-header glow-panel manager-header">
        <div className="header-stats w-full">
          <div className="stat-group">
            <span className="stat-label">TODAY'S SCORE</span>
            <span className="stat-value text-primary">87/100</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">SHIFT</span>
            <span className="stat-value text-bright">Morning (8 staff)</span>
          </div>
          <div className="stat-group">
            <span className="stat-label">WASTE TARGET</span>
            <span className="stat-value text-primary">92%</span>
          </div>
          <div className="stat-group performance-banner">
            <span className="text-primary font-bold">You're in the TOP 15% of stores this week!</span>
          </div>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <Zap size={20} className="text-primary" />
            <h3>SAVED TODAY</h3>
          </div>
          <div className="kpi-value text-primary">$342</div>
          <div className="kpi-trend positive">▲ +8% vs yesterday</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-warning" />
            <h3>AT RISK</h3>
          </div>
          <div className="kpi-value text-warning">$1,280</div>
          <div className="kpi-trend positive">▼ -5% vs yesterday</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <ShieldAlert size={20} className="text-danger" />
            <h3>ACTIVE ALERTS</h3>
          </div>
          <div className="kpi-value text-danger">12</div>
          <div className="kpi-trend negative">!!! 3 CRITICAL</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <Target size={20} className="text-primary" />
            <h3>FEFO SCORE</h3>
          </div>
          <div className="kpi-value">94%</div>
          <div className="progress-bar mt-2"><div className="progress" style={{width: '94%', background: 'var(--primary)'}}></div></div>
        </div>
      </div>

      <div className="main-grid mt-4">
        <div className="panel col-span-2 alerts-panel">
          <div className="panel-header">
            <h2>🚨 CRITICAL ALERTS - NEED ACTION NOW</h2>
            <button className="btn-small">BULK DISCOUNT (25%)</button>
          </div>
          
          <div className="alert-list">
            <div className="alert-card critical">
              <div className="alert-info">
                <h4>🥛 2% MILK</h4>
                <p>Expires TODAY at 10:00 PM (8h left) | 45 units at risk | Est. Loss: $135</p>
                <div className="ai-rec text-primary">
                  <Zap size={14} /> AI: 30% discount predicted to sell 90%
                </div>
              </div>
              <div className="alert-actions">
                <button className="btn-primary small">30% OFF</button>
                <button className="btn-secondary small">TRANSFER</button>
                <button className="btn-secondary small">DONATE</button>
              </div>
            </div>

            <div className="alert-card critical">
              <div className="alert-info">
                <h4>🍞 SOURDOUGH BREAD</h4>
                <p>Expires in 18 HOURS | 28 units at risk | Est. Loss: $42</p>
                <div className="ai-rec text-primary">
                  <Zap size={14} /> AI: Transfer to Uptown (they need stock)
                </div>
              </div>
              <div className="alert-actions">
                <button className="btn-secondary small">20% OFF</button>
                <button className="btn-primary small">TRANSFER</button>
                <button className="btn-secondary small">DONATE</button>
              </div>
            </div>
          </div>
          <button className="btn-text w-full text-center mt-4">VIEW ALL 12 ALERTS →</button>
        </div>

        <div className="side-panels">
          <div className="panel mb-4">
            <div className="panel-header">
              <h2>⚡ QUICK ACTIONS</h2>
            </div>
            <div className="quick-actions">
              <button className="btn-secondary w-full text-left">LOG WASTE</button>
              <button className="btn-secondary w-full text-left">RECEIVE DELIVERY</button>
              <button className="btn-secondary w-full text-left">COUNT INVENTORY</button>
              <button className="btn-secondary w-full text-left">CREATE TRANSFER</button>
              <button className="btn-secondary w-full text-left">VIEW ALL ALERTS</button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>📊 TODAY'S WASTE</h2>
            </div>
            <div className="waste-bars">
              <div className="waste-bar">
                <div className="bar-label"><span>Dairy (12kg)</span> <span>$36</span></div>
                <div className="progress-bar"><div className="progress" style={{width: '80%', background: 'var(--danger)'}}></div></div>
              </div>
              <div className="waste-bar">
                <div className="bar-label"><span>Produce (8kg)</span> <span>$24</span></div>
                <div className="progress-bar"><div className="progress" style={{width: '50%', background: 'var(--warning)'}}></div></div>
              </div>
              <div className="waste-bar">
                <div className="bar-label"><span>Bakery (15kg)</span> <span>$30</span></div>
                <div className="progress-bar"><div className="progress" style={{width: '100%', background: 'var(--primary)'}}></div></div>
              </div>
              <div className="text-center mt-4 font-bold">TOTAL: $90 so far</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <h2>📈 LIVE SYSTEM LOG</h2>
          <div className="flex gap-2">
            <button className="btn-small text-primary">AUTO-SCROLL: ON</button>
            <button className="btn-small">EXPORT LOG</button>
          </div>
        </div>
        <div className="system-log terminal-font">
          <div className="log-entry"><span className="log-time">[10:34:02]</span> <span className="log-success">✅ Alert #123 resolved - 30% discount applied to 2% Milk</span></div>
          <div className="log-entry"><span className="log-time">[10:32:17]</span> <span className="log-error">🚨 CRITICAL alert created - 2% Milk expires today</span></div>
          <div className="log-entry"><span className="log-time">[10:30:45]</span> <span className="log-info">📦 Receiving completed - PO-001234 from Dairy Fresh Co</span></div>
          <div className="log-entry"><span className="log-time">[10:15:22]</span> <span className="log-info">👤 Staff Sarah Lee logged waste - 12 units Bread (expired)</span></div>
          <div className="log-entry"><span className="log-time">[10:00:01]</span> <span className="log-info">📊 Daily summary: $342 saved, $1,280 at risk</span></div>
          <div className="log-input mt-4">
            <span className="prompt">&gt;</span> <input type="text" className="terminal-input-inline" placeholder="_" />
          </div>
        </div>
      </div>
    </div>
  );
};
