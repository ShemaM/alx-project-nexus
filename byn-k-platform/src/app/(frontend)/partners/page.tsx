import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Partners</h1>
        <p className="text-gray-500 mt-1">
          We are proud to work with a diverse range of organizations to bring you the best opportunities.
        </p>
        <div className="mt-8">
          <p className="text-gray-500">Partner listings coming soon.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
