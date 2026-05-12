import React from 'react';
import { PackageSearch, Camera, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import './Receiving.css';

export const Receiving: React.FC = () => {
  return (
    <div className="receiving-container page-container terminal-ui">
      <div className="panel mb-4">
        <div className="panel-header border-none mb-0">
          <h2>📦 EXPECTED DELIVERIES TODAY</h2>
          <button className="btn-primary small"><PackageSearch size={14} className="mr-1" /> SCAN PO</button>
        </div>
        <div className="delivery-list grid grid-cols-2 gap-4 mt-4">
          <div className="delivery-card">
            <div className="flex justify-between border-b border-glass pb-2 mb-2">
              <div>
                <span className="font-bold text-main">PO-001234</span> | <span className="text-muted">Dairy Fresh Co</span>
              </div>
              <div className="text-dim text-sm">Expected: 10:30 AM</div>
            </div>
            <div className="text-sm text-muted mb-3">
              Items: 2% Milk (200u), Whole Milk (150u), Cheddar Cheese (50u)
            </div>
            <div className="flex justify-between items-center mt-auto pt-2">
              <span className="text-success flex items-center gap-1 text-sm"><span className="status-dot online"></span> On Time</span>
              <button className="btn-primary small">RECEIVE NOW</button>
            </div>
          </div>
          
          <div className="delivery-card opacity-80">
            <div className="flex justify-between border-b border-glass pb-2 mb-2">
              <div>
                <span className="font-bold text-main">PO-001236</span> | <span className="text-muted">Bakery Supplies</span>
              </div>
              <div className="text-dim text-sm">Expected: 2:00 PM</div>
            </div>
            <div className="text-sm text-muted mb-3">
              Items: Bread Flour (500kg), Yeast (50kg), Salt (30kg)
            </div>
            <div className="flex justify-between items-center mt-auto pt-2">
              <span className="text-warning flex items-center gap-1 text-sm"><Clock size={14} /> Scheduled</span>
              <button className="btn-secondary small" disabled>RECEIVE (when arrives)</button>
            </div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>📝 RECEIVING WORKFLOW - PO-001234</h2>
          </div>
          <div className="workflow-details mb-4">
            <span className="text-muted">Vendor:</span> <span className="text-main font-bold mr-4">Dairy Fresh Co</span>
            <span className="text-muted">PO Date:</span> <span className="text-main">Dec 18, 2024</span>
          </div>

          <div className="items-to-receive mb-6">
            <h3 className="text-primary text-sm font-mono mb-2 border-b border-primary-dark pb-1">ITEMS TO RECEIVE:</h3>
            <table className="terminal-table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>PO Qty</th>
                  <th>Received</th>
                  <th>Condition</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2% Milk</td>
                  <td className="text-muted">200u</td>
                  <td><input type="number" className="terminal-input small w-16" defaultValue="200" /></td>
                  <td>
                    <select className="terminal-select small">
                      <option>Good</option>
                      <option>Damaged</option>
                    </select>
                  </td>
                  <td><input type="date" className="terminal-input small" defaultValue="2024-12-25" /></td>
                </tr>
                <tr>
                  <td>Whole Milk</td>
                  <td className="text-muted">150u</td>
                  <td><input type="number" className="terminal-input small w-16" defaultValue="150" /></td>
                  <td>
                    <select className="terminal-select small">
                      <option>Good</option>
                      <option>Damaged</option>
                    </select>
                  </td>
                  <td><input type="date" className="terminal-input small" defaultValue="2024-12-26" /></td>
                </tr>
                <tr>
                  <td>Cheddar Cheese</td>
                  <td className="text-muted">50u</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <input type="number" className="terminal-input small w-16 border-danger" defaultValue="48" />
                      <AlertTriangle size={14} className="text-danger" />
                    </div>
                  </td>
                  <td>
                    <select className="terminal-select small border-danger text-danger">
                      <option>Good</option>
                      <option selected>Damaged</option>
                    </select>
                  </td>
                  <td><input type="date" className="terminal-input small" defaultValue="2024-12-20" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="quality-checks bg-primary-dark p-4 rounded mb-6">
            <h3 className="text-primary text-sm font-mono mb-3">QUALITY CHECKLIST:</h3>
            <div className="flex flex-col gap-3">
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" defaultChecked />
                <div className="checkbox-custom mt-1">
                  <CheckSquare size={16} className="text-primary" />
                </div>
                <div>
                  <div className="text-main">Temperature log verified</div>
                  <div className="text-xs text-muted">Cooler temp 38°F (acceptable range 35-40°F)</div>
                </div>
              </label>
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" defaultChecked />
                <div className="checkbox-custom mt-1">
                  <CheckSquare size={16} className="text-primary" />
                </div>
                <div>
                  <div className="text-main">Seal integrity intact</div>
                </div>
              </label>
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" defaultChecked />
                <div className="checkbox-custom mt-1">
                  <CheckSquare size={16} className="text-warning" />
                </div>
                <div>
                  <div className="text-main text-warning">Packaging condition issues noted</div>
                  <div className="text-xs text-danger flex items-center gap-1"><AlertTriangle size={12}/> 2 damaged units (Cheddar Cheese)</div>
                  <button className="btn-secondary small mt-2"><Camera size={12} className="mr-1"/> Attach Photos</button>
                </div>
              </label>
              <label className="checkbox-label flex items-start gap-2">
                <input type="checkbox" defaultChecked />
                <div className="checkbox-custom mt-1">
                  <CheckSquare size={16} className="text-primary" />
                </div>
                <div>
                  <div className="text-main">Documentation received</div>
                  <div className="text-xs text-muted">Invoice #INV-001234</div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="btn-primary flex-2 justify-center">COMPLETE RECEIVING</button>
            <button className="btn-secondary flex-1 justify-center text-danger border-danger">FLAG ISSUE</button>
            <button className="btn-secondary flex-1 justify-center">SAVE DRAFT</button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>📊 RECEIVING HISTORY</h2>
          </div>
          <div className="text-xs text-muted mb-4">Last 7 days</div>
          <ul className="history-list text-sm">
            <li>
              <div className="hist-main">
                <div className="flex justify-between">
                  <span className="text-main font-bold">PO-001233</span>
                  <span className="text-muted">Dec 17</span>
                </div>
                <span className="text-dim">Produce World</span>
              </div>
              <div className="hist-meta mt-1">
                <div className="flex justify-between w-full">
                  <span className="text-success">98% received</span>
                  <span className="text-warning">2% damaged</span>
                </div>
              </div>
            </li>
            <li>
              <div className="hist-main">
                <div className="flex justify-between">
                  <span className="text-main font-bold">PO-001232</span>
                  <span className="text-muted">Dec 16</span>
                </div>
                <span className="text-dim">Dairy Fresh</span>
              </div>
              <div className="hist-meta mt-1">
                <div className="flex justify-between w-full">
                  <span className="text-success">100% received</span>
                  <span className="text-success">All good</span>
                </div>
              </div>
            </li>
            <li>
              <div className="hist-main">
                <div className="flex justify-between">
                  <span className="text-main font-bold">PO-001231</span>
                  <span className="text-muted">Dec 15</span>
                </div>
                <span className="text-dim">Bakery Sup</span>
              </div>
              <div className="hist-meta mt-1">
                <div className="flex justify-between w-full">
                  <span className="text-warning">95% received</span>
                  <span className="text-warning">5% short</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
