'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching locations:', error);
      } else {
        setLocations(data || []);
      }
      
      setLoading(false);
    }

    fetchLocations();
  }, []);

  const parseOpeningHours = (hoursJson) => {
    if (!hoursJson) return {};
    return typeof hoursJson === 'string' ? JSON.parse(hoursJson) : hoursJson;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Locations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {locations.map(location => {
          const openingHours = parseOpeningHours(location.opening_hours);
          
          return (
            <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{location.name}</h2>
                <p className="text-gray-600 mb-4">
                  {location.address}, {location.city}, {location.state || ''} {location.postal_code}, {location.country}
                </p>
                
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>{location.phone || 'N/A'}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>{location.email || 'N/A'}</span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">Opening Hours</h3>
                <ul className="text-sm text-gray-600 mb-6">
                  {Object.keys(openingHours).length > 0 ? (
                    Object.entries(openingHours).map(([day, hours]) => (
                      <li key={day} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                        <span className="capitalize">{day}</span>
                        <span>{hours}</span>
                      </li>
                    ))
                  ) : (
                    <li>Opening hours not available</li>
                  )}
                </ul>
                
                {location.latitude && location.longitude && (
                  <div className="relative h-48 w-full mb-4 rounded overflow-hidden">
                    <Image
                      src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+1a73e8(${location.longitude},${location.latitude})/${location.longitude},${location.latitude},14,0/600x300?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                      alt={`Map of ${location.name}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <Link 
                  href={`/cars?location=${location.id}`}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Browse Cars at This Location
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}