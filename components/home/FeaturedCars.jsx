// components/home/FeaturedCars.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for featured cars
const FEATURED_CARS = [
  {
    id: 1,
    name: "Tesla Model S",
    category: "Electric",
    price: 150,
    image: "/images/cars/car1.jpg",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Electric"
  },
  {
    id: 2,
    name: "BMW X5",
    category: "SUV",
    price: 180,
    image: "/images/cars/car2.jpg",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Diesel"
  },
  {
    id: 3,
    name: "Mercedes C-Class",
    category: "Sedan",
    price: 130,
    image: "/images/cars/car1.jpg", // Reusing image as placeholder
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol"
  },
  {
    id: 4,
    name: "Toyota Prius",
    category: "Hybrid",
    price: 95,
    image: "/images/cars/car2.jpg", // Reusing image as placeholder
    seats: 5,
    transmission: "Automatic",
    fuelType: "Hybrid"
  }
];

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  
  // Simulate fetching featured cars
  useEffect(() => {
    // In a real app, this would be an API call
    setCars(FEATURED_CARS);
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Cars
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Explore our selection of premium vehicles for your next journey
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-opacity hover:opacity-90"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {car.category}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">${car.price}<span className="text-sm text-gray-500">/day</span></p>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{car.fuelType}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link 
                    href={`/cars/${car.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            href="/cars"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Cars
          </Link>
        </div>
      </div>
    </section>
  );
}