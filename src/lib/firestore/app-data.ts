import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection } from '@/lib/firebase/collections';
import type {
  UserRecord,
  ProductRecord,
  WarehouseRecord,
  StockLevelRecord,
  StockAdjustmentRecord,
  StockTransferRecord,
  SupplierRecord,
  PurchaseOrderRecord,
  PurchaseOrderItemRecord,
  PurchaseReceiptRecord,
  PurchaseReceiptLineRecord,
  CustomerRecord,
  SalesOrderRecord,
  SalesOrderItemRecord,
  SettingRecord,
} from '@/data/types';

// Generic List Utility
async function listDocs<T>(tableKey: string): Promise<T[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, tableKey).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Generic Get Utility
async function getDoc<T>(tableKey: string, id: string): Promise<T | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, tableKey).doc(id).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
  } as T;
}

// Users
export async function listUsers(): Promise<UserRecord[]> {
  return listDocs<UserRecord>('users');
}
export async function getUser(id: string): Promise<UserRecord | null> {
  return getDoc<UserRecord>('users', id);
}

// Products
export async function listProducts(): Promise<ProductRecord[]> {
  return listDocs<ProductRecord>('products');
}
export async function getProduct(id: string): Promise<ProductRecord | null> {
  return getDoc<ProductRecord>('products', id);
}

// Warehouses
export async function listWarehouses(): Promise<WarehouseRecord[]> {
  return listDocs<WarehouseRecord>('warehouses');
}
export async function getWarehouse(id: string): Promise<WarehouseRecord | null> {
  return getDoc<WarehouseRecord>('warehouses', id);
}

// Stock Levels
export async function listStockLevels(): Promise<StockLevelRecord[]> {
  return listDocs<StockLevelRecord>('stock_levels');
}
export async function getStockLevel(id: string): Promise<StockLevelRecord | null> {
  return getDoc<StockLevelRecord>('stock_levels', id);
}

// Stock Adjustments
export async function listStockAdjustments(): Promise<StockAdjustmentRecord[]> {
  return listDocs<StockAdjustmentRecord>('stock_adjustments');
}
export async function getStockAdjustment(id: string): Promise<StockAdjustmentRecord | null> {
  return getDoc<StockAdjustmentRecord>('stock_adjustments', id);
}

// Stock Transfers
export async function listStockTransfers(): Promise<StockTransferRecord[]> {
  return listDocs<StockTransferRecord>('stock_transfers');
}
export async function getStockTransfer(id: string): Promise<StockTransferRecord | null> {
  return getDoc<StockTransferRecord>('stock_transfers', id);
}

// Suppliers
export async function listSuppliers(): Promise<SupplierRecord[]> {
  return listDocs<SupplierRecord>('suppliers');
}
export async function getSupplier(id: string): Promise<SupplierRecord | null> {
  return getDoc<SupplierRecord>('suppliers', id);
}

// Purchase Orders
export async function listPurchaseOrders(): Promise<PurchaseOrderRecord[]> {
  return listDocs<PurchaseOrderRecord>('purchase_orders');
}
export async function getPurchaseOrder(id: string): Promise<PurchaseOrderRecord | null> {
  return getDoc<PurchaseOrderRecord>('purchase_orders', id);
}

// Purchase Order Items
export async function listPurchaseOrderItems(): Promise<PurchaseOrderItemRecord[]> {
  return listDocs<PurchaseOrderItemRecord>('purchase_order_items');
}
export async function getPurchaseOrderItem(id: string): Promise<PurchaseOrderItemRecord | null> {
  return getDoc<PurchaseOrderItemRecord>('purchase_order_items', id);
}

// Purchase Receipts
export async function listPurchaseReceipts(): Promise<PurchaseReceiptRecord[]> {
  return listDocs<PurchaseReceiptRecord>('purchase_receipts');
}
export async function getPurchaseReceipt(id: string): Promise<PurchaseReceiptRecord | null> {
  return getDoc<PurchaseReceiptRecord>('purchase_receipts', id);
}

// Purchase Receipt Items / Lines
export async function listPurchaseReceiptItems(): Promise<PurchaseReceiptLineRecord[]> {
  return listDocs<PurchaseReceiptLineRecord>('purchase_receipt_lines');
}
export async function getPurchaseReceiptItem(id: string): Promise<PurchaseReceiptLineRecord | null> {
  return getDoc<PurchaseReceiptLineRecord>('purchase_receipt_lines', id);
}

// Customers
export async function listCustomers(): Promise<CustomerRecord[]> {
  return listDocs<CustomerRecord>('customers');
}
export async function getCustomer(id: string): Promise<CustomerRecord | null> {
  return getDoc<CustomerRecord>('customers', id);
}

// Sales Orders
export async function listSalesOrders(): Promise<SalesOrderRecord[]> {
  return listDocs<SalesOrderRecord>('sales_orders');
}
export async function getSalesOrder(id: string): Promise<SalesOrderRecord | null> {
  return getDoc<SalesOrderRecord>('sales_orders', id);
}

// Sales Order Items
export async function listSalesOrderItems(): Promise<SalesOrderItemRecord[]> {
  return listDocs<SalesOrderItemRecord>('sales_order_items');
}
export async function getSalesOrderItem(id: string): Promise<SalesOrderItemRecord | null> {
  return getDoc<SalesOrderItemRecord>('sales_order_items', id);
}

// App Settings
export async function listAppSettings(): Promise<SettingRecord[]> {
  return listDocs<SettingRecord>('app_settings');
}
export async function getAppSettings(id: string): Promise<SettingRecord | null> {
  return getDoc<SettingRecord>('app_settings', id);
}

// Dashboard Aggregates Custom Helper
export async function getDashboardData() {
  const db = getAdminFirestore();

  // Low stock products
  const products = await listProducts();
  const stockLevels = await listStockLevels();
  
  // Aggregate stock levels grouped by product
  const productStockMap: Record<string, number> = {};
  stockLevels.forEach((sl) => {
    productStockMap[sl.product_id] = (productStockMap[sl.product_id] || 0) + sl.on_hand_quantity;
  });

  const lowStockProducts = products.filter((p) => {
    const onHand = productStockMap[p.id || ''] || 0;
    return p.reorder_level !== undefined && p.reorder_level !== null && onHand < p.reorder_level;
  }).map(p => ({
    ...p,
    on_hand: productStockMap[p.id || ''] || 0
  }));

  // Open Purchase Orders (draft, open, ordered, approved, etc.)
  const pos = await listPurchaseOrders();
  const openPos = pos.filter((po) => po.status === 'draft' || po.status === 'ordered' || po.status === 'open' || po.status === 'approved');

  // Today's Sales Orders sum
  const sos = await listSalesOrders();
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySos = sos.filter((so) => so.order_date.startsWith(todayStr));
  const todaySalesCount = todaySos.length;
  const todaySalesTotalAmount = todaySos.reduce((sum, so) => sum + (so.total_amount || 0), 0);

  // Group on hand stock by warehouse
  const warehouses = await listWarehouses();
  const warehouseStockMap: Record<string, number> = {};
  stockLevels.forEach((sl) => {
    warehouseStockMap[sl.warehouse_id] = (warehouseStockMap[sl.warehouse_id] || 0) + sl.on_hand_quantity;
  });

  const stockByWarehouse = warehouses.map((wh) => ({
    warehouseName: wh.name,
    warehouseId: wh.id,
    totalStock: warehouseStockMap[wh.id || ''] || 0,
  }));

  return {
    lowStockProducts,
    openPos,
    todaySales: {
      count: todaySalesCount,
      total: todaySalesTotalAmount,
    },
    stockByWarehouse,
  };
}
export const dynamic = 'force-dynamic';
