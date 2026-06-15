export type TemplateFieldType = 'string' | 'number' | 'boolean' | 'timestamp' | 'reference' | 'date';

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  refTable?: string;
};

export type TemplateTable = {
  key: string;
  label: string;
  order: number;
  fields: TemplateField[];
};

export const appTemplate = {
  key: 'inventory_management',
  label: 'Inventory Management',
  tables: [
    {
      key: 'users',
      label: 'Users',
      order: 1,
      fields: [
        { key: 'email', label: 'Email', type: 'string', required: true },
        { key: 'password_hash', label: 'Password Hash', type: 'string', required: true },
        { key: 'full_name', label: 'Full Name', type: 'string', required: true },
        { key: 'role_key', label: 'Role Key', type: 'string', required: true },
        { key: 'is_active', label: 'Is Active', type: 'boolean', required: true },
        { key: 'last_login_at', label: 'Last Login At', type: 'timestamp', required: false }
      ]
    },
    {
      key: 'products',
      label: 'Products',
      order: 2,
      fields: [
        { key: 'sku', label: 'SKU', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string', required: false },
        { key: 'unit_of_measure', label: 'Unit Of Measure', type: 'string', required: true },
        { key: 'category', label: 'Category', type: 'string', required: false },
        { key: 'default_warehouse_id', label: 'Default Warehouse', type: 'reference', refTable: 'warehouses', required: false },
        { key: 'reorder_level', label: 'Reorder Level', type: 'number', required: false },
        { key: 'cost_price', label: 'Cost Price', type: 'number', required: false },
        { key: 'sales_price', label: 'Sales Price', type: 'number', required: false },
        { key: 'is_active', label: 'Is Active', type: 'boolean', required: true }
      ]
    },
    {
      key: 'warehouses',
      label: 'Warehouses',
      order: 3,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'address', label: 'Address', type: 'string', required: false },
        { key: 'city', label: 'City', type: 'string', required: false },
        { key: 'country', label: 'Country', type: 'string', required: false },
        { key: 'is_active', label: 'Is Active', type: 'boolean', required: true }
      ]
    },
    {
      key: 'stock_levels',
      label: 'Stock Levels',
      order: 4,
      fields: [
        { key: 'product_id', label: 'Product', type: 'reference', refTable: 'products', required: true },
        { key: 'warehouse_id', label: 'Warehouse', type: 'reference', refTable: 'warehouses', required: true },
        { key: 'on_hand_quantity', label: 'On Hand Quantity', type: 'number', required: true },
        { key: 'allocated_quantity', label: 'Allocated Quantity', type: 'number', required: true },
        { key: 'available_quantity', label: 'Available Quantity', type: 'number', required: true },
        { key: 'last_updated_at', label: 'Last Updated At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'stock_adjustments',
      label: 'Stock Adjustments',
      order: 5,
      fields: [
        { key: 'product_id', label: 'Product', type: 'reference', refTable: 'products', required: true },
        { key: 'warehouse_id', label: 'Warehouse', type: 'reference', refTable: 'warehouses', required: true },
        { key: 'adjustment_quantity', label: 'Adjustment Quantity', type: 'number', required: true },
        { key: 'reason', label: 'Reason', type: 'string', required: true },
        { key: 'reference', label: 'Reference', type: 'string', required: false },
        { key: 'created_by_user_id', label: 'Created By User', type: 'reference', refTable: 'users', required: true },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'stock_transfers',
      label: 'Stock Transfers',
      order: 6,
      fields: [
        { key: 'from_warehouse_id', label: 'From Warehouse', type: 'reference', refTable: 'warehouses', required: true },
        { key: 'to_warehouse_id', label: 'To Warehouse', type: 'reference', refTable: 'warehouses', required: true },
        { key: 'product_id', label: 'Product', type: 'reference', refTable: 'products', required: true },
        { key: 'transfer_quantity', label: 'Transfer Quantity', type: 'number', required: true },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'requested_by_user_id', label: 'Requested By User', type: 'reference', refTable: 'users', required: true },
        { key: 'approved_by_user_id', label: 'Approved By User', type: 'reference', refTable: 'users', required: false },
        { key: 'requested_at', label: 'Requested At', type: 'timestamp', required: true },
        { key: 'completed_at', label: 'Completed At', type: 'timestamp', required: false }
      ]
    },
    {
      key: 'suppliers',
      label: 'Suppliers',
      order: 7,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'contact_name', label: 'Contact Name', type: 'string', required: false },
        { key: 'email', label: 'Email', type: 'string', required: false },
        { key: 'phone', label: 'Phone', type: 'string', required: false },
        { key: 'address', label: 'Address', type: 'string', required: false },
        { key: 'city', label: 'City', type: 'string', required: false },
        { key: 'country', label: 'Country', type: 'string', required: false },
        { key: 'is_active', label: 'Is Active', type: 'boolean', required: true }
      ]
    },
    {
      key: 'purchase_orders',
      label: 'Purchase Orders',
      order: 8,
      fields: [
        { key: 'po_number', label: 'PO Number', type: 'string', required: true },
        { key: 'supplier_id', label: 'Supplier', type: 'reference', refTable: 'suppliers', required: true },
        { key: 'order_date', label: 'Order Date', type: 'date', required: true },
        { key: 'expected_date', label: 'Expected Date', type: 'date', required: false },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'currency', label: 'Currency', type: 'string', required: false },
        { key: 'total_amount', label: 'Total Amount', type: 'number', required: false },
        { key: 'created_by_user_id', label: 'Created By User', type: 'reference', refTable: 'users', required: true },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'purchase_order_items',
      label: 'Purchase Order Items',
      order: 9,
      fields: [
        { key: 'purchase_order_id', label: 'Purchase Order', type: 'reference', refTable: 'purchase_orders', required: true },
        { key: 'product_id', label: 'Product', type: 'reference', refTable: 'products', required: true },
        { key: 'quantity_ordered', label: 'Quantity Ordered', type: 'number', required: true },
        { key: 'quantity_received', label: 'Quantity Received', type: 'number', required: true },
        { key: 'unit_price', label: 'Unit Price', type: 'number', required: true },
        { key: 'line_total', label: 'Line Total', type: 'number', required: true }
      ]
    },
    {
      key: 'purchase_receipts',
      label: 'Purchase Receipts',
      order: 10,
      fields: [
        { key: 'purchase_order_id', label: 'Purchase Order', type: 'reference', refTable: 'purchase_orders', required: true },
        { key: 'receipt_number', label: 'Receipt Number', type: 'string', required: true },
        { key: 'warehouse_id', label: 'Warehouse', type: 'reference', refTable: 'warehouses', required: true },
        { key: 'received_at', label: 'Received At', type: 'timestamp', required: true },
        { key: 'received_by_user_id', label: 'Received By User', type: 'reference', refTable: 'users', required: true },
        { key: 'notes', label: 'Notes', type: 'string', required: false }
      ]
    },
    {
      key: 'purchase_receipt_items',
      label: 'Purchase Receipt Items',
      order: 11,
      fields: [
        { key: 'purchase_receipt_id', label: 'Purchase Receipt', type: 'reference', refTable: 'purchase_receipts', required: true },
        { key: 'purchase_order_item_id', label: 'Purchase Order Item', type: 'reference', refTable: 'purchase_order_items', required: true },
        { key: 'product_id', label: 'Product', type: 'reference', refTable: 'products', required: true },
        { key: 'quantity_received', label: 'Quantity Received', type: 'number', required: true }
      ]
    },
    {
      key: 'customers',
      label: 'Customers',
      order: 12,
      fields: [
        { key: 'code', label: 'Code', type: 'string', required: true },
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'contact_name', label: 'Contact Name', type: 'string', required: false },
        { key: 'email', label: 'Email', type: 'string', required: false },
        { key: 'phone', label: 'Phone', type: 'string', required: false },
        { key: 'billing_address', label: 'Billing Address', type: 'string', required: false },
        { key: 'shipping_address', label: 'Shipping Address', type: 'string', required: false },
        { key: 'is_active', label: 'Is Active', type: 'boolean', required: true }
      ]
    },
    {
      key: 'sales_orders',
      label: 'Sales Orders',
      order: 13,
      fields: [
        { key: 'so_number', label: 'SO Number', type: 'string', required: true },
        { key: 'customer_id', label: 'Customer', type: 'reference', refTable: 'customers', required: true },
        { key: 'order_date', label: 'Order Date', type: 'date', required: true },
        { key: 'required_date', label: 'Required Date', type: 'date', required: false },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'currency', label: 'Currency', type: 'string', required: false },
        { key: 'total_amount', label: 'Total Amount', type: 'number', required: false },
        { key: 'created_by_user_id', label: 'Created By User', type: 'reference', refTable: 'users', required: true },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'sales_order_items',
      label: 'Sales Order Items',
      order: 14,
      fields: [
        { key: 'sales_order_id', label: 'Sales Order', type: 'reference', refTable: 'sales_orders', required: true },
        { key: 'product_id', label: 'Product', type: 'reference', refTable: 'products', required: true },
        { key: 'warehouse_id', label: 'Warehouse', type: 'reference', refTable: 'warehouses', required: true },
        { key: 'quantity_ordered', label: 'Quantity Ordered', type: 'number', required: true },
        { key: 'quantity_shipped', label: 'Quantity Shipped', type: 'number', required: true },
        { key: 'unit_price', label: 'Unit Price', type: 'number', required: true },
        { key: 'line_total', label: 'Line Total', type: 'number', required: true }
      ]
    },
    {
      key: 'app_settings',
      label: 'App Settings',
      order: 15,
      fields: [
        { key: 'key', label: 'Key', type: 'string', required: true },
        { key: 'value', label: 'Value', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string', required: false }
      ]
    }
  ]
} as const;
