import React from 'react';
import { FileText, Plus, Search, Eye, RefreshCw, CheckCircle, Trash2 } from 'lucide-react';
import './PurchaseOrders.css';

export const PurchaseOrders: React.FC = () => {
  return (
    <div className="po-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <button className="btn-primary flex-1">📄 ACTIVE POs</button>
        <button className="btn-secondary flex-1">✅ DELIVERED</button>
        <button className="btn-secondary flex-1">📊 VENDOR PERFORMANCE</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>ACTIVE PURCHASE ORDERS</h2>
          </div>
          <div className="po-list">
            <div className="po-card">
              <div className="po-header border-b border-glass pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="font-bold">PO-001234</span>
                  <span className="text-muted mx-2">|</span>
                  <span className="text-main">Dairy Fresh Co</span>
                </div>
                <div className="text-primary font-bold">$2,450</div>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <div>
                  <span className="text-success flex items-center gap-1">● CONFIRMED</span>
                  <span className="text-dim text-xs mt-1 block">Created: Dec 18, 2024</span>
                </div>
                <div className="text-right">
                  <span className="text-muted block">Expected: Dec 20, 2024</span>
                </div>
              </div>
              <div className="text-sm text-muted mb-3 border-l-2 border-primary pl-2">
                Items: 2% Milk (200u), Whole Milk (150u), Cheese (50u)
              </div>
              <div className="flex gap-2 border-t border-glass pt-3 mt-auto">
                <button className="btn-secondary small"><Eye size={14} /> VIEW DETAILS</button>
                <button className="btn-secondary small">TRACK DELIVERY</button>
                <button className="btn-secondary small">SEND REMINDER</button>
                <button className="btn-primary small ml-auto"><CheckCircle size={14} className="mr-1" /> MARK DELIVERED</button>
              </div>
            </div>

            <div className="po-card">
              <div className="po-header border-b border-glass pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-warning" />
                  <span className="font-bold">PO-001235</span>
                  <span className="text-muted mx-2">|</span>
                  <span className="text-main">Produce World</span>
                </div>
                <div className="text-warning font-bold">$890</div>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <div>
                  <span className="text-warning flex items-center gap-1">● SENT TO VENDOR</span>
                  <span className="text-dim text-xs mt-1 block">Created: Dec 17, 2024</span>
                </div>
                <div className="text-right">
                  <span className="text-muted block">Expected: Dec 19, 2024</span>
                </div>
              </div>
              <div className="text-sm text-muted mb-3 border-l-2 border-warning pl-2">
                Items: Lettuce (100u), Tomatoes (200u), Cucumbers (80u)
              </div>
              <div className="flex gap-2 border-t border-glass pt-3 mt-auto">
                <button className="btn-secondary small"><Eye size={14} /> VIEW DETAILS</button>
                <button className="btn-secondary small text-danger"><Trash2 size={14} /> CANCEL ORDER</button>
                <button className="btn-secondary small ml-auto"><RefreshCw size={14} className="mr-1" /> RESEND</button>
              </div>
            </div>

            <div className="po-card opacity-80">
              <div className="po-header border-b border-glass pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-dim" />
                  <span className="font-bold">PO-001236</span>
                  <span className="text-muted mx-2">|</span>
                  <span className="text-main">Bakery Supplies</span>
                </div>
                <div className="text-dim font-bold">$3,200</div>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <div>
                  <span className="text-muted flex items-center gap-1">● DRAFT</span>
                  <span className="text-dim text-xs mt-1 block">Created: Dec 18, 2024</span>
                </div>
                <div className="text-right">
                  <span className="text-muted block">Expected: Dec 21, 2024</span>
                </div>
              </div>
              <div className="text-sm text-muted mb-3 border-l-2 border-glass pl-2">
                Items: Bread Flour (500kg), Yeast (50kg), Salt (30kg)
              </div>
              <div className="flex gap-2 border-t border-glass pt-3 mt-auto">
                <button className="btn-secondary small">EDIT</button>
                <button className="btn-primary small">SEND TO VENDOR</button>
                <button className="btn-secondary small ml-auto text-danger"><Trash2 size={14} /> DELETE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2 className="flex items-center gap-2"><Plus size={18} className="text-primary" /> CREATE NEW PO</h2>
          </div>
          <form className="create-po-form">
            <div className="form-group mb-3">
              <label className="text-xs text-muted block mb-1">Vendor:</label>
              <select className="terminal-select w-full">
                <option>Dairy Fresh Co</option>
                <option>Produce World</option>
                <option>Bakery Supplies</option>
              </select>
            </div>
            
            <div className="form-group mb-3">
              <label className="text-xs text-muted block mb-1">Branch:</label>
              <select className="terminal-select w-full">
                <option>Downtown Store</option>
                <option>Uptown Store</option>
              </select>
            </div>

            <div className="form-group mb-4">
              <label className="text-xs text-muted block mb-1">Expected Delivery:</label>
              <input type="date" className="terminal-input w-full" defaultValue="2024-12-22" />
            </div>

            <div className="items-section mb-4">
              <label className="text-xs text-muted block mb-2">Items:</label>
              <table className="terminal-table text-xs">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2% Milk</td>
                    <td><input type="number" className="terminal-input small w-16 px-1 py-1" defaultValue="200" /></td>
                    <td>$2.50</td>
                    <td>$500.00</td>
                  </tr>
                  <tr>
                    <td>Whole Milk</td>
                    <td><input type="number" className="terminal-input small w-16 px-1 py-1" defaultValue="150" /></td>
                    <td>$2.50</td>
                    <td>$375.00</td>
                  </tr>
                  <tr>
                    <td>Cheddar</td>
                    <td><input type="number" className="terminal-input small w-16 px-1 py-1" defaultValue="50" /></td>
                    <td>$5.00</td>
                    <td>$250.00</td>
                  </tr>
                </tbody>
              </table>
              <button type="button" className="btn-text text-primary text-xs w-full mt-2">+ ADD ITEM</button>
            </div>

            <div className="po-totals bg-primary-dark p-3 rounded mb-4 text-sm font-mono">
              <div className="flex justify-between mb-1"><span>Subtotal:</span> <span>$1,125.00</span></div>
              <div className="flex justify-between mb-2"><span>Tax (10%):</span> <span>$112.50</span></div>
              <div className="flex justify-between font-bold text-primary border-t border-primary pt-1"><span>TOTAL:</span> <span>$1,237.50</span></div>
            </div>

            <div className="flex flex-col gap-2">
              <button type="button" className="btn-primary w-full text-center justify-center">SEND TO VENDOR</button>
              <button type="button" className="btn-secondary w-full text-center justify-center">SAVE AS DRAFT</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
