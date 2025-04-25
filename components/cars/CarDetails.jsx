'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import DatePicker from '@/components/ui/DatePicker';

export default function CarDetails({ car, onBookNow }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate total days between start and end date
  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Parse features from JSONB
  const features = car.features ? (
    typeof car.features === 'string' ? JSON.parse(car.features) : car.features
  ) : [];

  // Parse images from JSONB
  const images = [
    car.main_image_url, // First image is always the main image
    ...(car.images ? (
      typeof car.images === 'string' ? JSON.parse(car.images) : car.images
    ) : [])
  ].filter(Boolean); // Remove any null/undefined values

  // Get currently selected image
  const currentImage = images.length > 0 ? 
    images[selectedImageIndex] : 
    '/images/placeholders/car-placeholder.jpg';

  // Get location opening hours if available
  const openingHours = car.locations?.opening_hours ? (
    typeof car.locations.opening_hours === 'string' ? 
      JSON.parse(car.locations.opening_hours) : 
      car.locations.opening_hours
  ) : null;

  const totalDays = calculateTotalDays();
  const totalPrice = totalDays * car.daily_rate;

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => window.history.back()}>
          &larr; Back to Cars
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car images section */}
        <div className="lg:col-span-2">
          {/* Main image */}
          <div className="relative h-80 w-full rounded-lg overflow-hidden mb-4">
            <Image
              src={currentImage}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
            />
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={`relative h-16 w-24 rounded cursor-pointer border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={img}
                    alt={`${car.brand} ${car.model} thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Car details section */}
          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-600 mb-6">
              <span className="mr-4">
                {car.brand} {car.model}, {car.year}
              </span>
              
              {car.rating && (
                <div className="flex items-center mr-4">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span>{car.rating}</span>
                  <span className="text-xs ml-1">({car.review_count} reviews)</span>
                </div>
              )}
              
              <span className="text-blue-600 font-semibold">
                {formatCurrency(car.daily_rate)}/day
              </span>
            </div>
            
            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Transmission</div>
                <div className="font-medium">{car.transmission}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Fuel Type</div>
                <div className="font-medium">{car.fuel_type}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Seats</div>
                <div className="font-medium">{car.seats}</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-500">Color</div>
                <div className="font-medium">{car.color}</div>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
            </div>
            
            {/* Features */}
            {features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Features</h2>
                <ul className="grid grid-cols-2 gap-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Location */}
            {car.locations && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Pickup Location</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-lg mb-2">{car.locations.name}</h3>
                  <p className="text-gray-700 mb-2">
                    {car.locations.address}, {car.locations.city}, {car.locations.state} {car.locations.postal_code}, {car.locations.country}
                  </p>
                  
                  {car.locations.phone && (
                    <p className="text-gray-700">
                      <span className="font-medium">Phone:</span> {car.locations.phone}
                    </p>
                  )}
                  
                  {car.locations.email && (
                    <p className="text-gray-700">
                      <span className="font-medium">Email:</span> {car.locations.email}
                    </p>
                  )}
                  
                  {openingHours && (
                    <div className="mt-3">
                      <h4 className="font-medium mb-1">Opening Hours:</h4>
                      <ul className="text-sm">
                        {Object.entries(openingHours).map(([day, hours]) => (
                          <li key={day} className="flex justify-between">
                            <span className="capitalize">{day}:</span>
                            <span>{hours}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Booking sidebar */}
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Book This Car</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
              <DatePicker 
                selectedDate={startDate}
                onChange={setStartDate}
                minDate={new Date()}
                placeholderText="Select pick-up date"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <DatePicker 
                selectedDate={endDate}
                onChange={setEndDate}
                minDate={startDate || new Date()}
                placeholderText="Select return date"
                disabled={!startDate}
              />
            </div>
            
            {startDate && endDate && (
              <div className="mb-6 p-3 bg-gray-50 rounded">
                <div className="flex justify-between mb-2">
                  <span>Daily rate:</span>
                  <span>{formatCurrency(car.daily_rate)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Days:</span>
                  <span>{totalDays}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            )}
            
            <Button 
              onClick={onBookNow}
              className="w-full" 
              disabled={!startDate || !endDate}
            >
              Book Now
            </Button>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              No charge until pickup confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}