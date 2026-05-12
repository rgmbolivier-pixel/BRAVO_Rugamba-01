import React from 'react';
import { Camera, Search, Upload, Download, Trash2, Edit3 } from 'lucide-react';
import './WasteLog.css';

export const WasteLog: React.FC = () => {
  return (
    <div className="wastelog-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <button className="btn-primary flex-1">📝 LOG WASTE</button>
        <button className="btn-secondary flex-1">📊 TODAY'S WASTE</button>
        <button className="btn-secondary flex-1">📈 TRENDS</button>
        <button className="btn-secondary ml-auto"><Download size={16} /> EXPORT</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2 className="flex items-center gap-2"><Edit3 size={18} className="text-primary" /> LOG NEW WASTE</h2>
            <button className="btn-primary small"><Search size={14} className="mr-1" /> SCAN BARCODE</button>
          </div>
          <form className="log-waste-form">
            <div className="form-row grid grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Product:</label>
                <div className="input-with-icon">
                  <Search className="input-icon" size={14} />
                  <input type="text" className="terminal-input w-full" defaultValue="2% Milk" />
                </div>
              </div>
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Batch #:</label>
                <input type="text" className="terminal-input w-full" defaultValue="L2401" disabled />
                <span className="text-dim text-xs mt-1 block">(Auto-fills from scan)</span>
              </div>
            </div>

            <div className="form-row grid grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Quantity (units):</label>
                <input type="number" className="terminal-input w-full" defaultValue="45" />
              </div>
              <div className="form-group">
                <label className="text-xs text-muted block mb-1">Estimated Loss:</label>
                <input type="text" className="terminal-input w-full text-danger font-bold" value="$112.50" disabled />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="text-xs text-muted block mb-2">Waste Reason:</label>
              <div className="radio-group grid grid-cols-3 gap-2">
                <label className="radio-label">
                  <input type="radio" name="reason" value="expired" defaultChecked />
                  <span className="radio-custom"></span>
                  Expired (date passed)
                </label>
                <label className="radio-label">
                  <input type="radio" name="reason" value="damaged" />
                  <span className="radio-custom"></span>
                  Damaged packaging
                </label>
                <label className="radio-label">
                  <input type="radio" name="reason" value="quality" />
                  <span className="radio-custom"></span>
                  Quality issue
                </label>
                <label className="radio-label">
                  <input type="radio" name="reason" value="return" />
                  <span className="radio-custom"></span>
                  Customer return
                </label>
                <label className="radio-label">
                  <input type="radio" name="reason" value="theft" />
                  <span className="radio-custom"></span>
                  Theft
                </label>
                <label className="radio-label">
                  <input type="radio" name="reason" value="other" />
                  <span className="radio-custom"></span>
                  Other
                </label>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="text-xs text-muted block mb-1">Notes:</label>
              <textarea className="terminal-input w-full" rows={2} defaultValue="Dented carton, multiple units damaged"></textarea>
            </div>

            <div className="form-group mb-4">
              <label className="text-xs text-muted block mb-2">Photo Evidence (Required for damage):</label>
              <div className="flex gap-2">
                <button type="button" className="btn-secondary flex-1 flex justify-center items-center gap-2"><Camera size={16} /> TAKE PHOTO</button>
                <button type="button" className="btn-secondary flex-1 flex justify-center items-center gap-2"><Upload size={16} /> UPLOAD</button>
              </div>
            </div>

            <div className="flex gap-4 border-t border-glass pt-4">
              <button type="button" className="btn-primary flex-1 justify-center">SUBMIT WASTE LOG</button>
              <button type="button" className="btn-secondary flex-1 justify-center">CANCEL</button>
            </div>
          </form>
        </div>

        <div className="side-panels">
          <div className="panel mb-4">
            <div className="panel-header">
              <h2>📊 TODAY'S WASTE</h2>
            </div>
            <div className="waste-summary">
              <div className="waste-row mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Expired (45 units)</span>
                  <span className="text-danger font-bold">$135</span>
                </div>
                <div className="progress-bar"><div className="progress" style={{width: '70%', background: 'var(--danger)'}}></div></div>
              </div>
              <div className="waste-row mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Damaged (8 units)</span>
                  <span className="text-warning font-bold">$24</span>
                </div>
                <div className="progress-bar"><div className="progress" style={{width: '15%', background: 'var(--warning)'}}></div></div>
              </div>
              <div className="waste-row mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Quality (15 units)</span>
                  <span className="text-primary font-bold">$42</span>
                </div>
                <div className="progress-bar"><div className="progress" style={{width: '25%', background: 'var(--primary)'}}></div></div>
              </div>
              
              <div className="text-center pt-3 border-t border-glass">
                <div className="text-main font-bold text-lg">TOTAL TODAY: $201</div>
                <div className="text-success text-sm">▼ 15% vs yesterday</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>📋 RECENT LOGS</h2>
            </div>
            <div className="recent-logs overflow-y-auto" style={{maxHeight: '300px'}}>
              <table className="terminal-table w-full text-xs">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Loss</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-dim">Dec 18 10:32</td>
                    <td>2% Milk <span className="text-dim block text-[10px]">Expired (45u)</span></td>
                    <td className="text-danger">$112.50</td>
                  </tr>
                  <tr>
                    <td className="text-dim">Dec 18 09:15</td>
                    <td>Sourdough <span className="text-dim block text-[10px]">Quality (15u)</span></td>
                    <td className="text-warning">$22.50</td>
                  </tr>
                  <tr>
                    <td className="text-dim">Dec 17 16:20</td>
                    <td>Cheddar <span className="text-dim block text-[10px]">Damaged (8u)</span></td>
                    <td className="text-warning">$40.00</td>
                  </tr>
                  <tr>
                    <td className="text-dim">Dec 17 11:00</td>
                    <td>Greek Yogurt <span className="text-dim block text-[10px]">Expired (23u)</span></td>
                    <td className="text-danger">$34.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
