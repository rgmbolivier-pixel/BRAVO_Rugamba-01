import React from 'react';
import { Search, Plus, Truck, Star, Phone, Mail, FileText, Activity } from 'lucide-react';
import './Vendors.css';

export const Vendors: React.FC = () => {
  return (
    <div className="vendors-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <div className="input-with-icon flex-2">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search vendors by name or ID..." />
        </div>
        <div className="filters flex-1">
          <select className="terminal-select w-full">
            <option>Category: All</option>
            <option>Dairy</option>
            <option>Produce</option>
            <option>Bakery</option>
          </select>
        </div>
        <button className="btn-primary"><Plus size={16} className="mr-1" /> ADD VENDOR</button>
      </div>

      <div className="main-grid">
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>🚚 APPROVED VENDORS</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="vendor-card border border-glass p-4 bg-black bg-opacity-40 rounded">
              <div className="flex justify-between items-start mb-3 border-b border-glass pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-glow rounded flex items-center justify-center text-primary">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-main font-bold m-0 text-lg">Dairy Fresh Co</h3>
                    <div className="text-muted text-xs">ID: VEN-001 | Category: Dairy</div>
                  </div>
                </div>
                <div className="flex text-warning">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted mb-4">
                <div className="flex items-center gap-2"><Phone size={14} className="text-primary"/> (555) 123-4567</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-primary"/> orders@dairyfresh.com</div>
              </div>
              <div className="flex gap-4 border-t border-glass pt-3 text-sm font-mono mb-4">
                <div className="flex-1">
                  <div className="text-dim text-xs">On-time Delivery</div>
                  <div className="text-success font-bold text-lg">98%</div>
                </div>
                <div className="flex-1">
                  <div className="text-dim text-xs">Active POs</div>
                  <div className="text-primary font-bold text-lg">3</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary small flex-1">DETAILS</button>
                <button className="btn-secondary small flex-1"><FileText size={14} className="mr-1"/> POs</button>
                <button className="btn-primary small flex-1">NEW PO</button>
              </div>
            </div>

            <div className="vendor-card border border-glass p-4 bg-black bg-opacity-40 rounded">
              <div className="flex justify-between items-start mb-3 border-b border-glass pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-glow rounded flex items-center justify-center text-primary">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="text-main font-bold m-0 text-lg">Produce World</h3>
                    <div className="text-muted text-xs">ID: VEN-002 | Category: Produce</div>
                  </div>
                </div>
                <div className="flex text-warning">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} />
                  <Star size={14} />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted mb-4">
                <div className="flex items-center gap-2"><Phone size={14} className="text-primary"/> (555) 987-6543</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-primary"/> supply@produceworld.com</div>
              </div>
              <div className="flex gap-4 border-t border-glass pt-3 text-sm font-mono mb-4">
                <div className="flex-1">
                  <div className="text-dim text-xs">On-time Delivery</div>
                  <div className="text-warning font-bold text-lg">82%</div>
                </div>
                <div className="flex-1">
                  <div className="text-dim text-xs">Active POs</div>
                  <div className="text-primary font-bold text-lg">1</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary small flex-1">DETAILS</button>
                <button className="btn-secondary small flex-1"><FileText size={14} className="mr-1"/> POs</button>
                <button className="btn-primary small flex-1">NEW PO</button>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2><Activity size={18} className="text-primary inline mr-2"/> VENDOR PERFORMANCE AI</h2>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <div className="bg-primary-dark p-3 border-l-2 border-warning">
              <strong className="text-warning block mb-1">Issue Detected: Produce World</strong>
              <p className="text-main mb-2">Delivery delays have increased by 15% this month.</p>
              <button className="btn-secondary small">SEND WARNING</button>
            </div>
            
            <div className="bg-primary-dark p-3 border-l-2 border-success">
              <strong className="text-success block mb-1">Top Performer: Dairy Fresh Co</strong>
              <p className="text-main mb-2">Consistently exceeding SLA. AI recommends negotiating bulk discount based on volume.</p>
              <button className="btn-primary small">GENERATE PROPOSAL</button>
            </div>

            <div className="bg-primary-dark p-3 border-l-2 border-danger">
              <strong className="text-danger block mb-1">Quality Alert: Bakery Supplies</strong>
              <p className="text-main">3 receiving incidents logged for damaged packaging this week.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
