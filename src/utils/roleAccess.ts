import type { UserRole } from '../context/AuthContext';

/**
 * Route ↔ role map (mirrors `App.tsx`):
 *
 * - ADMIN only: /branches, /users, /invoicing, /all-activities
 * - ADMIN + MANAGER: /analytics, /vendors, /purchase-orders, /transfers, /staff-activities
 * - ADMIN + MANAGER + STAFF: /dashboard, /inventory, /alerts, /waste-log, /receiving, /donations, /settings
 * - MANAGER + STAFF: /tasks
 * - STAFF only: /my-shift
 */
export function canAccessManagerOps(role: UserRole): boolean {
  return role === 'admin' || role === 'manager';
}

/** Transfers are approved / coordinated by managers (not floor staff) */
export function canAccessTransfers(role: UserRole): boolean {
  return role === 'admin' || role === 'manager';
}

/** Staff activities monitoring is for managers and admins (not floor staff) */
export function canAccessStaffActivities(role: UserRole): boolean {
  return role === 'admin' || role === 'manager';
}

/** Where to send users who hit a route their role cannot open */
export function forbiddenRedirectForRole(): string {
  return '/dashboard';
}
