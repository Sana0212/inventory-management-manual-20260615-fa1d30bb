import { FieldValue } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection, ensureAppTables } from '@/lib/firebase/collections';
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
  PurchaseReceiptItemRecord,
  CustomerRecord,
  SalesOrderRecord,
  SalesOrderItemRecord,
  AppSettingsRecord,
} from '@/data/types';

// Generic Write Helpers
async function createDoc(tableKey: string, data: any) {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, tableKey).doc();
  const payload = {
    ...data,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  };
  await ref.set(payload);
  return { id: ref.id, ...payload };
}

async function updateDoc(tableKey: string, id: string, data: any) {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, tableKey).doc(id);
  const payload = {
    ...data,
    updated_at: FieldValue.serverTimestamp(),
  };
  await ref.update(payload);
  return { id, ...payload };
}

async function deleteDoc(tableKey: string, id: string) {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, tableKey).doc(id);
  await ref.delete();
  return { id };
}

// Users
export async function createUser(data: Partial<UserRecord>) {
  return createDoc('users', data);
}
export async function updateUser(id: string, data: Partial<UserRecord>) {
  return updateDoc('users', id, data);
}
export async function deleteUser(id: string) {
  return deleteDoc('users', id);
}

// Products
export async function createProduct(data: Partial<ProductRecord>) {
  return createDoc('products', data);
}
export async function updateProduct(id: string, data: Partial<ProductRecord>) {
  return updateDoc('products', id, data);
}
export async function deleteProduct(id: string) {
  return deleteDoc('products', id);
}

// Warehouses
export async function createWarehouse(data: Partial<WarehouseRecord>) {
  return createDoc('warehouses', data);
}
export async function updateWarehouse(id: string, data: Partial<WarehouseRecord>) {
  return updateDoc('warehouses', id, data);
}
export async function deleteWarehouse(id: string) {
  return deleteDoc('warehouses', id);
}

// Stock Levels
export async function createStockLevel(data: Partial<StockLevelRecord>) {
  return createDoc('stock_levels', {
    ...data,
    last_updated_at: FieldValue.serverTimestamp(),
  });
}
export async function updateStockLevel(id: string, data: Partial<StockLevelRecord>) {
  return updateDoc('stock_levels', id, {
    ...data,
    last_updated_at: FieldValue.serverTimestamp(),
  });
}
export async function deleteStockLevel(id: string) {
  return deleteDoc('stock_levels', id);
}

// Stock Adjustments
export async function createStockAdjustment(data: Partial<StockAdjustmentRecord>) {
  const result = await createDoc('stock_adjustments', {
    ...data,
    created_at: FieldValue.serverTimestamp(),
  });

  // Automatically apply adjustments to stock levels
  const db = getAdminFirestore();
  const stockSnapshot = await appCollection(db, 'stock_levels')
    .where('product_id', '==', data.product_id)
    .where('warehouse_id', '==', data.warehouse_id)
    .limit(1)
    .get();

  const adjQty = data.adjustment_quantity || 0;

  if (!stockSnapshot.empty) {
    const stockId = stockSnapshot.docs[0].id;
    const currentData = stockSnapshot.docs[0].data();
    const currentOn_hand = currentData.on_hand_quantity || 0;
    const currentAvailable = currentData.available_quantity || 0;

    await updateStockLevel(stockId, {
      on_hand_quantity: currentOn_hand + adjQty,
      available_quantity: currentAvailable + adjQty,
    });
  } else {
    await createStockLevel({
      product_id: data.product_id,
      warehouse_id: data.warehouse_id,
      on_hand_quantity: adjQty,
      allocated_quantity: 0,
      available_quantity: adjQty,
    });
  }

  return result;
}
export async function updateStockAdjustment(id: string, data: Partial<StockAdjustmentRecord>) {
  return updateDoc('stock_adjustments', id, data);
}
export async function deleteStockAdjustment(id: string) {
  return deleteDoc('stock_adjustments', id);
}

// Stock Transfers
export async function createStockTransfer(data: Partial<StockTransferRecord>) {
  return createDoc('stock_transfers', {
    ...data,
    requested_at: FieldValue.serverTimestamp(),
  });
}
export async function updateStockTransfer(id: string, data: Partial<StockTransferRecord>) {
  const result = await updateDoc('stock_transfers', id, data);

  // If completed, move stock
  if (data.status === 'completed') {
    const db = getAdminFirestore();
    const snap = await appCollection(db, 'stock_transfers').doc(id).get();
    const transfer = snap.data() as StockTransferRecord;
    if (transfer && transfer.from_warehouse_id && transfer.to_warehouse_id && transfer.product_id) {
      // From Warehouse (decrease)
      const fromSnap = await appCollection(db, 'stock_levels')
        .where('product_id', '==', transfer.product_id)
        .where('warehouse_id', '==', transfer.from_warehouse_id)
        .limit(1)
        .get();

      if (!fromSnap.empty) {
        const fromStockId = fromSnap.docs[0].id;
        const currentData = fromSnap.docs[0].data();
        const currentQty = currentData.on_hand_quantity || 0;
        const currentAvail = currentData.available_quantity || 0;
        await updateStockLevel(fromStockId, {
          on_hand_quantity: Math.max(0, currentQty - transfer.transfer_quantity),
          available_quantity: Math.max(0, currentAvail - transfer.transfer_quantity),
        });
      }

      // To Warehouse (increase)
      const toSnap = await appCollection(db, 'stock_levels')
        .where('product_id', '==', transfer.product_id)
        .where('warehouse_id', '==', transfer.to_warehouse_id)
        .limit(1)
        .get();

      if (!toSnap.empty) {
        const toStockId = toSnap.docs[0].id;
        const currentData = toSnap.docs[0].data();
        const currentQty = currentData.on_hand_quantity || 0;
        const currentAvail = currentData.available_quantity || 0;
        await updateStockLevel(toStockId, {
          on_hand_quantity: currentQty + transfer.transfer_quantity,
          available_quantity: currentAvail + transfer.transfer_quantity,
        });
      } else {
        await createStockLevel({
          product_id: transfer.product_id,
          warehouse_id: transfer.to_warehouse_id,
          on_hand_quantity: transfer.transfer_quantity,
          allocated_quantity: 0,
          available_quantity: transfer.transfer_quantity,
        });
      }
    }
  }

  return result;
}
export async function deleteStockTransfer(id: string) {
  return deleteDoc('stock_transfers', id);
}

// Suppliers
export async function createSupplier(data: Partial<SupplierRecord>) {
  return createDoc('suppliers', data);
}
export async function updateSupplier(id: string, data: Partial<SupplierRecord>) {
  return updateDoc('suppliers', id, data);
}
export async function deleteSupplier(id: string) {
  return deleteDoc('suppliers', id);
}

// Purchase Orders
export async function createPurchaseOrder(data: Partial<PurchaseOrderRecord>) {
  return createDoc('purchase_orders', {
    ...data,
    created_at: FieldValue.serverTimestamp(),
  });
}
export async function updatePurchaseOrder(id: string, data: Partial<PurchaseOrderRecord>) {
  return updateDoc('purchase_orders', id, data);
}
export async function deletePurchaseOrder(id: string) {
  return deleteDoc('purchase_orders', id);
}

// Purchase Order Items
export async function createPurchaseOrderItem(data: Partial<PurchaseOrderItemRecord>) {
  return createDoc('purchase_order_items', data);
}
export async function updatePurchaseOrderItem(id: string, data: Partial<PurchaseOrderItemRecord>) {
  return updateDoc('purchase_order_items', id, data);
}
export async function deletePurchaseOrderItem(id: string) {
  return deleteDoc('purchase_order_items', id);
}

// Purchase Receipts
export async function createPurchaseReceipt(data: Partial<PurchaseReceiptRecord>) {
  return createDoc('purchase_receipts', {
    ...data,
    received_at: FieldValue.serverTimestamp(),
  });
}
export async function updatePurchaseReceipt(id: string, data: Partial<PurchaseReceiptRecord>) {
  return updateDoc('purchase_receipts', id, data);
}
export async function deletePurchaseReceipt(id: string) {
  return deleteDoc('purchase_receipts', id);
}

// Purchase Receipt Items
export async function createPurchaseReceiptItem(data: Partial<PurchaseReceiptItemRecord>) {
  return createDoc('purchase_receipt_items', data);
}
export async function updatePurchaseReceiptItem(id: string, data: Partial<PurchaseReceiptItemRecord>) {
  return updateDoc('purchase_receipt_items', id, data);
}
export async function deletePurchaseReceiptItem(id: string) {
  return deleteDoc('purchase_receipt_items', id);
}

// Customers
export async function createCustomer(data: Partial<CustomerRecord>) {
  return createDoc('customers', data);
}
export async function updateCustomer(id: string, data: Partial<CustomerRecord>) {
  return updateDoc('customers', id, data);
}
export async function deleteCustomer(id: string) {
  return deleteDoc('customers', id);
}

// Sales Orders
export async function createSalesOrder(data: Partial<SalesOrderRecord>) {
  return createDoc('sales_orders', {
    ...data,
    created_at: FieldValue.serverTimestamp(),
  });
}
export async function updateSalesOrder(id: string, data: Partial<SalesOrderRecord>) {
  return updateDoc('sales_orders', id, data);
}
export async function deleteSalesOrder(id: string) {
  return deleteDoc('sales_orders', id);
}

// Sales Order Items
export async function createSalesOrderItem(data: Partial<SalesOrderItemRecord>) {
  return createDoc('sales_order_items', data);
}
export async function updateSalesOrderItem(id: string, data: Partial<SalesOrderItemRecord>) {
  return updateDoc('sales_order_items', id, data);
}
export async function deleteSalesOrderItem(id: string) {
  return deleteDoc('sales_order_items', id);
}

// App Settings
export async function createAppSettings(data: Partial<AppSettingsRecord>) {
  return createDoc('app_settings', data);
}
export async function updateAppSettings(id: string, data: Partial<AppSettingsRecord>) {
  return updateDoc('app_settings', id, data);
}
export async function deleteAppSettings(id: string) {
  return deleteDoc('app_settings', id);
}
