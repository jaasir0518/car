// components/cars/CarGallery.jsx
import React, { useState } from 'react';
import CarCard from './CarCard';
import SearchFilters from './SearchFilters';
import { useCars } from '../../hooks/useCars';
import { useLocations } from '../../hooks/uselocation';

export default function CarGallery() {
  const { locations } = useLocations();
  const [selectedFilters, setSelectedFilters] = useState({
    available: true // Default to showing only available cars
  });
  
  const { cars, loading, error, updateFilters } = useCars(selectedFilters) as {
    cars: {
      id: string;
      make: string;
      model: string;
      year: number;
      category: string;
      price_per_day: number;
      image_url?: string;
      available: boolean;
      locations?: {
        city: string;
        state: string;
      };
    }[];
    loading: boolean;
    error: string | null;
    updateFilters: (filters: Filters) => void;
  };

  interface Filters {
    available: boolean;
    [key: string]: any; // To allow additional filters dynamically
  }

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setSelectedFilters((prev: Filters) => {
      const updated: Filters = { ...prev, ...newFilters };
      updateFilters(updated);
      return updated;
    });
  };

  if (loading) return <div className="text-center py-10">Loading cars...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Cars</h1>
      
      <SearchFilters 
        filters={selectedFilters}
        onFilterChange={handleFilterChange}
        locations={locations}
      />
      
      {cars.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No cars found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}