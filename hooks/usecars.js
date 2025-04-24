import { useState, useEffect } from 'react';
import { 
  getAllCars, 
  getCarById, 
  createCar, 
  updateCar, 
  deleteCar, 
  checkCarAvailability,
  updateCarAvailability
} from '../lib/api/supabase-api';

export function useCars(initialFilters = {}) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    async function fetchCars() {
      try {
        setLoading(true);
        const data = await getAllCars(filters);
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCars();
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getCar = async (id) => {
    try {
      setLoading(true);
      return await getCarById(id);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addCar = async (carData) => {
    try {
      setLoading(true);
      const newCar = await createCar(carData);
      setCars(prev => [...prev, newCar[0]]);
      return newCar[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editCar = async (id, carData) => {
    try {
      setLoading(true);
      const updated = await updateCar(id, carData);
      setCars(prev => prev.map(car => car.id === id ? updated[0] : car));
      return updated[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeCar = async (id) => {
    try {
      setLoading(true);
      await deleteCar(id);
      setCars(prev => prev.filter(car => car.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (id) => {
    try {
      return await checkCarAvailability(id);
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const setAvailability = async (id, isAvailable) => {
    try {
      const updated = await updateCarAvailability(id, isAvailable);
      setCars(prev => prev.map(car => car.id === id ? { ...car, available: isAvailable } : car));
      return updated[0];
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return {
    cars,
    loading,
    error,
    filters,
    updateFilters,
    getCar,
    addCar,
    editCar,
    removeCar,
    checkAvailability,
    setAvailability
  };
}