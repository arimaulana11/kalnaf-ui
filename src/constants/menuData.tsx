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
  ArrowRightLeft,
  ClipboardCheck,
  History,
  UserCog,
  FileClock,
  CreditCard,    // Baru: Untuk Billing
  Zap,           // Baru: Untuk Subscription
  MapPin,        // Baru: Untuk Multi-Outlet
  ShieldCheck,   // Baru: Untuk Audit Log
  Gift,           // Baru: Untuk Loyalty/Promo
  Database,
  Percent,
  Printer,
  Settings,
  Puzzle,
  HelpCircle,
  MessageSquare
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
      { icon: <ArrowRightLeft size={20} />, label: 'Stock Movement', path: '/inventory/stock-movement' },
      { icon: <ClipboardCheck size={20} />, label: 'Stock Opname', path: '/inventory/stock-opname' },
      { icon: <Truck size={20} />, label: 'Suppliers', path: '/inventory/suppliers' },
    ]
  },
  {
    label: 'Sales & Reports',
    items: [
      { icon: <History size={20} />, label: 'Transaction History', path: '/cashier/history' },
      { icon: <BarChart3 size={20} />, label: 'Sales Analytics', path: '/reports/sales' },
      { icon: <FileClock size={20} />, label: 'Shift Records', path: '/reports/shifts' },
    ]
  },
  {
    label: 'SaaS & Billing',
    items: [
      {
        icon: <Zap size={20} className="text-amber-500" />,
        label: 'Subscription Plan',
        path: '/billing/plan'
      },
      {
        icon: <Puzzle size={20} className="text-purple-500" />, // Icon Puzzle melambangkan Add-on
        label: 'Feature Add-ons',
        path: '/billing/addons',
        status: 'Ongoing' // Bisa ditandai ongoing jika marketplace fiturnya belum siap
      },
      {
        icon: <CreditCard size={20} />,
        label: 'Payment History',
        path: '/billing/history',
        status: 'Ongoing'
      },
      {
        icon: <MapPin size={20} />,
        label: 'Outlets / Branches',
        path: '/outlets',
        status: 'Ongoing'
      },
    ]
  },
  {
    label: 'Administration',
    items: [
      { icon: <Users size={20} />, label: 'Customers', path: '/customers' },
      {
        icon: <Gift size={20} />,
        label: 'Loyalty Program',
        path: '/marketing/loyalty',
        status: 'Ongoing'
      },
      { icon: <UserCog size={20} />, label: 'Staff Management', path: '/staff' },
      { icon: <Store size={20} />, label: 'Store Management', path: '/store' },
      {
        icon: <ShieldCheck size={20} />,
        label: 'Audit Logs',
        path: '/admin/logs',
        status: 'Ongoing'
      },
    ]
  },
  {
    label: 'Settings',
    items: [
      {
        icon: <Settings size={20} />,
        label: 'General Settings',
        path: '/settings/general',
        status: 'Ongoing'
        // Berisi: Nama toko, Alamat, Logo, Jam Operasional
      },
      {
        icon: <Printer size={20} />,
        label: 'Printer & Receipt',
        path: '/settings/receipt',
        status: 'Ongoing'
      },
      {
        icon: <Percent size={20} />,
        label: 'Taxes & Fees',
        path: '/settings/taxes',
        status: 'Ongoing'
      },
      {
        icon: <Database size={20} />,
        label: 'Backup & Export',
        path: '/settings/data',
        status: 'Ongoing'
      },
    ]
  },
  {
    label: 'Support',
    items: [
      {
        icon: <HelpCircle size={20} />,
        label: 'Help Center',
        path: '/support/guide',
        status: 'Ongoing'
      },
      {
        icon: <MessageSquare size={20} />,
        label: 'Chat Support',
        path: 'https://wa.me/yournumber',
        status: 'Ongoing',
        isExternal: true
      },
    ]
  }
];