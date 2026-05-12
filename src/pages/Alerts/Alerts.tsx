import React from 'react';
import { AlertTriangle, Zap, Download, Search, CheckSquare } from 'lucide-react';
import './Alerts.css';

export const Alerts: React.FC = () => {
  return (
    <div className="alerts-container page-container terminal-ui">
      <div className="search-bar panel mb-4">
        <div className="filters flex-1">
          <span className="text-dim mr-2">FILTERS:</span>
          <select className="terminal-select">
            <option>ALL</option>
            <option>CRITICAL</option>
            <option>HIGH</option>
            <option>MEDIUM</option>
          </select>
        </div>
        <div className="input-with-icon flex-2">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search product..." />
        </div>
        <button className="btn-secondary"><Download size={16} /> EXPORT</button>
      </div>

      <div className="panel border-danger mb-4">
        <div className="panel-header">
          <h2 className="text-danger flex items-center gap-2">
            <AlertTriangle size={18} /> 🔴 CRITICAL (3 alerts - Action needed within 24h)
          </h2>
        </div>
        <div className="alert-list">
          <div className="alert-card critical-alert">
            <div className="alert-main">
              <div className="alert-title">
                <CheckSquare size={16} className="text-dim" />
                <h3>🥛 2% MILK</h3>
                <span className="badge badge-danger ml-auto">Batch: L2401</span>
              </div>
              <div className="alert-details">
                <span>Quantity: 45 units</span> | <span>Location: Cooler A</span>
              </div>
              <div className="alert-details text-danger font-bold">
                Expires: TODAY at 10:00 PM (8 hours left)
              </div>
              <div className="alert-details">
                Est. Loss if wasted: $135
              </div>
            </div>
            <div className="alert-ai">
              <div className="ai-header text-primary">
                <Zap size={16} /> 🤖 AI RECOMMENDATION:
              </div>
              <p className="ai-text">
                "Based on historical data, 30% discount predicted to sell 90% of stock before expiry. This would save $121 of the $135 at risk."
              </p>
              <div className="alert-actions mt-2">
                <button className="btn-primary small">APPLY 30% DISCOUNT</button>
                <button className="btn-secondary small">TRANSFER TO UPTOWN</button>
                <button className="btn-secondary small">DONATE</button>
                <button className="btn-text small">DISMISS</button>
              </div>
            </div>
          </div>

          <div className="alert-card critical-alert">
            <div className="alert-main">
              <div className="alert-title">
                <CheckSquare size={16} className="text-dim" />
                <h3>🧀 CHEDDAR CHEESE</h3>
                <span className="badge badge-danger ml-auto">Batch: C2392</span>
              </div>
              <div className="alert-details">
                <span>Quantity: 23 units</span> | <span>Location: Cooler B</span>
              </div>
              <div className="alert-details text-danger font-bold">
                Expires: Dec 20, 2024 (3 days left)
              </div>
              <div className="alert-details">
                Est. Loss if wasted: $115
              </div>
            </div>
            <div className="alert-ai">
              <div className="ai-header text-primary">
                <Zap size={16} /> 🤖 AI RECOMMENDATION:
              </div>
              <p className="ai-text">
                "15% discount or transfer to Uptown store (they have high demand) Transfer would save 100% of value."
              </p>
              <div className="alert-actions mt-2">
                <button className="btn-secondary small">APPLY 15% DISCOUNT</button>
                <button className="btn-primary small">TRANSFER TO UPTOWN</button>
                <button className="btn-secondary small">DONATE</button>
                <button className="btn-text small">DISMISS</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel border-warning mb-4">
        <div className="panel-header">
          <h2 className="text-warning flex items-center gap-2">
            <AlertTriangle size={18} /> 🟡 HIGH (5 alerts - Action within 3 days)
          </h2>
        </div>
        <div className="alert-list">
          <div className="alert-card warning-alert">
            <div className="alert-main">
              <div className="alert-title">
                <CheckSquare size={16} className="text-dim" />
                <h3>🥖 SOURDOUGH BREAD</h3>
                <span className="badge badge-warning ml-auto">Batch: B2410</span>
              </div>
              <div className="alert-details">
                <span>Quantity: 67 units</span> | <span>Location: Shelf 3</span>
              </div>
              <div className="alert-details text-warning font-bold">
                Expires: Dec 19, 2024 (2 days left)
              </div>
              <div className="alert-details">
                Est. Loss if wasted: $100
              </div>
            </div>
            <div className="alert-ai">
              <div className="ai-header text-primary">
                <Zap size={16} /> 🤖 AI RECOMMENDATION:
              </div>
              <p className="ai-text">
                "BOGO (Buy 1 Get 1 Free) predicted to clear 85% of inventory before expiry."
              </p>
              <div className="alert-actions mt-2">
                <button className="btn-primary small">APPLY BOGO</button>
                <button className="btn-secondary small">TRANSFER</button>
                <button className="btn-secondary small">DONATE</button>
                <button className="btn-text small">DISMISS</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-main">
            <CheckSquare size={18} className="text-primary" />
            <span>BULK ACTIONS: 2 items selected (Dairy alerts)</span>
          </div>
          <button className="btn-primary">BULK DISCOUNT 25%</button>
        </div>
      </div>
    </div>
  );
};
