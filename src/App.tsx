import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';

// Authentication
import { Login } from './pages/Login/Login';

// HQ Admin Pages
import { Analytics } from './pages/Analytics/Analytics';
import { Branches } from './pages/Branches/Branches';
import { Users } from './pages/Users/Users';
import { Vendors } from './pages/Vendors/Vendors';
import { PurchaseOrders } from './pages/PurchaseOrders/PurchaseOrders';
import { Invoicing } from './pages/Invoicing/Invoicing';

// Store Manager Pages
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Inventory } from './pages/Inventory/Inventory';
import { Alerts } from './pages/Alerts/Alerts';
import { Transfers } from './pages/Transfers/Transfers';

// Store Staff Pages
import { MyShift } from './pages/MyShift/MyShift';
import { WasteLog } from './pages/WasteLog/WasteLog';
import { Receiving } from './pages/Receiving/Receiving';
import { Tasks } from './pages/Tasks/Tasks';

// System
import { Settings } from './pages/Settings/Settings';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* HQ Admin Only Pages */}
          <Route path="/analytics" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Analytics /></Layout></ProtectedRoute>} />
          <Route path="/branches" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Branches /></Layout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Users /></Layout></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Vendors /></Layout></ProtectedRoute>} />
          <Route path="/invoicing" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Invoicing /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['ADMIN']}><Layout><Settings /></Layout></ProtectedRoute>} />

          {/* Admin & Manager Pages */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}><Layout><Transfers /></Layout></ProtectedRoute>} />
          
          {/* Purchase Orders (Admin: Full, Manager: View-Only). In this structure both can access, logic handles permissions within component */}
          <Route path="/purchase-orders" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}><Layout><PurchaseOrders /></Layout></ProtectedRoute>} />

          {/* Admin, Manager, Staff Shared Pages (Staff might have view-only logic within components) */}
          <Route path="/inventory" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}><Layout><Inventory /></Layout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}><Layout><Alerts /></Layout></ProtectedRoute>} />
          <Route path="/waste-log" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}><Layout><WasteLog /></Layout></ProtectedRoute>} />
          <Route path="/receiving" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}><Layout><Receiving /></Layout></ProtectedRoute>} />
          
          {/* Manager & Staff Pages */}
          <Route path="/tasks" element={<ProtectedRoute allowedRoles={['MANAGER', 'STAFF']}><Layout><Tasks /></Layout></ProtectedRoute>} />

          {/* Staff Only Page */}
          <Route path="/my-shift" element={<ProtectedRoute allowedRoles={['STAFF']}><Layout><MyShift /></Layout></ProtectedRoute>} />

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
