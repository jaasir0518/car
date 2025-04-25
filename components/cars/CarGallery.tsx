import CarCard from './CarCard';

interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  imageUrl: string;
  daily_rate: number;
  transmission: string;
  fuel_type: string;
  seats: number;
}

interface CarGalleryProps {
  cars: Car[];
}

export default function CarGallery({ cars }: CarGalleryProps) {
  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">No cars found matching your criteria</h2>
        <p className="mt-2 text-gray-500">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
} 