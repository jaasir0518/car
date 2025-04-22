// components/home/HowItWorks.jsx
import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Choose Your Car',
      description: 'Browse our extensive fleet and select the perfect vehicle for your needs.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Book Your Ride',
      description: 'Select your pickup and return dates and confirm your reservation.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Pick Up Your Car',
      description: 'Visit our convenient location to pick up your car with minimal paperwork.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      id: 4,
      title: 'Enjoy Your Journey',
      description: 'Hit the road with our well-maintained and reliable vehicles.',
      icon: (
        <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Renting a car with us is quick and hassle-free. Just follow these simple steps.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.id} className="relative text-center">
                <div className="flex justify-center">
                  <span className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100">
                    {step.icon}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-base text-gray-500">{step.description}</p>
                
                {/* Connector line between steps (hidden on mobile) */}
                {step.id < steps.length && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-10px)] w-[calc(100%-20px)] h-0.5 bg-blue-100">
                    <div className="absolute -right-3 -top-1.5 h-4 w-4 rounded-full bg-blue-100" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}