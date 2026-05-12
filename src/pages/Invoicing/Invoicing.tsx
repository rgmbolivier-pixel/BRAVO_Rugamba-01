import React from 'react';
import { CreditCard, Search, DollarSign, Download, Filter, CheckCircle, Clock } from 'lucide-react';
import './Invoicing.css';

export const Invoicing: React.FC = () => {
  return (
    <div className="invoicing-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <div className="input-with-icon flex-2">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search invoice number, PO, or vendor..." />
        </div>
        <div className="filters flex-1">
          <select className="terminal-select w-full">
            <option>Status: All</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
        </div>
        <button className="btn-secondary"><Filter size={16} className="mr-1" /> MORE FILTERS</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="panel border-primary">
          <div className="text-dim text-sm mb-1">Total Outstanding</div>
          <div className="text-primary text-2xl font-bold font-mono">$12,450</div>
        </div>
        <div className="panel border-success">
          <div className="text-dim text-sm mb-1">Paid This Month</div>
          <div className="text-success text-2xl font-bold font-mono">$45,200</div>
        </div>
        <div className="panel border-warning">
          <div className="text-dim text-sm mb-1">Due in 7 Days</div>
          <div className="text-warning text-2xl font-bold font-mono">$3,100</div>
        </div>
        <div className="panel border-danger">
          <div className="text-dim text-sm mb-1">Overdue</div>
          <div className="text-danger text-2xl font-bold font-mono">$0</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>💳 INVOICES</h2>
          <button className="btn-secondary small"><Download size={14} className="mr-1" /> EXPORT REPORT</button>
        </div>
        <table className="terminal-table w-full">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Vendor</th>
              <th>PO Ref</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold text-main">INV-2024-001</td>
              <td>Dairy Fresh Co</td>
              <td className="text-dim font-mono">PO-001234</td>
              <td className="font-mono text-main">$2,450.00</td>
              <td>Dec 30, 2024</td>
              <td><span className="badge badge-warning flex items-center w-max"><Clock size={12} className="mr-1"/> PENDING</span></td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-secondary small">VIEW</button>
                  <button className="btn-primary small"><DollarSign size={14} /> PAY NOW</button>
                </div>
              </td>
            </tr>
            <tr>
              <td className="font-bold text-main">INV-2024-002</td>
              <td>Produce World</td>
              <td className="text-dim font-mono">PO-001230</td>
              <td className="font-mono text-main">$890.00</td>
              <td>Dec 28, 2024</td>
              <td><span className="badge badge-warning flex items-center w-max"><Clock size={12} className="mr-1"/> PENDING</span></td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-secondary small">VIEW</button>
                  <button className="btn-primary small"><DollarSign size={14} /> PAY NOW</button>
                </div>
              </td>
            </tr>
            <tr className="opacity-70">
              <td className="font-bold text-main">INV-2024-003</td>
              <td>Bakery Supplies</td>
              <td className="text-dim font-mono">PO-001225</td>
              <td className="font-mono text-main">$3,200.00</td>
              <td>Dec 15, 2024</td>
              <td><span className="badge badge-success flex items-center w-max"><CheckCircle size={12} className="mr-1"/> PAID</span></td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-secondary small">VIEW</button>
                  <button className="btn-secondary small">RECEIPT</button>
                </div>
              </td>
            </tr>
            <tr className="opacity-70">
              <td className="font-bold text-main">INV-2024-004</td>
              <td>Dairy Fresh Co</td>
              <td className="text-dim font-mono">PO-001220</td>
              <td className="font-mono text-main">$2,100.00</td>
              <td>Dec 10, 2024</td>
              <td><span className="badge badge-success flex items-center w-max"><CheckCircle size={12} className="mr-1"/> PAID</span></td>
              <td>
                <div className="flex gap-2">
                  <button className="btn-secondary small">VIEW</button>
                  <button className="btn-secondary small">RECEIPT</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div className="flex justify-between items-center mt-4 border-t border-glass pt-4">
          <div className="text-sm text-muted">Showing 1-4 of 124 invoices</div>
          <div className="flex gap-2">
            <button className="btn-secondary small" disabled>PREV</button>
            <button className="btn-secondary small">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};
