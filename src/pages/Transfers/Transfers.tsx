import React from 'react';
import { Truck, ArrowRightLeft, MapPin, Search, CheckCircle, Navigation, Zap } from 'lucide-react';
import './Transfers.css';

export const Transfers: React.FC = () => {
  return (
    <div className="transfers-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <button className="btn-primary flex-1">🚚 ACTIVE</button>
        <button className="btn-secondary flex-1">✅ HISTORY</button>
        <button className="btn-secondary flex-1">📝 REQUEST TRANSFER</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>🚚 ACTIVE TRANSFERS</h2>
          </div>
          <div className="transfer-list">
            <div className="transfer-card">
              <div className="transfer-route">
                <div className="route-point">
                  <MapPin size={16} className="text-muted" /> Downtown
                </div>
                <div className="route-line">
                  <ArrowRightLeft size={16} className="text-primary" />
                </div>
                <div className="route-point">
                  <MapPin size={16} className="text-muted" /> Uptown
                </div>
              </div>
              <div className="transfer-details">
                <div className="flex justify-between mb-2">
                  <h4 className="text-main m-0">2% Milk (45 units)</h4>
                  <span className="badge badge-warning">Batch: L2401</span>
                </div>
                <div className="text-muted text-sm mb-2">Reason: Preventing waste - expires today</div>
                <div className="transfer-status flex items-center justify-between">
                  <div className="text-primary font-bold flex items-center gap-2">
                    <Truck size={16} /> 🚛 IN TRANSIT
                  </div>
                  <div className="text-dim text-sm">
                    Driver: John (555-0100) | ETA: 2 hours
                  </div>
                </div>
                <div className="text-dim text-xs mt-1">Requested: Dec 18, 09:30</div>
              </div>
              <div className="transfer-actions">
                <button className="btn-secondary small"><Navigation size={14} /> TRACK ON MAP</button>
                <button className="btn-secondary small">CONTACT DRIVER</button>
                <button className="btn-primary small">MARK DELIVERED</button>
              </div>
            </div>

            <div className="transfer-card border-success">
              <div className="transfer-route">
                <div className="route-point">
                  <MapPin size={16} className="text-muted" /> Northside
                </div>
                <div className="route-line">
                  <ArrowRightLeft size={16} className="text-primary" />
                </div>
                <div className="route-point text-primary font-bold">
                  <MapPin size={16} className="text-primary" /> Downtown
                </div>
              </div>
              <div className="transfer-details">
                <div className="flex justify-between mb-2">
                  <h4 className="text-main m-0">Eggs (60 units)</h4>
                  <span className="badge badge-success">Batch: E2405</span>
                </div>
                <div className="transfer-status flex items-center justify-between">
                  <div className="text-success font-bold flex items-center gap-2">
                    <CheckCircle size={16} /> ✅ APPROVED (Ready for pickup)
                  </div>
                  <div className="text-dim text-sm">
                    Est. arrival: 3 hours
                  </div>
                </div>
                <div className="text-dim text-xs mt-1">Requested: Dec 18, 08:00</div>
              </div>
              <div className="transfer-actions">
                <button className="btn-secondary small text-success">AWAITING DELIVERY</button>
                <button className="btn-secondary small">CONTACT SENDER</button>
              </div>
            </div>
          </div>
        </div>

        <div className="side-panels">
          <div className="panel mb-4 bg-primary-dark">
            <div className="panel-header border-none mb-0">
              <h2 className="text-primary flex items-center gap-2">
                <Zap size={18} /> 🤖 AI RECOMMENDED TRANSFERS
              </h2>
            </div>
            <p className="text-muted text-sm mb-4">Your store has surplus that could save other stores:</p>
            
            <div className="ai-transfer-card mb-3">
              <div className="text-main font-bold mb-1">• Sourdough Bread (45 units expiring Dec 19)</div>
              <div className="text-warning text-sm mb-2">→ Uptown store NEEDS 30 units (they are out of stock)</div>
              <div className="text-primary text-sm flex items-center gap-2 mb-3">
                <Zap size={14} /> Save: $45 waste + $60 lost sales = $105 value
              </div>
              <button className="btn-primary small w-full">TRANSFER 30 UNITS</button>
            </div>

            <div className="ai-transfer-card">
              <div className="text-main font-bold mb-1">• Cheddar Cheese (23 units expiring Dec 20)</div>
              <div className="text-warning text-sm mb-2">→ Northside store NEEDS 20 units (high demand)</div>
              <div className="text-primary text-sm flex items-center gap-2 mb-3">
                <Zap size={14} /> Save: $100 waste + $80 lost sales = $180 value
              </div>
              <button className="btn-primary small w-full">TRANSFER 20 UNITS</button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>📋 TRANSFER HISTORY (last 30 days)</h2>
            </div>
            <ul className="history-list">
              <li>
                <div className="hist-main">
                  <span className="text-muted text-sm">Dec 15</span>
                  <span className="text-main">Sent 50u Milk → Uptown</span>
                </div>
                <div className="hist-meta text-right">
                  <span className="text-success text-xs">✅ Completed</span>
                  <div className="text-primary text-xs">Saved $125</div>
                </div>
              </li>
              <li>
                <div className="hist-main">
                  <span className="text-muted text-sm">Dec 12</span>
                  <span className="text-main">Recv 30u Eggs ← Northside</span>
                </div>
                <div className="hist-meta text-right">
                  <span className="text-success text-xs">✅ Completed</span>
                  <div className="text-primary text-xs">In stock</div>
                </div>
              </li>
              <li>
                <div className="hist-main">
                  <span className="text-muted text-sm">Dec 10</span>
                  <span className="text-main">Sent 25u Bread → Westside</span>
                </div>
                <div className="hist-meta text-right">
                  <span className="text-success text-xs">✅ Completed</span>
                  <div className="text-primary text-xs">Saved $37</div>
                </div>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-glass text-center text-primary font-bold text-sm">
              Total waste prevented by transfers this month: $1,240
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
