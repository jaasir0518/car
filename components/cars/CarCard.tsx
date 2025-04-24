// components/cars/CarCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the interface for the car object
interface CarProps {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    category: string;
    price_per_day: number;
    image_url?: string;
    available: boolean;
    locations?: {
      city: string;
      state: string;
    };
  };
}

export default function CarCard({ car }: CarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48">
        {car.image_url ? (
          <Image 
            src={car.image_url}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
          />
        ) : (
          <Image 
            src="/images/placeholders/car-placeholder.jpg" 
            alt="Car placeholder"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          ${car.price_per_day}/day
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold">{car.make} {car.model}</h3>
        <p className="text-gray-600 text-sm">{car.year} • {car.category}</p>
        
        {car.locations && (
          <p className="text-sm text-gray-500 mt-1">
            <span className="inline-block mr-1">📍</span> 
            {car.locations.city}, {car.locations.state}
          </p>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <Link href={`/cars/${car.id}`}>
            <span className="text-blue-600 hover:text-blue-800 font-medium">View Details</span>
          </Link>
          
          <span className={`text-sm font-medium px-2 py-1 rounded ${
            car.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {car.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
    </div>
  );
}