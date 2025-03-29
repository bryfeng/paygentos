import { Suspense } from 'react';
import ItemForm from '@/components/item/ItemForm';
import PageLoading from '@/components/ui/PageLoading';

export const metadata = {
  title: 'Edit Item - Payment Agent Platform',
  description: 'Edit item details',
};

export default function EditItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <ItemForm id={params.id} />
      </Suspense>
    </div>
  );
}
