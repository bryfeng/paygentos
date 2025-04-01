'use client';

import VendorForm from '@/components/vendor/VendorForm';

export default function EditVendorPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Vendor</h1>
      <VendorForm id={params.id} />
    </div>
  );
}
