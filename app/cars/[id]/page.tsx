// app/cars/[id]/page.js

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { CarModel } from '../../../lib/db/models/Car';
import { BookingModel } from '../../../lib/db/models/Booking';
import CarDetails from '../../../components/cars/CarDetails';
import DatePicker from '../../../components/ui/DatePicker';
import { Button } from '../../../components/ui/button';
import Loader from '../../../components/ui/Loader';
import { Modal } from '../../../components/ui/Modal';

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    start_date: null,
    end_date: null
  });
  const [totalDays, setTotalDays] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      
      try {
        const { car: carData, error } = await CarModel.getCarById(params.id);
        
        if (error) {
          throw new Error(error);
        }
        
        setCar(carData);
      } catch (err) {
        setError(err.message || 'Failed to load car details');
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchCar();
    }
  }, [params.id]);

  // Calculate total days when dates change
  useEffect(() => {
    if (bookingDates.start_date && bookingDates.end_date) {
      const start = new Date(bookingDates.start_date);
      const end = new Date(bookingDates.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
    } else {
      setTotalDays(0);
    }
  }, [bookingDates.start_date, bookingDates.end_date]);

  const handleDateChange = (name, date) => {
    setBookingDates(prev => ({ ...prev, [name]: date }));
  };

  const handleBookNow = () => {
    if (!user) {
      // Redirect to sign in if not logged in
      router.push('/auth/signin?redirect=' + encodeURIComponent(`/cars/${params.id}`));
      return;
    }
    
    // Make sure we have dates
    if (!bookingDates.start_date || !bookingDates.end_date) {
      setBookingError('Please select pickup and return dates');
      return;
    }
    
    // Open booking modal
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      // Create booking data
      const bookingData = {
        car_id: car.id,
        pickup_location_id: car.location_id,
        return_location_id: car.location_id,
        start_date: bookingDates.start_date,
        end_date: bookingDates.end_date,
        total_price: car.daily_rate * totalDays
      };
      
      const { booking, error } = await BookingModel.createBooking(bookingData);
      
      if (error) {
        throw new Error(error);
      }
      
      // Close modal and redirect to booking details
      setShowBookingModal(false);
      router.push(`/dashboard/bookings?success=true&booking=${booking.id}`);
      
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center min-h-[50vh]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 p-6 rounded-lg text-red-700">
          <h3 className="text-xl font-medium mb-2">Error</h3>
          <p>{error || 'Car not found'}</p>
          <Button
            variant="secondary"
            onClick={() => router.push('/cars')}
            className="mt-4"
          >
            Back to Cars
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Car Details Component */}
      <CarDetails car={car} />
      
      {/* Booking Section */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow">
        <h3 className="text-xl font-medium mb-4">Book This Car</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Date
            </label>
            <DatePicker
              selected={bookingDates.start_date}
              onChange={date => handleDateChange('start_date', date)}
              minDate={new Date()}
              placeholderText="Select pickup date"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date
            </label>
            <DatePicker
              selected={bookingDates.end_date}
              onChange={date => handleDateChange('end_date', date)}
              minDate={bookingDates.start_date || new Date()}
              placeholderText="Select return date"
              className="w-full"
            />
          </div>
        </div>
        
        {totalDays > 0 && (
          <div className="mb-4 p-4 bg-white rounded-md">
            <div className="flex justify-between mb-2">
              <span>Daily Rate:</span>
              <span>${car.daily_rate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Number of Days:</span>
              <span>{totalDays}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total Price:</span>
              <span>${(car.daily_rate * totalDays).toFixed(2)}</span>
            </div>
          </div>
        )}
        
        <Button
          variant="primary"
          onClick={handleBookNow}
          fullWidth
        >
          Book Now
        </Button>
        
        {bookingError && !showBookingModal && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {bookingError}
          </div>
        )}
      </div>
      
      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Booking"
      >
        <div className="p-4">
          <h4 className="text-lg font-medium mb-2">
            {car.make} {car.model} ({car.year})
          </h4>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Pickup Date:</span>
              <span>{new Date(bookingDates.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Return Date:</span>
              <span>{new Date(bookingDates.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Location:</span>
              <span>{car.locations.name}</span>
            </div>
          </div>
          
          <div className="bg-gray-100 p-3 rounded-md mb-4">
            <div className="flex justify-between mb-1">
              <span>Daily Rate:</span>
              <span>${car.daily_rate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Days:</span>
              <span>{totalDays}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${(car.daily_rate * totalDays).toFixed(2)}</span>
            </div>
          </div>
          
          {bookingError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {bookingError}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowBookingModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmBooking}
              loading={bookingLoading}
            >
              Confirm & Pay
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}