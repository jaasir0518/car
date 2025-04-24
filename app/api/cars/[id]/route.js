// app/api/cars/[id]/route.js
import { NextResponse } from 'next/server';
import { 
  getCarById, 
  updateCar, 
  deleteCar 
} from '../../../../lib/api/supabase-api';

export async function GET(request, { params }) {
  try {
    const car = await getCarById(params.id);
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const carData = await request.json();
    const updatedCar = await updateCar(params.id, carData);
    if (!updatedCar || updatedCar.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(updatedCar[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await deleteCar(params.id);
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}