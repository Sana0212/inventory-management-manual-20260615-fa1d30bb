import { CustomersList } from '@/modules/sales/customers/List';

export const dynamic = 'force-dynamic';

export default function CustomersPage() {
  return (
    <div className="container mx-auto py-6">
      <CustomersList />
    </div>
  );
}
