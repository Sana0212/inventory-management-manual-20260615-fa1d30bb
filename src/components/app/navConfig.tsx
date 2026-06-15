import React from 'react';
import {
  Home,
  Boxes,
  ShoppingCart,
  Receipt,
  Truck,
  Warehouse,
  Users,
  Settings,
  Sliders,
  LogOut,
  UserCheck
} from 'lucide-react';

export interface NavItemItem {
  label: string;
  route: string;
  icon: any;
}

export const mainNav: NavItemItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: Home,
  },
  {
    label: 'Products',
    route: '/inventory/products',
    icon: Boxes,
  },
  {
    label: 'Purchase Orders',
    route: '/purchasing/purchase-orders',
    icon: ShoppingCart,
  },
  {
    label: 'Sales Orders',
    route: '/sales/sales-orders',
    icon: Receipt,
  },
];

export const secondaryNav: NavItemItem[] = [
  {
    label: 'Suppliers',
    route: '/purchasing/suppliers',
    icon: Truck,
  },
  {
    label: 'Warehouses',
    route: '/inventory/warehouses',
    icon: Warehouse,
  },
];

export const settingsNav: NavItemItem[] = [
  {
    label: 'Users',
    route: '/settings/users',
    icon: Users,
  },
  {
    label: 'General Settings',
    route: '/settings/general',
    icon: Settings,
  },
  {
    label: 'Inventory Settings',
    route: '/settings/inventory',
    icon: Sliders,
  },
];

export const byRoleNav: Record<string, { main: string[]; settings: string[] }> = {
  admin: {
    main: [
      '/dashboard',
      '/inventory/products',
      '/purchasing/purchase-orders',
      '/sales/sales-orders',
      '/purchasing/suppliers',
      '/inventory/warehouses'
    ],
    settings: [
      '/settings/users',
      '/settings/general',
      '/settings/inventory'
    ]
  },
  inventory_manager: {
    main: [
      '/dashboard',
      '/inventory/products',
      '/purchasing/purchase-orders',
      '/sales/sales-orders',
      '/purchasing/suppliers',
      '/inventory/warehouses'
    ],
    settings: []
  },
  purchasing_clerk: {
    main: [
      '/dashboard',
      '/inventory/products',
      '/purchasing/purchase-orders',
      '/purchasing/suppliers'
    ],
    settings: []
  },
  sales_clerk: {
    main: [
      '/dashboard',
      '/inventory/products',
      '/sales/sales-orders'
    ],
    settings: []
  }
};
