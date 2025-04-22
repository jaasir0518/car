'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative h-96 rounded-xl overflow-hidden">
          <Image
            src="/images/hero-image.jpg"
            alt="Car rental company headquarters"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Company</h1>
            <p className="text-xl max-w-2xl">
              Providing premium car rental services since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="mb-4">
              Founded in 2010, our car rental service began with a small fleet of just 5 vehicles and a passion for providing exceptional customer service. Today, we've grown to become one of the leading car rental providers with operations in over 50 cities nationwide.
            </p>
            <p className="mb-4">
              Our mission from day one has been to make car rentals accessible, convenient, and hassle-free. We believe that renting a car should be an enjoyable experience from start to finish, whether you're traveling for business, going on a family vacation, or just need a temporary vehicle.
            </p>
            <p>
              What sets us apart is our commitment to quality, transparency, and customer satisfaction. We continuously update our fleet with the latest models and offer flexible rental options to suit every need and budget.
            </p>
          </div>
          <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
            <Image
              src="/images/placeholders/car-placeholder.jpg"
              alt="Company history"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16 bg-gray-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality</h3>
            <p className="text-gray-600">
              We maintain a modern fleet of vehicles that undergo regular maintenance checks to ensure safety and reliability.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Convenience</h3>
            <p className="text-gray-600">
              From easy online booking to flexible pickup and return options, we make the rental process smooth and efficient.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Service</h3>
            <p className="text-gray-600">
              Our dedicated team is available 24/7 to assist with any queries and ensure you have the best rental experience.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Meet Our Leadership Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Johnson",
              position: "Chief Executive Officer",
              bio: "With over 15 years in the automotive industry, Alex has led our company to exponential growth since its founding.",
              image: "/images/placeholders/car-placeholder.jpg"
            },
            {
              name: "Samantha Lee",
              position: "Chief Operations Officer",
              bio: "Samantha ensures that our day-to-day operations run smoothly while constantly seeking ways to improve our service.",
              image: "/images/placeholders/car-placeholder.jpg"
            },
            {
              name: "Michael Torres",
              position: "Fleet Manager",
              bio: "Michael's expertise in vehicle maintenance and management keeps our fleet in top condition for our customers.",
              image: "/images/placeholders/car-placeholder.jpg"
            }
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.position}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
        <div className="space-y-8">
          {[
            {
              year: "2010",
              title: "Company Founded",
              description: "Started with 5 vehicles in a single location"
            },
            {
              year: "2013",
              title: "Expansion Phase",
              description: "Opened 10 new branches across the state and expanded fleet to 100+ vehicles"
            },
            {
              year: "2016",
              title: "Online Platform Launch",
              description: "Launched our online booking system and mobile app for seamless reservations"
            },
            {
              year: "2019",
              title: "Nationwide Presence",
              description: "Expanded to over 30 states with 50+ locations and a fleet of 500+ vehicles"
            },
            {
              year: "2022",
              title: "Introduction of Electric Vehicles",
              description: "Added a range of electric vehicles to our fleet, embracing sustainable mobility"
            }
          ].map((milestone, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 w-24 text-right pr-4">
                <span className="font-bold text-xl">{milestone.year}</span>
              </div>
              <div className="flex-shrink-0 relative">
                <div className="h-full w-0.5 bg-blue-600 absolute left-1/2 transform -translate-x-1/2"></div>
                <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white relative z-10"></div>
              </div>
              <div className="pl-4 pb-8">
                <h3 className="text-xl font-semibold mb-1">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="mb-16 bg-gray-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              name: "David Wilson",
              testimonial: "I've been using this car rental service for my business trips for over 3 years now. The vehicles are always clean, well-maintained, and the staff is incredibly helpful. The online booking process is straightforward and saves me so much time.",
              image: "/images/placeholders/car-placeholder.jpg"
            },
            {
              name: "Emily Rodriguez",
              testimonial: "As someone who travels frequently, I've tried many car rental services. This one stands out for its exceptional customer service and transparent pricing. No hidden fees or surprises at checkout, which I really appreciate.",
              image: "/images/placeholders/car-placeholder.jpg"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 relative mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{testimonial.name}</h3>
              </div>
              <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white p-8 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Service?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Browse our fleet of vehicles and find the perfect car for your needs.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/cars">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              View Cars
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-transparent border border-white hover:bg-blue-700">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}