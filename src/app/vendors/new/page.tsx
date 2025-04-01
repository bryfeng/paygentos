"use client";

import VendorForm from '@/components/vendor/VendorForm';
import { useRouter } from 'next/navigation';

export default function NewVendorPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Vendor</h1>
      <VendorForm />
    </div>
  );
}
