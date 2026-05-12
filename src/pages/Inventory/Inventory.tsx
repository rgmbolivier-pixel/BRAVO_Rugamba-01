import React from 'react';
import { Search, AlertTriangle, Package, MapPin } from 'lucide-react';
import './Inventory.css';

export const Inventory: React.FC = () => {
  return (
    <div className="inventory-container page-container terminal-ui">
      <div className="search-bar panel mb-4">
        <div className="input-with-icon w-full">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search product by name/SKU/barcode..." />
        </div>
        <div className="filters">
          <select className="terminal-select">
            <option>Category: All</option>
            <option>Dairy</option>
            <option>Produce</option>
            <option>Bakery</option>
          </select>
          <select className="terminal-select">
            <option>Expiring: All</option>
            <option>This Week</option>
            <option>Next 30 Days</option>
          </select>
          <button className="btn-primary">SCAN BARCODE</button>
        </div>
      </div>

      <div className="panel mb-4 border-warning">
        <div className="panel-header">
          <h2 className="text-warning flex items-center gap-2">
            <AlertTriangle size={18} /> EXPIRING THIS WEEK (7 items) - Take action now!
          </h2>
        </div>
        <div className="expiring-list">
          <div className="expiring-card critical">
            <div className="exp-icon">🔴</div>
            <div className="exp-details">
              <h4>2% MILK</h4>
              <div className="exp-meta">
                <span>Batch: L2401</span>
                <span>Cooler A</span>
                <span>Cost: $2.50/unit</span>
              </div>
            </div>
            <div className="exp-status">
              <div className="font-bold">45 units</div>
              <div className="text-danger font-bold">EXPIRES: TODAY!</div>
              <div className="text-muted text-sm">Received: Dec 10, 2024</div>
              <div className="text-warning text-sm">Est Loss: $112.50</div>
            </div>
            <div className="exp-actions">
              <button className="btn-secondary small">DISCOUNT</button>
              <button className="btn-secondary small">TRANSFER</button>
              <button className="btn-primary small">MARK WASTE</button>
            </div>
          </div>

          <div className="expiring-card warning">
            <div className="exp-icon">🟡</div>
            <div className="exp-details">
              <h4>CHEDDAR CHEESE</h4>
              <div className="exp-meta">
                <span>Batch: C2392</span>
                <span>Cooler B</span>
                <span>Cost: $5.00/unit</span>
              </div>
            </div>
            <div className="exp-status">
              <div className="font-bold">23 units</div>
              <div className="text-warning font-bold">EXPIRES: Dec 20 (3 days)</div>
              <div className="text-muted text-sm">Received: Dec 5, 2024</div>
              <div className="text-warning text-sm">Est Loss: $115.00</div>
            </div>
            <div className="exp-actions">
              <button className="btn-secondary small">DISCOUNT</button>
              <button className="btn-secondary small">TRANSFER</button>
              <button className="btn-secondary small">MARK WASTE</button>
            </div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📦 ALL STOCK BY LOCATION</h2>
          </div>
          <div className="location-groups">
            <div className="location-group">
              <div className="loc-header">
                <div className="loc-title"><MapPin size={16} className="text-primary" /> 🧊 COOLER A (Dairy)</div>
                <div className="loc-value">Value: $2,340</div>
              </div>
              <ul className="loc-items">
                <li>
                  <span className="item-tree">├─</span>
                  <span className="item-name">2% Milk</span>
                  <span className="item-dots">................</span>
                  <span className="item-qty">45u</span>
                  <span className="item-batch">Batch L2401</span>
                  <span className="item-exp text-danger">🔴 Expires TODAY</span>
                </li>
                <li>
                  <span className="item-tree">├─</span>
                  <span className="item-name">Whole Milk</span>
                  <span className="item-dots">.............</span>
                  <span className="item-qty">32u</span>
                  <span className="item-batch">Batch L2402</span>
                  <span className="item-exp text-success">🟢 Expires Dec 25</span>
                </li>
                <li>
                  <span className="item-tree">├─</span>
                  <span className="item-name">Greek Yogurt</span>
                  <span className="item-dots">...........</span>
                  <span className="item-qty">89u</span>
                  <span className="item-batch">Batch Y2405</span>
                  <span className="item-exp text-success">🟢 Expires Dec 28</span>
                </li>
                <li>
                  <span className="item-tree">└─</span>
                  <span className="item-name">Cheddar Cheese</span>
                  <span className="item-dots">.........</span>
                  <span className="item-qty">23u</span>
                  <span className="item-batch">Batch C2392</span>
                  <span className="item-exp text-warning">🟡 Expires Dec 20</span>
                </li>
              </ul>
            </div>

            <div className="location-group">
              <div className="loc-header">
                <div className="loc-title"><MapPin size={16} className="text-primary" /> 🥬 COOLER B (Produce)</div>
                <div className="loc-value">Value: $1,890</div>
              </div>
              <ul className="loc-items">
                <li>
                  <span className="item-tree">├─</span>
                  <span className="item-name">Lettuce</span>
                  <span className="item-dots">................</span>
                  <span className="item-qty">45u</span>
                  <span className="item-batch">Batch L2405</span>
                  <span className="item-exp text-warning">🟡 Expires Dec 18</span>
                </li>
                <li>
                  <span className="item-tree">├─</span>
                  <span className="item-name">Tomatoes</span>
                  <span className="item-dots">...............</span>
                  <span className="item-qty">67u</span>
                  <span className="item-batch">Batch T2408</span>
                  <span className="item-exp text-success">🟢 Expires Dec 21</span>
                </li>
                <li>
                  <span className="item-tree">└─</span>
                  <span className="item-name">Cucumbers</span>
                  <span className="item-dots">..............</span>
                  <span className="item-qty">34u</span>
                  <span className="item-batch">Batch C2410</span>
                  <span className="item-exp text-warning">🟡 Expires Dec 19</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="panel border-danger">
          <div className="panel-header">
            <h2 className="text-danger flex items-center gap-2">
              <AlertTriangle size={18} /> LOW STOCK ALERTS (3)
            </h2>
          </div>
          <ul className="low-stock-list">
            <li>
              <div className="low-stock-info">
                <strong>Eggs</strong> (12 units left)
              </div>
              <div className="low-stock-action text-primary">→ Order 60 by tomorrow</div>
            </li>
            <li>
              <div className="low-stock-info">
                <strong>Butter</strong> (8 units left)
              </div>
              <div className="low-stock-action text-primary">→ Order 30 by tomorrow</div>
            </li>
            <li>
              <div className="low-stock-info">
                <strong>Coffee</strong> (15 units left)
              </div>
              <div className="low-stock-action text-primary">→ Order 50 by Friday</div>
            </li>
          </ul>
          <button className="btn-primary w-full mt-4">GENERATE POs</button>
        </div>
      </div>
    </div>
  );
};
