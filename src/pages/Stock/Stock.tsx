import React, { useState } from 'react';
import { 
  Package, 
  Layers, 
  Box, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ArrowUpDown,
  Barcode
} from 'lucide-react';

const products = [
  { sku: 'MILK-001', name: 'Organic Milk 2%', category: 'Dairy', price: 3.49, stock: 234, status: 'Healthy' },
  { sku: 'EGG-001', name: 'Large Brown Eggs', category: 'Produce', price: 5.99, stock: 1200, status: 'Low Stock' },
  { sku: 'BRD-001', name: 'Sourdough Bread', category: 'Bakery', price: 4.50, stock: 45, status: 'Critical' },
  { sku: 'BTR-001', name: 'Unsalted Butter', category: 'Dairy', price: 6.25, stock: 89, status: 'Healthy' },
];

export const Stock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'INVENTORY' | 'BATCHES'>('PRODUCTS');

  return (
    <div className="stock-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="font-heading">Stock Management</h1>
          <p className="text-muted">Master inventory control and product directory</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Barcode size={18} />
            Scan Barcode
          </button>
          <button className="btn-primary">
            <Plus size={18} />
            New Product
          </button>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'PRODUCTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('PRODUCTS')}
          >
            <Box size={18} />
            Products
          </button>
          <button 
            className={`tab ${activeTab === 'INVENTORY' ? 'active' : ''}`}
            onClick={() => setActiveTab('INVENTORY')}
          >
            <Layers size={18} />
            Inventory Levels
          </button>
          <button 
            className={`tab ${activeTab === 'BATCHES' ? 'active' : ''}`}
            onClick={() => setActiveTab('BATCHES')}
          >
            <Package size={18} />
            Batch Tracking
          </button>
        </div>
      </div>

      <div className="stock-content">
        <div className="table-controls">
          <div className="search-box glass">
            <Search size={18} />
            <input type="text" placeholder="Search by SKU, name, or category..." />
          </div>
          <button className="filter-btn glass">
            <Filter size={18} />
            Filter
          </button>
          <button className="sort-btn glass">
            <ArrowUpDown size={18} />
            Sort
          </button>
        </div>

        <div className="table-container glass">
          <table className="stock-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Total Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.sku}>
                  <td className="sku-cell">{product.sku}</td>
                  <td className="name-cell">{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td className="stock-cell">
                    <span className="stock-value">{product.stock}</span>
                    <div className="stock-bar">
                      <div 
                        className={`bar-fill ${product.status.toLowerCase().replace(' ', '-')}`} 
                        style={{ width: `${Math.min((product.stock/1000)*100, 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stock-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tabs-container {
          border-bottom: 1px solid var(--border-glass);
        }

        .tabs {
          display: flex;
          gap: 32px;
        }

        .tab {
          background: transparent;
          border: none;
          color: var(--text-dim);
          padding: 12px 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          transition: var(--transition);
        }

        .tab.active { color: var(--primary); }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .table-controls {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 100px;
        }

        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-main);
          outline: none;
          width: 100%;
        }

        .filter-btn, .sort-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 100px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .table-container {
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .stock-table {
          width: 100%;
          border-collapse: collapse;
        }

        .stock-table th {
          text-align: left;
          padding: 16px;
          color: var(--text-dim);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid var(--border-glass);
        }

        .stock-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-glass);
          font-size: 0.9rem;
        }

        .sku-cell { font-family: monospace; color: var(--text-dim); }
        .name-cell { font-weight: 600; }

        .stock-cell {
          width: 150px;
        }

        .stock-value { font-weight: 700; margin-bottom: 4px; display: block; }

        .stock-bar {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .bar-fill { height: 100%; }
        .bar-fill.healthy { background: var(--success); }
        .bar-fill.low-stock { background: var(--warning); }
        .bar-fill.critical { background: var(--danger); }

        .status-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
        }

        .status-badge.healthy { background: var(--success-glow); color: var(--success); }
        .status-badge.low-stock { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .status-badge.critical { background: var(--danger-glow); color: var(--danger); }

        .icon-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: var(--transition);
        }

        .icon-btn:hover { background: var(--bg-glass); color: var(--text-main); }
      `}</style>
    </div>
  );
};
