'use client';


import React, { useEffect, useState } from 'react';
import CarCard from '../cars/CarCard';
import { getAllCars } from '../../lib/api/supabase-api';

export default function FeaturedCars() {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeaturedCars() {
      try {
        setLoading(true);
        // Get available cars and limit to 3
        const cars = await getAllCars({ available: true });
        setFeaturedCars(cars.slice(0, 3));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedCars();
  }, []);

  if (loading) return <div className="text-center py-10">Loading featured cars...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (featuredCars.length === 0) return null;

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Cars</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a
            href="/cars"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            View All Cars
          </a>
        </div>
      </div>
    </section>
  );
}