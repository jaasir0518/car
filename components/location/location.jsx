// components/locations/LocationCard.jsx
import React from 'react';
import Link from 'next/link';

export default function LocationCard({ location }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
        <div className="text-gray-600 mb-4">
          <p>{location.address}</p>
          <p>{location.city}, {location.state} {location.zip}</p>
          <p>{location.country}</p>
        </div>
        
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{location.phone}</span>
        </div>
        
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{location.email}</span>
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
        <Link href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`} 
              className="text-blue-600 hover:text-blue-800 font-medium"
              target="_blank"
              rel="noopener noreferrer">
          Get Directions
        </Link>
      </div>
    </div>
  );
}

// components/locations/LocationMap.jsx
"use client";

import React, { useEffect, useRef } from 'react';

export default function LocationMap({ locations }) {
  const mapRef = useRef(null);
  
  useEffect(() => {
    // This is a placeholder implementation that would normally use a mapping library
    // like Google Maps, Mapbox, Leaflet, etc.
    
    // For a real implementation, you would:
    // 1. Load your map library of choice
    // 2. Initialize the map on the div referenced by mapRef
    // 3. Add markers for each location in the locations array
    
    // Since we can't include full map library implementation here,
    // we'll just show a placeholder message
    
    if (mapRef.current) {
      const mapPlaceholder = document.createElement('div');
      mapPlaceholder.className = 'flex items-center justify-center h-full bg-gray-100';
      mapPlaceholder.innerHTML = `
        <div class="text-center p-6">
          <h3 class="text-lg font-medium mb-2">Map Visualization</h3>
          <p class="text-gray-600">In production, this would display a map with ${locations.length} location markers.</p>
          <p class="text-gray-600 mt-2">Implement with Google Maps, Mapbox, or Leaflet.</p>
        </div>
      `;
      
      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(mapPlaceholder);
    }
    
    // For actual implementation, you would return a cleanup function
    // return () => { /* cleanup map */ };
  }, [locations]);
  
  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100">
      {/* Map will be rendered here by the effect hook */}
    </div>
  );
}

// For a real implementation with Google Maps, you would use something like:
/*
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function LocationMap({ locations }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const center = {
    lat: locations.length > 0 ? locations[0].latitude : 40.7128,
    lng: locations.length > 0 ? locations[0].longitude : -74.0060
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={locations.length > 1 ? 10 : 14}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.latitude, lng: location.longitude }}
          title={location.name}
        />
      ))}
    </GoogleMap>
  ) : <div className="w-full h-full flex items-center justify-center">Loading map...</div>;
}
*/