import { Suspense } from 'react';
import ItemForm from '@/components/item/ItemForm';
import PageLoading from '@/components/ui/PageLoading';

export const metadata = {
  title: 'New Item - Payment Agent Platform',
  description: 'Create a new item',
};

export default function NewItemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PageLoading />}>
        <ItemForm />
      </Suspense>
    </div>
  );
}
