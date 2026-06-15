import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password_hash: z.string().min(6).optional(),
  full_name: z.string().min(2),
  role_key: z.string(),
  is_active: z.boolean().default(true),
});
export const usersSchema = userSchema;
export const UserSchema = userSchema;
export const UsersSchema = userSchema;

export const productSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  unit_of_measure: z.string().min(1),
  category: z.string().optional(),
  default_warehouse_id: z.string().optional(),
  reorder_level: z.number().nullable().optional(),
  cost_price: z.number().nullable().optional(),
  sales_price: z.number().nullable().optional(),
  is_active: z.boolean().default(true),
});
export const productsSchema = productSchema;
export const ProductSchema = productSchema;
export const ProductsSchema = productSchema;

export const warehouseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  is_active: z.boolean().default(true),
});
export const warehousesSchema = warehouseSchema;
export const WarehouseSchema = warehouseSchema;
export const WarehousesSchema = warehouseSchema;

export const stockLevelSchema = z.object({
  product_id: z.string(),
  warehouse_id: z.string(),
  on_hand_quantity: z.number(),
  allocated_quantity: z.number(),
  available_quantity: z.number(),
});
export const stock_levelsSchema = stockLevelSchema;
export const StockLevelSchema = stockLevelSchema;
export const StockLevelsSchema = stockLevelSchema;

export const stockAdjustmentSchema = z.object({
  product_id: z.string(),
  warehouse_id: z.string(),
  adjustment_quantity: z.number(),
  reason: z.string().min(1),
  reference: z.string().optional(),
});
export const stock_adjustmentsSchema = stockAdjustmentSchema;
export const StockAdjustmentSchema = stockAdjustmentSchema;
export const StockAdjustmentsSchema = stockAdjustmentSchema;

export const stockTransferSchema = z.object({
  from_warehouse_id: z.string(),
  to_warehouse_id: z.string(),
  product_id: z.string(),
  transfer_quantity: z.number().positive(),
  status: z.string().default('requested'),
  approved_by_user_id: z.string().optional(),
  completed_at: z.any().optional(),
});
export const stock_transfersSchema = stockTransferSchema;
export const StockTransferSchema = stockTransferSchema;
export const StockTransfersSchema = stockTransferSchema;

export const supplierSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  contact_name: z.string().optional(),
  email: z.string().email().or(z.literal('')).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  is_active: z.boolean().default(true),
});
export const suppliersSchema = supplierSchema;
export const SupplierSchema = supplierSchema;
export const SuppliersSchema = supplierSchema;

export const purchaseOrderSchema = z.object({
  po_number: z.string().min(1),
  supplier_id: z.string(),
  order_date: z.string(),
  expected_date: z.string().optional(),
  status: z.string().default('draft'),
  currency: z.string().default('USD'),
  total_amount: z.number().optional(),
});
export const purchase_ordersSchema = purchaseOrderSchema;
export const PurchaseOrderSchema = purchaseOrderSchema;
export const PurchaseOrdersSchema = purchaseOrderSchema;

export const purchaseOrderItemSchema = z.object({
  purchase_order_id: z.string(),
  product_id: z.string(),
  quantity_ordered: z.number().positive(),
  quantity_received: z.number().default(0),
  unit_price: z.number().nonnegative(),
  line_total: z.number().nonnegative(),
});
export const purchase_order_itemsSchema = purchaseOrderItemSchema;
export const PurchaseOrderItemSchema = purchaseOrderItemSchema;
export const PurchaseOrderItemsSchema = purchaseOrderItemSchema;

export const purchaseReceiptSchema = z.object({
  purchase_order_id: z.string(),
  receipt_number: z.string().min(1),
  warehouse_id: z.string(),
  notes: z.string().optional(),
});
export const purchase_receiptsSchema = purchaseReceiptSchema;
export const PurchaseReceiptSchema = purchaseReceiptSchema;
export const PurchaseReceiptsSchema = purchaseReceiptSchema;

export const purchaseReceiptItemSchema = z.object({
  purchase_receipt_id: z.string(),
  purchase_order_item_id: z.string(),
  product_id: z.string(),
  quantity_received: z.number().positive(),
});
export const purchase_receipt_itemsSchema = purchaseReceiptItemSchema;
export const PurchaseReceiptItemSchema = purchaseReceiptItemSchema;
export const PurchaseReceiptItemsSchema = purchaseReceiptItemSchema;

export const customerSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  contact_name: z.string().optional(),
  email: z.string().email().or(z.literal('')).optional(),
  phone: z.string().optional(),
  billing_address: z.string().optional(),
  shipping_address: z.string().optional(),
  is_active: z.boolean().default(true),
});
export const customersSchema = customerSchema;
export const CustomerSchema = customerSchema;
export const CustomersSchema = customerSchema;

export const salesOrderSchema = z.object({
  so_number: z.string().min(1),
  customer_id: z.string(),
  order_date: z.string(),
  required_date: z.string().optional(),
  status: z.string().default('draft'),
  currency: z.string().default('USD'),
  total_amount: z.number().optional(),
});
export const sales_ordersSchema = salesOrderSchema;
export const SalesOrderSchema = salesOrderSchema;
export const SalesOrdersSchema = salesOrderSchema;

export const salesOrderItemSchema = z.object({
  sales_order_id: z.string(),
  product_id: z.string(),
  warehouse_id: z.string(),
  quantity_ordered: z.number().positive(),
  quantity_shipped: z.number().default(0),
  unit_price: z.number().nonnegative(),
  line_total: z.number().nonnegative(),
});
export const sales_order_itemsSchema = salesOrderItemSchema;
export const SalesOrderItemSchema = salesOrderItemSchema;
export const SalesOrderItemsSchema = salesOrderItemSchema;

export const appSettingsSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
});
export const app_settingsSchema = appSettingsSchema;
export const AppSettingsSchema = appSettingsSchema;
export const AppSettingSchema = appSettingsSchema;
export const appSettings = appSettingsSchema;
export const app_settings = appSettingsSchema;
