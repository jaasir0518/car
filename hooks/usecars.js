// hooks/useCars.js

import { useState, useEffect } from 'react';
import { CarModel } from '@/lib/db/models/Car';

export const useCars = (initialFilters = {}) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    count: 0
  });
  const [filters, setFilters] = useState(initialFilters);

  // Load cars with current filters and pagination
  const loadCars = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const { cars: carData, error: carError, count, totalPages, currentPage } = 
        await CarModel.getCars({ page, limit: 12, filters });
      
      if (carError) {
        setError(carError);
      } else {
        setCars(carData);
        setPagination({ currentPage, totalPages, count });
      }
    } catch (err) {
      setError(err.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };
  
  // Load cars when filters change
  useEffect(() => {
    loadCars(1); // Reset to first page when filters change
  }, [JSON.stringify(filters)]); // Deep compare filters
  
  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Reset filters to initial state
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  // Change page
  const changePage = (page) => {
    loadCars(page);
  };
  
  return {
    cars,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    changePage,
    refreshCars: loadCars
  };
};