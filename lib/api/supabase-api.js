import supabase from '../supabase';

// Cars API functions
export async function getAllCars(filters = {}) {
  let query = supabase.from('cars').select('*, locations(*)');
  
  // Apply filters if provided
  if (filters.available !== undefined) {
    query = query.eq('available', filters.available);
  }
  
  if (filters.location_id) {
    query = query.eq('location_id', filters.location_id);
  }
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.priceMin !== undefined) {
    query = query.gte('price_per_day', filters.priceMin);
  }
  
  if (filters.priceMax !== undefined) {
    query = query.lte('price_per_day', filters.priceMax);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getCarById(id) {
  const { data, error } = await supabase
    .from('cars')
    .select('*, locations(*)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCar(carData) {
  const { data, error } = await supabase
    .from('cars')
    .insert(carData)
    .select();
  
  if (error) throw error;
  return data;
}

export async function updateCar(id, carData) {
  const { data, error } = await supabase
    .from('cars')
    .update(carData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
}

export async function deleteCar(id) {
  const { error } = await supabase
    .from('cars')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Locations API functions
export async function getAllLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function getLocationById(id) {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createLocation(locationData) {
  const { data, error } = await supabase
    .from('locations')
    .insert(locationData)
    .select();
  
  if (error) throw error;
  return data;
}

export async function updateLocation(id, locationData) {
  const { data, error } = await supabase
    .from('locations')
    .update(locationData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data;
}

export async function deleteLocation(id) {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Get cars by location
export async function getCarsByLocation(locationId) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('location_id', locationId)
    .eq('available', true);
  
  if (error) throw error;
  return data;
}

// Check car availability
export async function checkCarAvailability(carId) {
  const { data, error } = await supabase
    .from('cars')
    .select('available')
    .eq('id', carId)
    .single();
  
  if (error) throw error;
  return data.available;
}

// Update car availability
export async function updateCarAvailability(carId, isAvailable) {
  const { data, error } = await supabase
    .from('cars')
    .update({ available: isAvailable })
    .eq('id', carId)
    .select();
  
  if (error) throw error;
  return data;
}