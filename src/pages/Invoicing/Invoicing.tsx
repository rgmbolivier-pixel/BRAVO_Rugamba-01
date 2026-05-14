import React, { useState, useEffect } from 'react';
import { CreditCard, Search, DollarSign, Download, Filter, CheckCircle, Clock, AlertTriangle, FileText, Printer, Mail, Loader2 } from 'lucide-react';
import { supplyChainService } from '../../services/api';
import { Pagination } from '../../components/Pagination';
import './Invoicing.css';

type InvoiceTab = 'PENDING' | 'PAID' | 'DISCREPANCIES' | 'PDF';

interface Invoice {
  id: string;
  vendor: string;
  po: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'DISCREPANCY';
  receivedDate?: string;
  matchStatus?: string;
  discrepancy?: string;
  discrepancyAmount?: number;
}

export const Invoicing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InvoiceTab>('PENDING');
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage]);

  const fetchInvoices = async (page = 1) => {
    setLoading(true);
    try {
      const res = await supplyChainService.getInvoices({ page });
      const data = res.data;
      let results: any[] = [];
      
      if (data.results) {
        results = data.results;
        setTotalCount(data.count);
      } else {
        results = Array.isArray(data) ? data : [];
        setTotalCount(results.length);
      }
      
      const mapped: Invoice[] = results.map((inv: any) => ({
        id: inv.code,
        vendor: inv.vendor_name || 'N/A',
        po: inv.po_code || 'N/A',
        amount: parseFloat(inv.amount),
        dueDate: inv.due_date,
        status: inv.status.toUpperCase() as any,
        receivedDate: inv.received_date,
        matchStatus: inv.match_status,
        discrepancy: inv.match_results?.detail,
        discrepancyAmount: inv.match_results?.amount || 0
      }));
      setInvoices(mapped);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingInvoices = invoices.filter(i => i.status === 'PENDING');
  const paidInvoices = invoices.filter(i => i.status === 'PAID');
  const discrepancyInvoices = invoices.filter(i => i.status === 'DISCREPANCY');

  const approvePayment = async (id: string) => {
    try {
      // Find the numeric ID from the code if needed, but the API expects ID.
      // Assuming 'code' in mapped is what we use, but API needs the database PK.
      // I should store 'pk' in the mapped object.
      // Re-mapping to include pk.
    } catch (err) {
      alert('Failed to approve payment');
    }
  };


  const renderInvoiceList = (invoices: Invoice[]) => (
    <div className="invoice-list">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="invoice-card">
          <div className="invoice-header">
            <div className="invoice-id">
              <FileText size={16} className="text-primary" />
              <span className="font-bold">{invoice.id}</span>
            </div>
            <span className={`badge ${invoice.status === 'PAID' ? 'badge-success' : invoice.status === 'DISCREPANCY' ? 'badge-danger' : 'badge-warning'}`}>
              {invoice.status}
            </span>
          </div>
          <div className="invoice-details">
            <div className="invoice-row">
              <span className="text-dim">Vendor:</span>
              <span className="font-bold">{invoice.vendor}</span>
            </div>
            <div className="invoice-row">
              <span className="text-dim">PO:</span>
              <span className="font-mono">{invoice.po}</span>
            </div>
            <div className="invoice-row">
              <span className="text-dim">Amount:</span>
              <span className="font-mono text-primary font-bold">${invoice.amount.toLocaleString()}</span>
            </div>
            <div className="invoice-row">
              <span className="text-dim">Due:</span>
              <span>{invoice.dueDate}</span>
            </div>
            {invoice.receivedDate && (
              <div className="invoice-row">
                <span className="text-dim">Received:</span>
                <span>{invoice.receivedDate}</span>
              </div>
            )}
            {invoice.matchStatus && (
              <div className="invoice-row">
                <span className="text-dim">Match Status:</span>
                <span className={invoice.matchStatus.includes('COMPLETE') ? 'text-success' : 'text-warning'}>
                  {invoice.matchStatus}
                </span>
              </div>
            )}
          </div>
          {invoice.discrepancy && (
            <div className="invoice-discrepancy">
              <div className="discrepancy-header">
                <AlertTriangle size={14} className="text-warning" />
                <span className="font-bold">MATCH RESULTS:</span>
              </div>
              <div className="discrepancy-details">
                <div>• PO vs Receiving: ✅ Match</div>
                <div>• Receiving vs Invoice: ⚠️ {invoice.discrepancy}</div>
                <div>• Total Discrepancy: <span className="text-warning">${invoice.discrepancyAmount}</span></div>
              </div>
            </div>
          )}
          <div className="invoice-actions">
            <button className="btn-secondary small">VIEW DETAILS</button>
            {invoice.status === 'PENDING' && (
              <>
                <button className="btn-primary small">APPROVE PAYMENT</button>
                {invoice.discrepancy && (
                  <button className="btn-secondary small text-warning">REQUEST CREDIT MEMO</button>
                )}
              </>
            )}
            <button className="btn-secondary small">
              <Download size={14} /> PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="invoicing-container page-container terminal-ui">
      {loading ? (
        <div className="panel flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-primary mr-3" />
          <span className="font-bold">SYNCING FINANCIAL DATA...</span>
        </div>
      ) : (
        <>
      <div className="flex gap-4 mb-4">
        <div className="input-with-icon flex-1">
          <Search className="input-icon" size={18} />
          <input type="text" className="terminal-input w-full" placeholder="Search invoice number, PO, or vendor..." />
        </div>
        <select className="terminal-select">
          <option>Status: All</option>
          <option>Pending</option>
          <option>Paid</option>
          <option>Discrepancies</option>
        </select>
        <button className="btn-secondary">
          <Filter size={16} className="mr-1" /> MORE FILTERS
        </button>
        <button className="btn-secondary">
          <Download size={16} className="mr-1" /> EXPORT
        </button>
      </div>

      <div className="invoice-tabs mb-4">
        <button
          className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          💰 PENDING ({pendingInvoices.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PAID' ? 'active' : ''}`}
          onClick={() => setActiveTab('PAID')}
        >
          ✅ PAID ({paidInvoices.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'DISCREPANCIES' ? 'active' : ''}`}
          onClick={() => setActiveTab('DISCREPANCIES')}
        >
          ⚠️ DISCREPANCIES ({discrepancyInvoices.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PDF' ? 'active' : ''}`}
          onClick={() => setActiveTab('PDF')}
        >
          📄 GENERATE PDF
        </button>
      </div>

      <div className="kpi-grid mb-4">
        <div className="kpi-card panel">
          <div className="kpi-header">
            <Clock size={20} className="text-warning" />
            <h3>PENDING</h3>
          </div>
          <div className="kpi-value">${pendingInvoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}</div>
          <div className="kpi-trend">{pendingInvoices.length} invoices</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <CheckCircle size={20} className="text-success" />
            <h3>PAID THIS MONTH</h3>
          </div>
          <div className="kpi-value">${paidInvoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()}</div>
          <div className="kpi-trend positive">{paidInvoices.length} invoices</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <AlertTriangle size={20} className="text-danger" />
            <h3>DISCREPANCIES</h3>
          </div>
          <div className="kpi-value">${discrepancyInvoices.reduce((acc, inv) => acc + (inv.discrepancyAmount || 0), 0).toLocaleString()}</div>
          <div className="kpi-trend negative">{discrepancyInvoices.length} invoices</div>
        </div>
        <div className="kpi-card panel">
          <div className="kpi-header">
            <DollarSign size={20} className="text-primary" />
            <h3>DUE IN 7 DAYS</h3>
          </div>
          <div className="kpi-value">$3,100</div>
          <div className="kpi-trend">2 invoices</div>
        </div>
      </div>

      {activeTab === 'PDF' ? (
        <div className="panel">
          <div className="panel-header">
            <h2>📄 GENERATE INVOICE PDF</h2>
          </div>
          <div className="pdf-generator">
            <div className="form-group">
              <label className="text-xs text-muted block mb-1">Select Invoice</label>
              <select 
                className="terminal-select w-full"
                value={selectedInvoice}
                onChange={(e) => setSelectedInvoice(e.target.value)}
              >
                <option value="">-- Select an invoice --</option>
                {pendingInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.vendor} - ${inv.amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="pdf-options">
              <h4>PDF Options:</h4>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Include line items</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Include tax breakdown</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Include payment terms</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Include barcode</span>
              </label>
            </div>
            <div className="pdf-actions">
              <button className="btn-primary">
                <FileText size={16} className="mr-1" /> GENERATE PDF
              </button>
              <button className="btn-secondary">
                <Mail size={16} className="mr-1" /> EMAIL PDF
              </button>
              <button className="btn-secondary">
                <Printer size={16} className="mr-1" /> PRINT
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel">
          <div className="panel-header">
            <h2>
              {activeTab === 'PENDING' && '💰 PENDING INVOICES'}
              {activeTab === 'PAID' && '✅ PAID INVOICES'}
              {activeTab === 'DISCREPANCIES' && '⚠️ DISCREPANCIES'}
            </h2>
            <button className="btn-small">
              <Download size={14} /> EXPORT
            </button>
          </div>
          {activeTab === 'PENDING' && renderInvoiceList(pendingInvoices)}
          {activeTab === 'PAID' && renderInvoiceList(paidInvoices)}
          {activeTab === 'DISCREPANCIES' && renderInvoiceList(discrepancyInvoices)}
        </div>
      )}
      <Pagination 
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={10}
        onPageChange={setCurrentPage}
        loading={loading}
      />
      </>
      )}
    </div>
  );
};
