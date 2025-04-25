'use client';

import { createContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const CarContext = createContext();

export function CarProvider({ children }) {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const supabase = createClientComponentClient();

  // Fetch featured cars
  useEffect(() => {
    async function fetchFeaturedCars() {
      setLoadingFeatured(true);
      
      const { data, error } = await supabase
        .from('cars')
        .select(`
          *,
          locations(name, city)
        `)
        .eq('is_featured', true)
        .eq('is_deleted', false)
        .eq('availability_status', 'available')
        .limit(4);
      
      if (error) {
        console.error('Error fetching featured cars:', error);
      } else {
        setFeaturedCars(data || []);
      }
      
      setLoadingFeatured(false);
    }

    fetchFeaturedCars();
  }, [supabase]);

  // Function to fetch cars with filters
  const fetchCars = async (filters = {}) => {
    let query = supabase.from('cars')
      .select(`
        *,
        locations(name, city)
      `)
      .eq('is_deleted', false);
    
    // Apply filters
    if (filters.brand) query = query.ilike('brand', `%${filters.brand}%`);
    if (filters.model) query = query.ilike('model', `%${filters.model}%`);
    if (filters.location) query = query.eq('location_id', filters.location);
    if (filters.minPrice) query = query.gte('daily_rate', filters.minPrice);
    if (filters.maxPrice) query = query.lte('daily_rate', filters.maxPrice);
    if (filters.transmission) query = query.eq('transmission', filters.transmission);
    if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType);
    if (filters.seats) query = query.eq('seats', filters.seats);
    if (filters.year) query = query.eq('year', filters.year);
    if (filters.availability) query = query.eq('availability_status', filters.availability);
    
    if (filters.orderBy) {
      const [column, direction] = filters.orderBy.split(':');
      query = query.order(column, { ascending: direction === 'asc' });
    } else {
      // Default ordering
      query = query.order('created_at', { ascending: false });
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
    
    return data || [];
  };

  // Function to get a single car by ID
  const getCarById = async (id) => {
    const { data, error } = await supabase
      .from('cars')
      .select(`
        *,
        locations(id, name, address, city, state, country, postal_code, phone, email, opening_hours)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching car details:', error);
      throw error;
    }
    
    return data;
  };

  // Function to create a new car listing
  const createCar = async (carData) => {
    const { data, error } = await supabase
      .from('cars')
      .insert([carData])
      .select();
    
    if (error) {
      console.error('Error creating car listing:', error);
      throw error;
    }
    
    return data[0];
  };

  // Function to update a car listing
  const updateCar = async (id, carData) => {
    const { data, error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating car listing:', error);
      throw error;
    }
    
    return data[0];
  };

  // Function to delete a car listing (soft delete)
  const deleteCar = async (id) => {
    const { data, error } = await supabase
      .from('cars')
      .update({ is_deleted: true })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error deleting car listing:', error);
      throw error;
    }
    
    return data[0];
  };

  // Function to upload car images
  const uploadCarImage = async (file, path) => {
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Error uploading car image:', error);
      throw error;
    }
    
    // Get the public URL
    const { data: publicUrl } = supabase.storage
      .from('car-images')
      .getPublicUrl(data.path);
    
    return publicUrl.publicUrl;
  };

  const value = {
    featuredCars,
    loadingFeatured,
    fetchCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    uploadCarImage,
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
}