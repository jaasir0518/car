"use client"

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from "next/navigation";

// UI Components
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/Loader';

export default function Dashboard() {
  const { isLoaded: isAuthLoaded, userId, sessionId, getToken } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchUserData() {
      if (userId) {
        try {
          // Fetch user's bookings
          const token = await getToken();
          const bookingsRes = await fetch('/api/bookings', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (bookingsRes.ok) {
            const bookingsData = await bookingsRes.json();
            setBookings(bookingsData);
          }
          
          // Fetch user's cars (if they have any listed)
          const carsRes = await fetch('/api/cars?owner=true', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (carsRes.ok) {
            const carsData = await carsRes.json();
            setCars(carsData);
          }
          
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    const isFullyLoaded = isAuthLoaded && isUserLoaded;
    
    if (isFullyLoaded) {
      if (!userId) {
        redirect("/auth/signin");
      } else {
        fetchUserData();
      }
    }
  }, [isAuthLoaded, isUserLoaded, userId, getToken]);

  // Loading state
  if (!isAuthLoaded || !isUserLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  // Dashboard stats summary
  const stats = [
    { title: "Active Bookings", value: bookings.filter(b => new Date(b.endDate) >= new Date()).length },
    { title: "Total Bookings", value: bookings.length },
    { title: "Cars Listed", value: cars.length },
    { title: "Completed Trips", value: bookings.filter(b => new Date(b.endDate) < new Date()).length }
  ];

  // Recent activity data
  const recentActivity = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Function to open Clerk user profile
  const openUserProfile = () => {
    if (window.Clerk) {
      window.Clerk.openUserProfile();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
        Welcome back, {user?.firstName || user?.username || user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">
          Manage your car rentals, bookings and account information
        </p>
      </div>

      {/* Dashboard tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-1 ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-1 ${
              activeTab === 'bookings'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`pb-4 px-1 ${
              activeTab === 'cars'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Cars
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-4 px-1 ${
              activeTab === 'account'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Account
          </button>
        </nav>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/cars">
                <Button>Book a Car</Button>
              </Link>
              <Link href="/upload">
                <Button variant="outline">List Your Car</Button>
              </Link>
              <Link href="/dashboard/bookings">
                <Button variant="outline">View All Bookings</Button>
              </Link>
              <Button variant="outline" onClick={openUserProfile}>
                Manage Account
              </Button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link href="/dashboard/bookings" className="text-blue-600 hover:text-blue-800 text-sm">
                View all
              </Link>
            </div>
            
            {recentActivity.length > 0 ? (
              <div className="bg-white shadow rounded-lg divide-y">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{activity.carName || 'Car Rental'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                          new Date(activity.endDate) < new Date() 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {new Date(activity.endDate) < new Date() ? 'Completed' : 'Active'}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">${activity.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-500">No recent activity found</p>
                <Link href="/cars">
                  <Button className="mt-4">Browse Cars</Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Bookings</h2>
            <Link href="/cars">
              <Button>Book a Car</Button>
            </Link>
          </div>

          {bookings.length > 0 ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              {booking.carImage ? (
                                <img src={booking.carImage} alt={booking.carName} className="h-full w-full object-cover" />
                              ) : (
                                <img src="/images/placeholders/car-placeholder.jpg" alt="Car" className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{booking.carName || 'Unnamed Car'}</div>
                              <div className="text-sm text-gray-500">{booking.carModel || ''}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.startDate).toLocaleDateString()} - 
                            {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                            new Date(booking.endDate) < new Date() 
                              ? 'bg-gray-100 text-gray-800' 
                              : new Date(booking.startDate) > new Date()
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {new Date(booking.endDate) < new Date() 
                              ? 'Completed' 
                              : new Date(booking.startDate) > new Date()
                                ? 'Upcoming'
                                : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${booking.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/cars/${booking.carId}`} className="text-blue-600 hover:text-blue-900 mr-4">
                            View Car
                          </Link>
                          {new Date(booking.startDate) > new Date() && (
                            <button className="text-red-600 hover:text-red-900">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">You haven't made any bookings yet</p>
              <Link href="/cars">
                <Button className="mt-4">Browse Cars</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* My cars tab */}
      {activeTab === 'cars' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Listed Cars</h2>
            <Link href="/upload">
              <Button>List a New Car</Button>
            </Link>
          </div>

          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car, index) => (
                <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 w-full overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <img 
                        src={car.images[0]} 
                        alt={car.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/images/placeholders/car-placeholder.jpg" 
                        alt="Car" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{car.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{car.make} {car.model} · {car.year}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold">${car.pricePerDay}/day</span>
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        car.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {car.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <Link href={`/cars/${car.id}`} className="w-full">
                        <Button variant="outline" className="w-full">View</Button>
                      </Link>
                      <Link href={`/dashboard/my-cars/${car.id}/edit`} className="w-full">
                        <Button className="w-full">Edit</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">You haven't listed any cars yet</p>
              <Link href="/upload">
                <Button className="mt-4">List Your Car</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Account management tab */}
      {activeTab === 'account' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Account Management</h2>
            <p className="text-gray-600 mt-2">Update your personal information and account settings</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            {/* User profile info */}
            <div className="mb-6 flex items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-800 text-xl font-semibold">
                    {user?.firstName?.[0] || user?.username?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">
                  {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}` || user?.username || 'User'}
                </h3>
                <p className="text-gray-500">{user?.emailAddresses?.[0]?.emailAddress || 'No email found'}</p>
              </div>
            </div>

            {/* Account management options */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <button onClick={openUserProfile} className="w-full text-left">
                  <h4 className="font-medium mb-1">Profile Settings</h4>
                  <p className="text-sm text-gray-500">Update your personal information, email, and password</p>
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <button onClick={openUserProfile} className="w-full text-left">
                  <h4 className="font-medium mb-1">Security Settings</h4>
                  <p className="text-sm text-gray-500">Manage password, two-factor authentication, and security options</p>
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <button onClick={openUserProfile} className="w-full text-left">
                  <h4 className="font-medium mb-1">Payment Methods</h4>
                  <p className="text-sm text-gray-500">Add or update your payment methods</p>
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <button onClick={openUserProfile} className="w-full text-left">
                  <h4 className="font-medium mb-1">Notification Preferences</h4>
                  <p className="text-sm text-gray-500">Manage your email and push notification settings</p>
                </button>
              </div>
            </div>

            {/* Help section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium mb-4">Need Help?</h4>
              <div className="flex gap-4">
                <Link href="/help">
                  <Button variant="outline">Help Center</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}