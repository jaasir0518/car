// api/supabase.js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - replace with your actual credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all cars with optional filtering
 * @param {Object} options - Query options
 * @param {boolean} [options.available] - Filter by availability
 * @returns {Promise<Array>} - Array of car objects
 */
export async function getAllCars({ available = null } = {}) {
  let query = supabase.from('cars').select('*');
  
  // Apply filter if specified
  if (available !== null) {
    query = query.eq('available', available);
  }
  
  const { data, error } = await query.order('id');
  
  if (error) {
    throw new Error(`Error fetching cars: ${error.message}`);
  }
  
  return data || [];
}

/**
 * Get a specific car by ID
 * @param {string|number} id - Car ID
 * @returns {Promise<Object>} - Car object
 */
export async function getCarById(id) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(`Error fetching car: ${error.message}`);
  }
  
  return data;
}

/**
 * Update a car's details
 * @param {string|number} id - Car ID
 * @param {Object} updates - Car properties to update
 * @returns {Promise<Object>} - Updated car object
 */
export async function updateCar(id, updates) {
  const { data, error } = await supabase
    .from('cars')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Error updating car: ${error.message}`);
  }
  
  return data;
}