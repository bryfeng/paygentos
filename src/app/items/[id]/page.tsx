import { Suspense } from 'react';
import ItemDetail from '@/components/item/ItemDetail';
import PageLoading from '@/components/ui/PageLoading';

export const metadata = {
  title: 'Item Details - Payment Agent Platform',
  description: 'View item details',
};

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <ItemDetail id={params.id} />
      </Suspense>
    </div>
  );
}
