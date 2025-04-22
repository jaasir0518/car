'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CarGallery from '@/components/cars/CarGallery';
import SearchFilters from '@/components/cars/SearchFilters';
import UploadCarForm from '@/components/cars/UploadCarForm';
import CarCard from '@/components/cars/CarCard';
import { Car } from 'lucide-react';

const CarsPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("Available Cars");
  const [description, setDescription] = useState("Browse our selection of high-quality rental cars.");
  const [filters, setFilters] = useState({});

  const handleAddCar = () => {
    router.push('/upload');
  };

  const handleFilterChange = (newFilters : any) => {
    setFilters(newFilters);
    
    // Update title based on filters
    if (newFilters.location) {
      setTitle(`Cars in ${newFilters.location}`);
    } else {
      setTitle("Available Cars");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-blue-100">{description}</p>
            </div>
            <button
              onClick={handleAddCar}
              className="mt-4 md:mt-0 flex items-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Car size={20} className="mr-2" />
              List Your Car
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SearchFilters onFilterChange={handleFilterChange} />
        <CarGallery filters={filters} />
      </div>
    </div>
  );
};

export default CarsPage;