export interface User {
  email: string;
  password_hash: string;
  full_name: string;
  role_key: string;
  is_active: boolean;
  last_login_at?: any;
  created_at?: any;
  updated_at?: any;
}
export interface UserRecord extends User {
  id: string;
}

export interface Product {
  sku: string;
  name: string;
  description?: string;
  unit_of_measure: string;
  category?: string;
  default_warehouse_id?: string;
  reorder_level?: number | null;
  cost_price?: number | null;
  sales_price?: number | null;
  is_active: boolean;
  created_at?: any;
  updated_at?: any;
}
export interface ProductRecord extends Product {
  id: string;
}

export interface Warehouse {
  code: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  is_active: boolean;
  created_at?: any;
  updated_at?: any;
}
export interface WarehouseRecord extends Warehouse {
  id: string;
}

export interface StockLevel {
  product_id: string;
  warehouse_id: string;
  on_hand_quantity: number;
  allocated_quantity: number;
  available_quantity: number;
  last_updated_at?: any;
  created_at?: any;
  updated_at?: any;
}
export interface StockLevelRecord extends StockLevel {
  id: string;
}

export interface StockAdjustment {
  product_id: string;
  warehouse_id: string;
  adjustment_quantity: number;
  reason: string;
  reference?: string;
  created_by_user_id: string;
  created_at?: any;
  updated_at?: any;
}
export interface StockAdjustmentRecord extends StockAdjustment {
  id: string;
}

export interface StockTransfer {
  from_warehouse_id: string;
  to_warehouse_id: string;
  product_id: string;
  transfer_quantity: number;
  status: string;
  requested_by_user_id: string;
  approved_by_user_id?: string;
  requested_at?: any;
  completed_at?: any;
  created_at?: any;
  updated_at?: any;
}
export interface StockTransferRecord extends StockTransfer {
  id: string;
}

export interface Supplier {
  code: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  is_active: boolean;
  created_at?: any;
  updated_at?: any;
}
export interface SupplierRecord extends Supplier {
  id: string;
}

export interface PurchaseOrder {
  po_number: string;
  supplier_id: string;
  order_date: string;
  expected_date?: string;
  status: string;
  currency?: string;
  total_amount?: number;
  created_by_user_id: string;
  created_at?: any;
  updated_at?: any;
}
export interface PurchaseOrderRecord extends PurchaseOrder {
  id: string;
}

export interface PurchaseOrderItem {
  purchase_order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: number;
  line_total: number;
  created_at?: any;
  updated_at?: any;
}
export interface PurchaseOrderItemRecord extends PurchaseOrderItem {
  id: string;
}

export interface PurchaseReceipt {
  purchase_order_id: string;
  receipt_number: string;
  warehouse_id: string;
  notes?: string;
  received_by_user_id: string;
  received_at?: any;
  created_at?: any;
  updated_at?: any;
}
export interface PurchaseReceiptRecord extends PurchaseReceipt {
  id: string;
}

export interface PurchaseReceiptLine {
  purchase_receipt_id: string;
  purchase_order_item_id: string;
  product_id: string;
  quantity_received: number;
  created_at?: any;
  updated_at?: any;
}
export interface PurchaseReceiptLineRecord extends PurchaseReceiptLine {
  id: string;
}

// Aliases for duplicate/mixed naming patterns (e.g. Item vs Line)
export type PurchaseReceiptItem = PurchaseReceiptLine;
export type PurchaseReceiptItemRecord = PurchaseReceiptLineRecord;

export interface Customer {
  code: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  shipping_address?: string;
  is_active: boolean;
  created_at?: any;
  updated_at?: any;
}
export interface CustomerRecord extends Customer {
  id: string;
}

export interface SalesOrder {
  so_number: string;
  customer_id: string;
  order_date: string;
  required_date?: string;
  status: string;
  currency?: string;
  total_amount?: number;
  created_by_user_id: string;
  created_at?: any;
  updated_at?: any;
}
export interface SalesOrderRecord extends SalesOrder {
  id: string;
}

export interface SalesOrderItem {
  sales_order_id: string;
  product_id: string;
  warehouse_id: string;
  quantity_ordered: number;
  quantity_shipped: number;
  unit_price: number;
  line_total: number;
  created_at?: any;
  updated_at?: any;
}
export interface SalesOrderItemRecord extends SalesOrderItem {
  id: string;
}

export interface Setting {
  key: string;
  value: string;
  description?: string;
  created_at?: any;
  updated_at?: any;
}
export interface SettingRecord extends Setting {
  id: string;
}

// Aliases for Setting / AppSettings
export type AppSettings = Setting;
export type AppSettingsRecord = SettingRecord;
