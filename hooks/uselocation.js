import { useState, useEffect } from 'react';
import { 
  getAllLocations, 
  getLocationById, 
  createLocation, 
  updateLocation, 
  deleteLocation,
  getCarsByLocation
} from '../lib/api/supabase-api';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true);
        const data = await getAllLocations();
        setLocations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLocations();
  }, []);

  const getLocation = async (id) => {
    try {
      setLoading(true);
      return await getLocationById(id);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addLocation = async (locationData) => {
    try {
      setLoading(true);
      const newLocation = await createLocation(locationData);
      setLocations(prev => [...prev, newLocation[0]]);
      return newLocation[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editLocation = async (id, locationData) => {
    try {
      setLoading(true);
      const updated = await updateLocation(id, locationData);
      setLocations(prev => prev.map(location => location.id === id ? updated[0] : location));
      return updated[0];
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = async (id) => {
    try {
      setLoading(true);
      await deleteLocation(id);
      setLocations(prev => prev.filter(location => location.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCarsAtLocation = async (locationId) => {
    try {
      return await getCarsByLocation(locationId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  return {
    locations,
    loading,
    error,
    getLocation,
    addLocation,
    editLocation,
    removeLocation,
    getCarsAtLocation
  };
}