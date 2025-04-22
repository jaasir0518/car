import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, Gauge } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface car {
  id: string;
  name: string;
  image: string;
  price: number;
  location: string;
  passengers: number;
  mileage: number;
  transmission: string;
  year: number;
}

const CarCard = ({ car }: { car : any }) => {
  const { isSignedIn } = useAuth();
  
  const {
    id,
    name,
    image,
    price,
    location,
    passengers,
    mileage,
    transmission,
    year
  } = car;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={image || "/images/placeholders/car-placeholder.jpg"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-lg font-bold text-blue-600">${price}<span className="text-sm text-gray-500">/day</span></p>
        </div>
        
        <div className="flex items-center text-gray-600 mb-1">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 my-3">
          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-1" />
            <span className="text-sm">{passengers} seats</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Gauge size={16} className="mr-1" />
            <span className="text-sm">{mileage} MPG</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-1" />
            <span className="text-sm">{year}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm">{transmission}</span>
          </div>
        </div>
        
        <div className="mt-4">
          {isSignedIn ? (
            <Link href={`/cars/${id}`} className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors">
              View Details
            </Link>
          ) : (
            <Link href="/auth/signin" className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors">
              Sign in to Book
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;