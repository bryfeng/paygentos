import { Suspense } from 'react';
import CustomerProfileList from '@/components/profile/CustomerProfileList';
import PageLoading from '@/components/ui/PageLoading';

export const metadata = {
  title: 'Customer Profiles - Payment Agent Platform',
  description: 'Manage customer profiles',
};

// Server Component with simpler type handling
export default function CustomerProfilesPage({ params }: any) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <CustomerProfileList customerId={params.id} />
      </Suspense>
    </div>
  );
}
