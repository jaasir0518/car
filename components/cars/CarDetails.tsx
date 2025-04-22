import { useState, useEffect } from 'react';
import CarCard from './CarCard';
import SearchFilters from './SearchFilters';
import { useAuth } from '@clerk/nextjs';

const CarGallery = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cars');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilter = (filters) => {
    let results = [...cars];
    
    // Apply location filter
    if (filters.location) {
      results = results.filter(car => 
        car.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      // In a real app, you'd check car availability for the date range
      // This is a simplified example
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      results = results.filter(car => car.price >= min && car.price <= max);
    }
    
    // Apply vehicle type filter
    if (filters.vehicleType && filters.vehicleType !== 'all') {
      results = results.filter(car => car.type === filters.vehicleType);
    }
    
    // Apply transmission filter
    if (filters.transmission && filters.transmission !== 'all') {
      results = results.filter(car => car.transmission === filters.transmission);
    }
    
    setFilteredCars(results);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilters onFilter={handleFilter} />
      
      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No cars match your search criteria. Please try different filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarGallery;