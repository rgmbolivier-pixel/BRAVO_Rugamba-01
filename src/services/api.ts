import api from '../lib/api/client';

export const inventoryService = {
  getProducts: (params = {}) => api.get('/inventory/products/', { params }),
  getStock: (params = {}) => api.get('/inventory/stock/', { params }),
  addStock: (data: any) => api.post('/inventory/stock/', data),
  updateStock: (id: string | number, data: any) => api.put(`/inventory/stock/${id}/`, data),
  deleteStock: (id: string | number) => api.delete(`/inventory/stock/${id}/`),
  getAlerts: (params = {}) => api.get('/inventory/alerts/', { params }),
  generateAlerts: () => api.post('/inventory/alerts/generate/'),
  resolveAlert: (id: string | number, action: string, data: any = {}) => api.post(`/inventory/alerts/${id}/resolve/`, { action, ...data }),
  getBranches: (params = {}) => api.get('/inventory/branches/', { params }),
  addBranch: (data: any) => api.post('/inventory/branches/', data),
  updateBranch: (id: string | number, data: any) => api.put(`/inventory/branches/${id}/`, data),
  deleteBranch: (id: string | number) => api.delete(`/inventory/branches/${id}/`),
  getTransfers: (params = {}) => api.get('/inventory/transfers/', { params }),
  addTransfer: (data: any) => api.post('/inventory/transfers/', data),
  updateTransfer: (id: string | number, data: any) => api.put(`/inventory/transfers/${id}/`, data),
  deleteTransfer: (id: string | number) => api.delete(`/inventory/transfers/${id}/`),
};

export const userService = {
  getUsers: (params = {}) => api.get('/accounts/users/', { params }),
  createUser: (data: any) => api.post('/accounts/users/', data),
  updateUser: (id: string | number, data: any) => api.put(`/accounts/users/${id}/`, data),
  deleteUser: (id: string | number) => api.delete(`/accounts/users/${id}/`),
};

export const wasteService = {
  getRecords: (params = {}) => api.get('/waste/records/', { params }),
  addRecord: (data: any) => api.post('/waste/records/', data),
  deleteRecord: (id: string | number) => api.delete(`/waste/records/${id}/`),
};

export const taskService = {
  getTasks: (params = {}) => api.get('/tasks/', { params }),
  addTask: (data: any) => api.post('/tasks/', data),
  updateTask: (id: string | number, data: any) => api.put(`/tasks/${id}/`, data),
  deleteTask: (id: string | number) => api.delete(`/tasks/${id}/`),
};

export const analyticsService = {
  getWastePrediction: (productId: number) => api.post('/analytics/predict-waste/', { product_id: productId }),
  getDemandForecast: (productId: number, days: number = 30) => api.get(`/analytics/demand-forecast/?product_id=${productId}&days=${days}`),
  getDashboardSummary: () => api.get('/analytics/dashboard-summary/'),
  getNetworkStats: () => api.get('/analytics/network-stats/'),
  getBranchPerformance: () => api.get('/analytics/branch-performance/'),
  chat: (query: string) => api.post('/analytics/chat/', { query }),
};

export const supplyChainService = {
  getVendors: (params = {}) => api.get('/supply-chain/vendors/', { params }),
  addVendor: (data: any) => api.post('/supply-chain/vendors/', data),
  updateVendor: (id: string | number, data: any) => api.put(`/supply-chain/vendors/${id}/`, data),
  deleteVendor: (id: string | number) => api.delete(`/supply-chain/vendors/${id}/`),
  getPOs: (params = {}) => api.get('/supply-chain/pos/', { params }),
  addPO: (data: any) => api.post('/supply-chain/pos/', data),
  getInvoices: (params = {}) => api.get('/supply-chain/invoices/', { params }),
  approveInvoice: (id: string | number) => api.patch(`/supply-chain/invoices/${id}/`, { status: 'paid' }),
};

export const authService = {
  login: (credentials: any) => api.post('/accounts/login/', credentials),
  getUser: () => api.get('/accounts/me/'),
};

export default api;
