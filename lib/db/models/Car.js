// lib/db/models/Car.js

import { supabase, handleSupabaseError } from '../index';

export const CarModel = {
  // Get all cars with pagination and filters
  async getCars({ page = 1, limit = 10, filters = {} }) {
    try {
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('cars')
        .select('*, locations(name, city), car_images(id, image_url, is_primary)', { count: 'exact' });
      
      // Apply filters
      if (filters.make) query = query.ilike('make', `%${filters.make}%`);
      if (filters.model) query = query.ilike('model', `%${filters.model}%`);
      if (filters.minPrice) query = query.gte('daily_rate', filters.minPrice);
      if (filters.maxPrice) query = query.lte('daily_rate', filters.maxPrice);
      if (filters.year) query = query.eq('year', filters.year);
      if (filters.location) query = query.eq('location_id', filters.location);
      if (filters.transmission) query = query.eq('transmission', filters.transmission);
      if (filters.fuel_type) query = query.eq('fuel_type', filters.fuel_type);
      if (filters.seats) query = query.eq('seats', filters.seats);
      
      // Only show available cars unless specifically requested
      if (filters.showUnavailable !== true) {
        query = query.eq('is_available', true);
      }
      
      // Add pagination
      const { data, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return { 
        cars: data, 
        count, 
        totalPages: Math.ceil(count / limit),
        currentPage: page
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Get a car by ID
  async getCarById(id) {
    try {
      // Get car details
      const { data: car, error: carError } = await supabase
        .from('cars')
        .select(`
          *,
          locations(id, name, address, city),
          car_images(id, image_url, is_primary),
          car_to_features(feature_id, car_features(id, name, icon))
        `)
        .eq('id', id)
        .single();
        
      if (carError) throw carError;
      
      // Get owner details
      const { data: owner, error: ownerError } = await supabase
        .from('users')
        .select('id, first_name, last_name')
        .eq('id', car.owner_id)
        .single();
        
      if (ownerError) throw ownerError;
      
      // Get reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*, users(first_name, last_name)')
        .eq('car_id', id)
        .order('created_at', { ascending: false });
        
      if (reviewsError) throw reviewsError;
      
      return { 
        car: { 
          ...car,
          owner,
          reviews 
        } 
      };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Create a new car listing
  async createCar(carData, imageFiles) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // First, insert the car details
      const { data: car, error: carError } = await supabase
        .from('cars')
        .insert({
          ...carData,
          owner_id: user.id,
          is_available: true,
          created_at: new Date(),
          updated_at: new Date()
        })
        .select()
        .single();
        
      if (carError) throw carError;
      
      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        const imageUploads = await Promise.all(
          imageFiles.map(async (file, index) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${car.id}/${Date.now()}-${index}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('car-images')
              .upload(fileName, file);
              
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('car-images')
              .getPublicUrl(fileName);
              
            // Add to car_images table
            const { error: imageError } = await supabase
              .from('car_images')
              .insert({
                car_id: car.id,
                image_url: publicUrl,
                is_primary: index === 0 // First image is primary
              });
              
            if (imageError) throw imageError;
            
            return publicUrl;
          })
        );
        
        // Update car with main image
        if (imageUploads.length > 0) {
          await supabase
            .from('cars')
            .update({ main_image_url: imageUploads[0] })
            .eq('id', car.id);
        }
      }
      
      return { car };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Update a car listing
  async updateCar(id, carData, newImageFiles = []) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // Check if user owns this car
      const { data: existingCar, error: checkError } = await supabase
        .from('cars')
        .select('owner_id')
        .eq('id', id)
        .single();
        
      if (checkError) throw checkError;
      
      if (existingCar.owner_id !== user.id) {
        return { error: 'Unauthorized: You do not own this car listing' };
      }
      
      // Update car details
      const { data: updatedCar, error: updateError } = await supabase
        .from('cars')
        .update({
          ...carData,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      // Upload new images if provided
      if (newImageFiles && newImageFiles.length > 0) {
        await Promise.all(
          newImageFiles.map(async (file, index) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${id}/${Date.now()}-${index}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('car-images')
              .upload(fileName, file);
              
            if (uploadError) throw uploadError;
            
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('car-images')
              .getPublicUrl(fileName);
              
            // Add to car_images table
            const { error: imageError } = await supabase
              .from('car_images')
              .insert({
                car_id: id,
                image_url: publicUrl,
                is_primary: false // New images are not primary by default
              });
              
            if (imageError) throw imageError;
            
            return publicUrl;
          })
        );
      }
      
      return { car: updatedCar };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Delete a car listing
  async deleteCar(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // Check if user owns this car
      const { data: car, error: checkError } = await supabase
        .from('cars')
        .select('owner_id')
        .eq('id', id)
        .single();
        
      if (checkError) throw checkError;
      
      if (car.owner_id !== user.id) {
        return { error: 'Unauthorized: You do not own this car listing' };
      }
      
      // Delete all images from storage
      const { data: images } = await supabase
        .from('car_images')
        .select('image_url')
        .eq('car_id', id);
        
      if (images && images.length > 0) {
        // Extract file paths from URLs
        const filePaths = images.map(img => {
          const url = new URL(img.image_url);
          return url.pathname.split('/').slice(-2).join('/');
        });
        
        // Delete from storage
        await supabase.storage
          .from('car-images')
          .remove(filePaths);
      }
      
      // Delete car (cascade will handle related records)
      const { error: deleteError } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);
        
      if (deleteError) throw deleteError;
      
      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Get cars by user ID (for dashboard)
  async getUserCars(userId) {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*, locations(name), car_images(image_url, is_primary)')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return { cars: data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};