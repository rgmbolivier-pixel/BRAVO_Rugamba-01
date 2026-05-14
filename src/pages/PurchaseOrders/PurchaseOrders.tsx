import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye, RefreshCw, CheckCircle, Trash2, Loader2 } from 'lucide-react';
import { supplyChainService, inventoryService } from '../../services/api';
import { Pagination } from '../../components/Pagination';
import './PurchaseOrders.css';

type PoTab = 'ACTIVE' | 'DELIVERED' | 'VENDOR';

export const PurchaseOrders: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PoTab>('ACTIVE');
  const [pos, setPos] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [poRes, vendorRes, branchRes] = await Promise.all([
        supplyChainService.getPOs({ page }),
        supplyChainService.getVendors(),
        inventoryService.getBranches()
      ]);
      const poData = poRes.data;
      if (poData.results) {
        setPos(poData.results);
        setTotalCount(poData.count);
      } else {
        const poList = Array.isArray(poData) ? poData : [];
        setPos(poList);
        setTotalCount(poList.length);
      }
      
      setVendors(Array.isArray(vendorRes.data) ? vendorRes.data : (vendorRes.data.results || []));
      setBranches(Array.isArray(branchRes.data) ? branchRes.data : (branchRes.data.results || []));
    } catch (err) {
      console.error('Failed to fetch PO data', err);
    } finally {
      setLoading(false);
    }
  };

  const activePos = pos.filter(p => p.status === 'pending' || p.status === 'late');
  const deliveredPos = pos.filter(p => p.status === 'delivered');

  return (
    <div className="po-container page-container terminal-ui">
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`btn-primary flex-1${tab === 'ACTIVE' ? '' : ' opacity-70'}`}
          onClick={() => setTab('ACTIVE')}
        >
          📄 ACTIVE POs
        </button>
        <button
          type="button"
          className={`btn-secondary flex-1${tab === 'DELIVERED' ? ' border-primary' : ''}`}
          onClick={() => setTab('DELIVERED')}
        >
          ✅ DELIVERED
        </button>
        <button
          type="button"
          className={`btn-secondary flex-1${tab === 'VENDOR' ? ' border-primary' : ''}`}
          onClick={() => setTab('VENDOR')}
        >
          📊 VENDOR PERFORMANCE
        </button>
      </div>

      <div className="main-grid">
        {loading ? (
          <div className="panel col-span-2 flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-primary mr-3" />
            <span className="font-bold">FETCHING ORDERS...</span>
          </div>
        ) : tab === 'VENDOR' ? (
          <div className="panel col-span-2">
            <div className="panel-header">
              <h2>VENDOR PERFORMANCE</h2>
            </div>
            <p className="text-muted mb-4">
              On-time delivery, fill rate, and quality scores are synced from receiving logs. Open the vendor directory for contracts and contacts.
            </p>
            <button type="button" className="btn-primary" onClick={() => navigate('/vendors')}>
              OPEN VENDOR DIRECTORY
            </button>
          </div>
        ) : tab === 'DELIVERED' ? (
          <div className="panel col-span-2">
            <div className="panel-header">
              <h2>DELIVERED PURCHASE ORDERS</h2>
            </div>
            {deliveredPos.length === 0 ? (
              <p className="text-muted">No delivered orders found.</p>
            ) : (
              <ul className="text-sm text-main" style={{ lineHeight: 1.8 }}>
                {deliveredPos.map(po => (
                  <li key={po.id}>{po.code} · {po.vendor_name} · ${po.amount} · ✅ Received</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
        <div className="panel col-span-2">
          <div className="panel-header">
            <h2>ACTIVE PURCHASE ORDERS ({activePos.length})</h2>
          </div>
          <div className="po-list">
            {activePos.length === 0 && <p className="text-muted">No active orders.</p>}
            {activePos.map(po => (
              <div className="po-card" key={po.id}>
                <div className="po-header border-b border-glass pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className={po.status === 'late' ? 'text-warning' : 'text-primary'} />
                    <span className="font-bold">{po.code}</span>
                    <span className="text-muted mx-2">|</span>
                    <span className="text-main">{po.vendor_name}</span>
                  </div>
                  <div className="text-primary font-bold">${po.amount}</div>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <div>
                    <span className={po.status === 'late' ? 'text-warning flex items-center gap-1' : 'text-success flex items-center gap-1'}>
                      ● {po.status.toUpperCase()}
                    </span>
                    <span className="text-dim text-xs mt-1 block">Created: {po.date}</span>
                  </div>
                </div>
                <div className="text-sm text-muted mb-3 border-l-2 border-primary pl-2">
                  Branch: {po.branch_name}
                </div>
                <div className="flex gap-2 border-t border-glass pt-3 mt-auto">
                  <button className="btn-secondary small"><Eye size={14} /> VIEW DETAILS</button>
                  <button className="btn-primary small ml-auto"><CheckCircle size={14} className="mr-1" /> MARK DELIVERED</button>
                </div>
              </div>
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={10}
            onPageChange={setCurrentPage}
            loading={loading}
          />
        </div>
        )}

        <div className="panel">
          <div className="panel-header">
            <h2 className="flex items-center gap-2"><Plus size={18} className="text-primary" /> CREATE NEW PO</h2>
          </div>
          <form className="create-po-form">
            <div className="form-group mb-3">
              <label className="text-xs text-muted block mb-1">Vendor:</label>
              <select className="terminal-select w-full">
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            
            <div className="form-group mb-3">
              <label className="text-xs text-muted block mb-1">Branch:</label>
              <select className="terminal-select w-full">
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
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
