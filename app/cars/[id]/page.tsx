'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Gauge, 
  ChevronLeft, 
  Star, 
  Check, 
  DollarSign,
  X
} from 'lucide-react';

interface CarDetailsProps {
  params: {
    id: string;
  };
}

const CarDetailsPage = ({ params }: CarDetailsProps) => {
  const router = useRouter();
  const { isSignedIn, userId, getToken } = useAuth();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cars/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch car details');
        }
        
        const data = await response.json();
        setCar(data);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Could not load car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCarDetails();
    }
  }, [params.id]);

  // Calculate total price when dates change
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Add 1 because if you pick up and return on the same day, it's still one day of rental
      const days = diffDays > 0 ? diffDays : 1;
      setTotalPrice(car.price * days);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, car]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      router.push('/auth/signin');
      return;
    }
    
    setBookingSubmitting(true);
    setBookingError('');
    
    try {
      const token = await getToken();
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: car.id,
          startDate,
          endDate,
          totalPrice
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
      
      setBookingSuccess(true);
      
      // Reset form fields
      setStartDate('');
      setEndDate('');
      
      // Redirect to bookings page after a delay
      setTimeout(() => {
        router.push('/dashboard/bookings');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setBookingError(err.message || 'An error occurred while creating your booking.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Car not found'}</p>
          <button 
            onClick={goBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft size={20} />
            <span>Go back to car listings</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button 
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to car listings</span>
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Car image */}
              <div className="relative h-64 w-full">
                <Image
                  src={car.image || "/images/placeholders/car-placeholder.jpg"}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Car info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-800">{car.name}</h1>
                  <p className="text-2xl font-bold text-blue-600">${car.price}<span className="text-sm text-gray-500">/day</span></p>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin size={18} className="mr-2" />
                  <span>{car.location}</span>
                </div>
                
                <p className="text-gray-700 mb-6">{car.description}</p>
                
                {/* Car specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-gray-500 text-sm mb-1">Year</div>
                    <div className="font-medium">{car.year}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-gray-500 text-sm mb-1">Transmission</div>
                    <div className="font-medium capitalize">{car.transmission}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-gray-500 text-sm mb-1">Passengers</div>
                    <div className="font-medium">{car.passengers} people</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-gray-500 text-sm mb-1">Fuel efficiency</div>
                    <div className="font-medium">{car.mileage} MPG</div>
                  </div>
                </div>
                
                {/* Car features */}
                {car.features && car.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {car.features.map((feature: string) => (
                        <div key={feature} className="flex items-center text-gray-700">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Owner info */}
                {car.owner && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Car Owner</h3>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-3">
                        {car.owner.image ? (
                          <Image 
                            src={car.owner.image} 
                            alt={car.owner.name || 'Car Owner'} 
                            width={48} 
                            height={48} 
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {car.owner.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{car.owner.name || 'Car Owner'}</p>
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < 4 ? "text-yellow-400" : "text-gray-300"} 
                              fill={i < 4 ? "currentColor" : "none"}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">4.0 (12 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Booking form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Book this car</h2>
              
              {bookingSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
                  <Check size={18} className="mr-2" />
                  <span>Booking successful! Redirecting to your bookings...</span>
                </div>
              )}
              
              {bookingError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                  <X size={18} className="mr-2" />
                  <span>{bookingError}</span>
                </div>
              )}
              
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-up Date
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="pl-10 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                      className="pl-10 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Price calculation */}
                {totalPrice > 0 && (
                  <div className="border-t border-b py-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">${car.price} × {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1} days</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={bookingSubmitting || !startDate || !endDate || bookingSuccess}
                  className={`w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center ${
                    (bookingSubmitting || !startDate || !endDate || bookingSuccess) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {bookingSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign size={18} className="mr-2" />
                      Book Now
                    </>
                  )}
                </button>
                
                {!isSignedIn && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    You'll need to sign in to complete booking
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;