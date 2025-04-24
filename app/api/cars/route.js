// app/api/cars/route.js
import { NextResponse } from 'next/server';
import { 
  getAllCars, 
  createCar 
} from '../../../lib/api/supabase-api';

export async function GET(request) {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const available = url.searchParams.get('available') === 'true' ? true : 
                     url.searchParams.get('available') === 'false' ? false : undefined;
    const location_id = url.searchParams.get('location_id') || undefined;
    const category = url.searchParams.get('category') || undefined;
    const priceMin = url.searchParams.get('priceMin') ? parseFloat(url.searchParams.get('priceMin')) : undefined;
    const priceMax = url.searchParams.get('priceMax') ? parseFloat(url.searchParams.get('priceMax')) : undefined;
    
    // Build filters object
    const filters = {
      available,
      location_id,
      category,
      priceMin,
      priceMax
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    const cars = await getAllCars(filters);
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const carData = await request.json();
    const newCar = await createCar(carData);
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}