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
  ArrowRightLeft, // Untuk Stock Movement
  ClipboardCheck,  // Untuk Stock Opname
  History,
  UserCog,
  FileClock       // Untuk Shift Records
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
      /* Menggunakan ArrowRightLeft untuk melambangkan barang masuk/keluar */
      { icon: <ArrowRightLeft size={20} />, label: 'Stock In/Out', path: '/inventory/stock-movement' },
      /* Menggunakan ClipboardCheck untuk melambangkan proses audit/verifikasi stok */
      { icon: <ClipboardCheck size={20} />, label: 'Stock Opname', path: '/inventory/stock-opname' },
      { icon: <Truck size={20} />, label: 'Suppliers', path: '/inventory/suppliers' },
    ]
  },
  {
    label: 'Sales & Reports',
    items: [
      { icon: <History size={20} />, label: 'Transaction History', path: '/cashier/history' },
      { icon: <BarChart3 size={20} />, label: 'Sales Analytics', path: '/reports/sales' },
      /* Menggunakan FileClock agar beda dengan 'Current Shift' di atas */
      { icon: <FileClock size={20} />, label: 'Shift Records', path: '/reports/shifts' },
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