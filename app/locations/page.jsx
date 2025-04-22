'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/Loader';

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Mock data - in a real app, you'd fetch this from an API
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLocations([
        {
          id: 1,
          name: 'Downtown Office',
          address: '123 Main Street, Downtown',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '(212) 555-1234',
          email: 'downtown@carrentalcompany.com',
          workingHours: 'Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 6:00 PM',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          availableCars: 45
        },
        {
          id: 2,
          name: 'Airport Terminal',
          address: '456 Airport Way, Terminal B',
          city: 'New York',
          state: 'NY',
          zipCode: '11430',
          phone: '(212) 555-5678',
          email: 'airport@carrentalcompany.com',
          workingHours: 'Open 24/7',
          coordinates: { lat: 40.6413, lng: -73.7781 },
          availableCars: 78
        },
        {
          id: 3,
          name: 'Midtown Branch',
          address: '789 Fifth Avenue',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          phone: '(212) 555-9012',
          email: 'midtown@carrentalcompany.com',
          workingHours: 'Mon-Sun: 7:00 AM - 10:00 PM',
          coordinates: { lat: 40.7580, lng: -73.9855 },
          availableCars: 32
        },
        {
          id: 4,
          name: 'Brooklyn Heights',
          address: '101 Brooklyn Avenue',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201',
          phone: '(718) 555-3456',
          email: 'brooklyn@carrentalcompany.com',
          workingHours: 'Mon-Fri: 8:00 AM - 7:00 PM, Sat-Sun: 9:00 AM - 5:00 PM',
          coordinates: { lat: 40.6978, lng: -73.9937 },
          availableCars: 28
        },
        {
          id: 5,
          name: 'Queens Center',
          address: '222 Queens Boulevard',
          city: 'Queens',
          state: 'NY',
          zipCode: '11375',
          phone: '(718) 555-7890',
          email: 'queens@carrentalcompany.com',
          workingHours: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM',
          coordinates: { lat: 40.7282, lng: -73.8458 },
          availableCars: 35
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter locations based on search query
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseDetails = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rental Locations</h1>
      
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search by location name, address or city..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full max-w-xl"
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <LocationCard 
              key={location.id} 
              location={location} 
              onSelect={handleLocationSelect}
            />
          ))}
        </div>
      )}

      {filteredLocations.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No locations found matching your search.</p>
        </div>
      )}

      {selectedLocation && (
        <LocationDetailsModal 
          location={selectedLocation} 
          onClose={handleCloseDetails} 
        />
      )}

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Find Us Nationwide</h2>
        <p className="mb-6">
          With over 200 locations across the country, our car rental service is never far away.
          Whether you're at an airport, downtown, or in the suburbs, we've got you covered.
        </p>
        
        {/* This would be replaced with an actual map component in production */}
        <div className="bg-gray-200 w-full h-96 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Interactive map would be displayed here</p>
        </div>
      </div>
    </div>
  );
}

// Location Card Component
function LocationCard({ location, onSelect }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-gray-100 h-48 relative">
        {/* Placeholder image - in production, use actual location images */}
        <Image 
          src="/images/placeholders/car-placeholder.jpg"
          alt={location.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold">{location.name}</h3>
        <p className="text-gray-600 mb-2">{location.address}</p>
        <p className="text-gray-600 mb-3">{location.city}, {location.state} {location.zipCode}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">{location.phone}</span>
          <span className="text-sm font-medium text-green-600">{location.availableCars} cars available</span>
        </div>
        
        <Button onClick={() => onSelect(location)} className="w-full">
          View Details
        </Button>
      </div>
    </div>
  );
}

// Location Details Modal Component
function LocationDetailsModal({ location, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{location.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-gray-100 h-64 relative mb-4 rounded-lg">
            {/* Placeholder image */}
            <Image 
              src="/images/placeholders/car-placeholder.jpg"
              alt={location.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
              <p className="mb-1"><span className="font-medium">Address:</span> {location.address}</p>
              <p className="mb-1"><span className="font-medium">City:</span> {location.city}, {location.state} {location.zipCode}</p>
              <p className="mb-1"><span className="font-medium">Phone:</span> {location.phone}</p>
              <p className="mb-3"><span className="font-medium">Email:</span> {location.email}</p>
              
              <h3 className="font-semibold text-lg mb-2 mt-4">Working Hours</h3>
              <p className="mb-3">{location.workingHours}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Available Fleet</h3>
              <p className="mb-2"><span className="font-medium text-green-600">{location.availableCars} vehicles</span> currently available at this location</p>
              
              <div className="mt-4">
                <Button className="w-full mb-2">Reserve a Car Here</Button>
                <Button className="w-full bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}``