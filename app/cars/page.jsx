// app/cars/page.js

'use client';

import { useState, useEffect } from 'react';
import { useCars } from '../../hooks/useCars';
import CarGallery from '../../components/cars/CarGallery';
import SearchFilters from '../../components/cars/SearchFilters';
import Loader from '../../components/ui/Loader';

export default function CarsPage() {
  const initialFilters = {
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    transmission: '',
    fuel_type: ''
  };
  
  const {
    cars,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    changePage
  } = useCars(initialFilters);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          Error loading cars: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Available Cars</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters 
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
          />
        </div>
        
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader size="lg" />
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-md text-center">
              <h3 className="text-xl font-medium text-gray-700">No cars found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-gray-600">
                Found {pagination.count} cars matching your criteria
              </p>
              
              <CarGallery cars={cars} />
              
              {/* Pagination UI */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => changePage(page)}
                        className={`px-4 py-2 rounded ${
                          pagination.currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}