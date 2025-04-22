'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CarCard from '@/components/cars/CarCard';
import SearchFilters from '@/components/cars/SearchFilters';
import { Car } from 'lucide-react';

// Mock data for demonstration - replace with your actual data source
const MOCK_CARS = [
  {
    id: 1,
    name: 'Tesla Model 3',
    price: 75,
    location: 'San Francisco',
    year: 2023,
    rating: 4.8,
    reviewCount: 124,
    category: 'Electric'
  },
  {
    id: 2,
    name: 'Toyota Camry',
    price: 45,
    location: 'Los Angeles',
    year: 2022,
    rating: 4.5,
    reviewCount: 89,
    category: 'Sedan'
  }
];

const CarsPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("Available Cars");
  const [description, setDescription] = useState("Browse our selection of high-quality rental cars.");
  const [filters, setFilters] = useState({});
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate fetching cars - replace with your actual implementation
  useEffect(() => {
    const loadCars = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setCars(MOCK_CARS);
        setLoading(false);
      }, 500);
    };

    loadCars();
  }, []);

  const handleAddCar = () => {
    router.push('/upload');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    if (newFilters.location) {
      setTitle(`Cars in ${newFilters.location}`);
    } else {
      setTitle("Available Cars");
    }
  };

  // Filter cars based on current filters
  const filteredCars = cars.filter(car => {
    // Implement your filtering logic here
    if (filters.location && car.location !== filters.location) {
      return false;
    }
    return true;
  });

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
        
        {/* Replace CarGallery with direct rendering of CarCard components */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-10">Loading cars...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
              {filteredCars.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No cars found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;