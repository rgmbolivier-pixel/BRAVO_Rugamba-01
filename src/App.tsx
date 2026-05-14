import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/Layout/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Authentication
import { Login } from './pages/Login/Login';

// HQ Admin Pages
import { Analytics } from './pages/Analytics/Analytics';
import { Branches } from './pages/Branches/Branches';
import { Users } from './pages/Users/Users';
import { Vendors } from './pages/Vendors/Vendors';
import { PurchaseOrders } from './pages/PurchaseOrders/PurchaseOrders';
import { Invoicing } from './pages/Invoicing/Invoicing';
import { AllActivities } from './pages/AllActivities/AllActivities';

// Store Manager Pages
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Inventory } from './pages/Inventory/Inventory';
import { Alerts } from './pages/Alerts/Alerts';
import { Transfers } from './pages/Transfers/Transfers';
import { StaffActivities } from './pages/StaffActivities/StaffActivities';

// Store Staff Pages
import { MyShift } from './pages/MyShift/MyShift';
import { WasteLog } from './pages/WasteLog/WasteLog';
import { Receiving } from './pages/Receiving/Receiving';
import { Tasks } from './pages/Tasks/Tasks';

// System
import { Settings } from './pages/Settings/Settings';
import { Donations } from './pages/Donations/Donations';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

function NotFoundRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* --- Role matrix (see src/utils/roleAccess.ts) --- */}
            {/* HQ Admin only */}
            <Route path="/branches" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Branches /></Layout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Users /></Layout></ProtectedRoute>} />
            <Route path="/invoicing" element={<ProtectedRoute allowedRoles={['admin']}><Layout><Invoicing /></Layout></ProtectedRoute>} />
            <Route path="/all-activities" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AllActivities /></Layout></ProtectedRoute>} />

            {/* Admin + Store Manager (no floor staff) */}
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Layout><Analytics /></Layout></ProtectedRoute>} />
            <Route path="/vendors" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Layout><Vendors /></Layout></ProtectedRoute>} />
            <Route path="/purchase-orders" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Layout><PurchaseOrders /></Layout></ProtectedRoute>} />
            <Route path="/transfers" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Layout><Transfers /></Layout></ProtectedRoute>} />
            <Route path="/staff-activities" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Layout><StaffActivities /></Layout></ProtectedRoute>} />

            {/* All authenticated roles */}
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><Settings /></Layout></ProtectedRoute>} />
            <Route path="/donations" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><Donations /></Layout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><Inventory /></Layout></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><Alerts /></Layout></ProtectedRoute>} />
            <Route path="/waste-log" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><WasteLog /></Layout></ProtectedRoute>} />
            <Route path="/receiving" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'staff']}><Layout><Receiving /></Layout></ProtectedRoute>} />

            {/* Store floor + manager (not HQ-only admin workflow) */}
            <Route path="/tasks" element={<ProtectedRoute allowedRoles={['manager', 'staff']}><Layout><Tasks /></Layout></ProtectedRoute>} />

            {/* Staff only */}
            <Route path="/my-shift" element={<ProtectedRoute allowedRoles={['staff']}><Layout><MyShift /></Layout></ProtectedRoute>} />

            {/* Default Fallback */}
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
