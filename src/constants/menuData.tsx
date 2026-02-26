import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tag, 
  BarChart3, 
  Clock, 
  Users, 
  Store,
  Truck,
  ClipboardList,
  History,
  UserCog
} from 'lucide-react';

export const menuGroups = [
  {
    label: 'Main Dashboard',
    items: [
      { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
      { icon: <ShoppingCart size={20} />, label: 'Go to Cashier', path: '/cashier' },
      { icon: <Clock size={20} />, label: 'Current Shift', path: '/shift/active' },
    ]
  },
  {
    label: 'Catalog Management',
    items: [
      { icon: <Package size={20} />, label: 'Products', path: '/products' },
      { icon: <Tag size={20} />, label: 'Categories', path: '/categories' },
    ]
  },
  {
    label: 'Inventory & Stock',
    items: [
      { icon: <ClipboardList size={20} />, label: 'Stock In/Out', path: '/inventory/stock-opname' },
      { icon: <Truck size={20} />, label: 'Suppliers', path: '/inventory/suppliers' },
    ]
  },
  {
    label: 'Sales & Reports',
    items: [
      { icon: <History size={20} />, label: 'Transaction History', path: '/cashier/history' },
      { icon: <BarChart3 size={20} />, label: 'Sales Analytics', path: '/reports/sales' },
      { icon: <Clock size={20} />, label: 'Shift Records', path: '/reports/shifts' },
    ]
  },
  {
    label: 'Administration',
    items: [
      { icon: <Users size={20} />, label: 'Customers', path: '/customers' },
      { icon: <UserCog size={20} />, label: 'Staff Management', path: '/staff' },
      { icon: <Store size={20} />, label: 'Store Management', path: '/store' },
    ]
  }
];