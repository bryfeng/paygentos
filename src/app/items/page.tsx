import { Suspense } from 'react';
import ItemList from '@/components/item/ItemList';
import PageLoading from '@/components/ui/PageLoading';

export const metadata = {
  title: 'Items - Payment Agent Platform',
  description: 'Manage your items',
};

export default function ItemsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <ItemList />
      </Suspense>
    </div>
  );
}
