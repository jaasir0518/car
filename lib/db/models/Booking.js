// lib/db/models/Booking.js

import { supabase, handleSupabaseError } from '../index';

export const BookingModel = {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // Check if car is available for the dates
      const { start_date, end_date, car_id } = bookingData;
      
      // Check existing bookings for this car
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('car_id', car_id)
        .not('status', 'eq', 'cancelled')
        .or(`start_date.lte.${end_date},end_date.gte.${start_date}`);
        
      if (checkError) throw checkError;
      
      if (existingBookings && existingBookings.length > 0) {
        return { error: 'Car is not available for the selected dates' };
      }
      
      // Check car availability schedule
      const { data: availabilityBlocks, error: availError } = await supabase
        .from('car_availability')
        .select('*')
        .eq('car_id', car_id)
        .or(`start_date.lte.${end_date},end_date.gte.${start_date}`);
        
      if (availError) throw availError;
      
      if (availabilityBlocks && availabilityBlocks.length > 0) {
        return { error: 'Car is not available for the selected dates' };
      }
      
      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id,
          status: 'pending',
          payment_status: 'unpaid',
          created_at: new Date(),
          updated_at: new Date()
        })
        .select()
        .single();
        
      if (bookingError) throw bookingError;
      
      return { booking };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Get all bookings for a user
  async getUserBookings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars(id, make, model, year, main_image_url),
          pickup_location:pickup_location_id(name, address),
          return_location:return_location_id(name, address)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return { bookings: data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Get a booking by ID
  async getBookingById(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars(id, make, model, year, daily_rate, owner_id, main_image_url),
          pickup_location:pickup_location_id(name, address, city),
          return_location:return_location_id(name, address, city)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      // Check if user is authorized to view this booking
      if (data.user_id !== user.id && data.cars.owner_id !== user.id) {
        return { error: 'Unauthorized to view this booking' };
      }
      
      return { booking: data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Update booking status (for car owners or admins)
  async updateBookingStatus(id, status) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // Get booking with car owner info
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('car_id, cars(owner_id)')
        .eq('id', id)
        .single();
        
      if (bookingError) throw bookingError;
      
      // Check if user is the car owner
      if (booking.cars.owner_id !== user.id) {
        return { error: 'Unauthorized: Only the car owner can update this booking status' };
      }
      
      // Update booking status
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      return { booking: updatedBooking };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Cancel a booking (for the booking user)
  async cancelBooking(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // Get booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('user_id, status')
        .eq('id', id)
        .single();
        
      if (bookingError) throw bookingError;
      
      // Check if user is the booking owner
      if (booking.user_id !== user.id) {
        return { error: 'Unauthorized: Only the booking user can cancel this booking' };
      }
      
      // Check if booking is in a cancellable state
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return { error: `Cannot cancel a booking in "${booking.status}" status` };
      }
      
      // Update booking status
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      return { booking: updatedBooking };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Add a review for a completed booking
  async addReview(bookingId, reviewData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      // Get booking details
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, user_id, car_id, status')
        .eq('id', bookingId)
        .single();
        
      if (bookingError) throw bookingError;
      
      // Check if user is the booking owner
      if (booking.user_id !== user.id) {
        return { error: 'Unauthorized: Only the booking user can review this rental' };
      }
      
      // Check if booking is completed
      if (booking.status !== 'completed') {
        return { error: 'Cannot review a booking that is not completed' };
      }
      
      // Check if review already exists
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingReview) {
        return { error: 'You have already reviewed this booking' };
      }
      
      // Create the review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          user_id: user.id,
          car_id: booking.car_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          created_at: new Date(),
          updated_at: new Date()
        })
        .select()
        .single();
        
      if (reviewError) throw reviewError;
      
      return { review };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};