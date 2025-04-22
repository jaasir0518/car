// components/home/Testimonials.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Business Traveler",
    content: "The car rental service exceeded my expectations. The vehicle was clean, well-maintained, and the pickup process was seamless. I'll definitely be using this service for my future business trips.",
    avatar: "/api/placeholder/48/48", // Using placeholder as per requirement
    rating: 5
  },
  {
    id: 2,
    name: "Michael Reynolds",
    role: "Family Vacationer",
    content: "Renting an SUV for our family vacation was the best decision. The car was spacious, comfortable, and perfect for our road trip. The booking process was straightforward, and the staff was incredibly helpful.",
    avatar: "/api/placeholder/48/48", // Using placeholder as per requirement
    rating: 5
  },
  {
    id: 3,
    name: "David Chen",
    role: "Weekend Explorer",
    content: "I regularly rent cars for weekend getaways, and this service has consistently provided quality vehicles at reasonable prices. The online booking system is user-friendly, and I appreciate the wide selection of cars.",
    avatar: "/api/placeholder/48/48", // Using placeholder as per requirement
    rating: 4
  },
  {
    id: 4,
    name: "Emily Parker",
    role: "City Tourist",
    content: "As a tourist, having a reliable car made exploring the city so much easier. The rental process was quick, and the car was exactly what I needed. I recommend this service to anyone visiting the area.",
    avatar: "/api/placeholder/48/48", // Using placeholder as per requirement
    rating: 5
  }
];

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Function to render rating stars
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Don't just take our word for it — hear from our satisfied customers.
          </p>
        </div>

        <div className="mt-12 relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out" 
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="min-w-full px-4"
                >
                  <div className="bg-gray-50 rounded-lg p-8 md:p-12 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        <Image 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          width={64} 
                          height={64} 
                          className="h-16 w-16 rounded-full mx-auto"
                        />
                      </div>
                      
                      <blockquote className="mt-4">
                        <p className="text-lg text-gray-700">"{testimonial.content}"</p>
                      </blockquote>
                      
                      <div className="flex mt-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-lg font-medium text-gray-900">{testimonial.name}</p>
                        <p className="text-base text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center -mt-6 px-2">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none"  
              aria-label="Previous testimonial"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 focus:outline-none"  
              aria-label="Next testimonial"
            >
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Indicators */}
          <div className="mt-8 flex justify-center space-x-2">
          // components/home/Testimonials.jsx (continued)
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-2 w-8 rounded-full ${
                  activeTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}