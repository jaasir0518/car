// hooks/useLocations.js
import { useState, useEffect } from 'react';
import { getAllLocations } from '../lib/api/supabase-api';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getAllLocations();
        setLocations(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
}