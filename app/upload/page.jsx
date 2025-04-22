"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadCarForm from '@/components/cars/UploadCarForm';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useAuth } from '@/context/AuthContext';

export default function UploadPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Please Sign In</h1>
        <p className="mb-8">You need to be signed in to upload a car for rental.</p>
        <Button onClick={() => router.push('/auth/signin/[[...index]]')}>
          Sign In
        </Button>
      </div>
    );
  }

  const handleSubmit = async (carData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      // Prepare form data for image upload
      const formData = new FormData();
      
      // Add car images
      if (carData.images && carData.images.length > 0) {
        carData.images.forEach((image) => {
          formData.append('images', image);
        });
      }
      
      // Upload images first
      const imageUploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!imageUploadRes.ok) {
        throw new Error('Failed to upload images');
      }
      
      const { imageUrls } = await imageUploadRes.json();
      
      // Create car listing with image URLs
      const carDataWithImages = {
        ...carData,
        imageUrls,
        userId: user.id,
      };
      
      const createCarRes = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carDataWithImages),
      });
      
      if (!createCarRes.ok) {
        throw new Error('Failed to create car listing');
      }
      
      // Redirect to the newly created car page
      const { car } = await createCarRes.json();
      router.push(`/cars/${car.id}`);
      
    } catch (err) {
      console.error('Error uploading car:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Your Car for Rental</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <UploadCarForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Tips for a Successful Listing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Upload clear, high-quality images of your car from different angles</li>
            <li>Be honest and accurate about your car's condition and features</li>
            <li>Set a competitive price by checking similar cars in your area</li>
            <li>Clearly state any special rules or restrictions for your rental</li>
            <li>Respond quickly to booking requests to increase your chances</li>
          </ul>
        </div>
      </div>
    </div>
  );
}