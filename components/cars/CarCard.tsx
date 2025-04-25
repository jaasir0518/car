import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  daily_rate: number;
  rating?: number;
  review_count?: number;
  transmission: string;
  fuel_type: string;
  seats: number;
  main_image_url?: string;
  is_featured?: boolean;
  locations?: {
    name: string;
    city: string;
  };
}

export default function CarCard({ car }: { car: Car }) {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        {car.main_image_url ? (
          <Image
            src={car.main_image_url}
            alt={`${car.brand} ${car.model}`}
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
        
        {car.is_featured && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs font-bold">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{car.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{car.brand} {car.model} • {car.year}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(car.daily_rate)}<span className="text-sm text-gray-500">/day</span></p>
          </div>
          
          {car.rating && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span className="text-sm font-semibold">{car.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({car.review_count})</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {car.transmission}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {car.fuel_type}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {car.seats} seats
          </span>
        </div>
        
        {car.locations && (
          <p className="text-sm text-gray-600 mb-4">
            <span className="inline-block mr-1">
              <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </span>
            {car.locations.name}, {car.locations.city}
          </p>
        )}
        
        <Link href={`/cars/${car.id}`}>
          <Button className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
}