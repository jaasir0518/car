'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/Loader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'general' | 'support' | 'partnership'>('general');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate API call
    try {
      // In a real app, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFormStatus('error');
    }
  };

  const faqItems = [
    {
      question: "How do I make a car rental reservation?",
      answer: "You can make a reservation through our website by browsing our available cars, selecting your desired dates, and following the booking process. You can also contact our customer service team by phone or visit one of our locations in person."
    },
    {
      question: "What documents do I need to rent a car?",
      answer: "To rent a car, you'll need a valid driver's license, a credit card in your name for the security deposit, and proof of insurance. International customers may need additional documentation such as a passport or international driver's permit."
    },
    {
      question: "Can I modify or cancel my reservation?",
      answer: "Yes, you can modify or cancel your reservation through your account dashboard or by contacting our customer service team. Please note that cancellation fees may apply depending on how close to the pickup time you cancel."
    },
    {
      question: "Is there a mileage limit for rentals?",
      answer: "Most of our rental plans come with unlimited mileage. However, some special offers or luxury vehicles may have mileage restrictions. The specific terms will be clearly displayed during the booking process."
    },
    {
      question: "What happens if I return the car late?",
      answer: "Late returns are subject to additional charges. We typically allow a 30-minute grace period, after which an extra day's rental fee may apply. If you anticipate being late, please contact us as soon as possible."
    }
  ];

  const officeLocations = [
    {
      title: "Main Office",
      address: "123 Main Street, Downtown",
      city: "New York, NY 10001",
      phone: "+1 (212) 555-1234",
      email: "info@carrentalcompany.com",
      hours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat-Sun: 9:00 AM - 5:00 PM"
    },
    {
      title: "Customer Support Center",
      address: "456 Support Avenue",
      city: "Chicago, IL 60007",
      phone: "+1 (312) 555-6789",
      email: "support@carrentalcompany.com",
      hours: "24/7 Support Available"
    },
    {
      title: "Business Partnerships",
      address: "789 Corporate Blvd, Suite 500",
      city: "San Francisco, CA 94105",
      phone: "+1 (415) 555-9012",
      email: "partnerships@carrentalcompany.com",
      hours: "Mon-Fri: 9:00 AM - 5:00 PM"
    },
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const renderForm = () => {
    if (formStatus === 'success') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
          <p className="mb-4">Thank you for reaching out. Our team will get back to you shortly.</p>
          <Button onClick={() => setFormStatus('idle')}>Send Another Message</Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a subject</option>
            <option value="Reservation Question">Reservation Question</option>
            <option value="Vehicle Information">Vehicle Information</option>
            <option value="Billing Issue">Billing Issue</option>
            <option value="Feedback">Feedback</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="How can we help you?"
            required
          ></textarea>
        </div>
        
        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={formStatus === 'submitting'}
        >
          {formStatus === 'submitting' ? (
            <>
              <Loader className="w-4 h-4 mr-2" /> Sending...
            </>
          ) : 'Send Message'}
        </Button>
      </form>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">We're here to help with any questions or concerns about our car rental services.</p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'general' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('general')}
            >
              General Inquiry
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'support' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('support')}
            >
              Support
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'partnership' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('partnership')}
            >
              Business Partners
            </button>
          </div>
          
          {renderForm()}
        </div>
        
        <div>
          <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Need Immediate Assistance?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <div>
                  <p className="font-medium">Customer Support</p>
                  <p className="text-white text-opacity-90">+1 (800) 555-RENT</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-white text-opacity-90">support@carrentalcompany.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                </svg>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-white text-opacity-90">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Office Hours</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="font-medium">Monday - Friday:</span>
                <span>8:00 AM - 8:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Saturday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                * Hours may vary by location. Please check our locations page for specific branch hours.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Office Locations */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Offices</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {officeLocations.map((office, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 h-48 relative">
                <Image
                  src="/images/placeholders/car-placeholder.jpg"
                  alt={office.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{office.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <p>{office.address}</p>
                  <p>{office.city}</p>
                  <p className="font-medium text-gray-800">{office.phone}</p>
                  <p className="text-blue-600">{office.email}</p>
                  <p className="text-sm">{office.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button 
                className="flex justify-between items-center w-full p-4 text-left font-medium hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${activeFaq === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className={`px-4 overflow-hidden transition-all ${activeFaq === index ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Map Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Find Us</h2>
        <div className="bg-gray-200 w-full h-96 rounded-lg flex items-center justify-center">
          {/* In a real implementation, you would include a map component here */}
          <p className="text-gray-500">Interactive map would be displayed here</p>
        </div>
      </section>
    </div>
  );
}