// app/upload/page.js
'use client';

import React from 'react';
import UploadCarForm from '../../components/cars/UploadCarForm';

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upload a Car</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <UploadCarForm />
      </div>
    </div>
  );
}