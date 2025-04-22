import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Upload, MapPin, DollarSign, Users, Gauge, Calendar, Check, X } from 'lucide-react';

const UploadCarForm = () => {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'sedan',
    price: '',
    location: '',
    passengers: '',
    doors: '',
    transmission: 'automatic',
    mileage: '',
    year: new Date().getFullYear(),
    fuelType: 'gasoline',
    features: [],
    image: null
  });

  const carFeatures = [
    'Air Conditioning', 'Bluetooth', 'Cruise Control', 'Navigation System',
    'Backup Camera', 'Leather Seats', 'Sunroof', 'USB Port'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData({
          ...formData,
          features: [...formData.features, value]
        });
      } else {
        setFormData({
          ...formData,
          features: formData.features.filter(feature => feature !== value)
        });
      }
    } else if (type === 'file') {
      if (files && files[0]) {
        setFormData({
          ...formData,
          image: files[0]
        });
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (!userId) {
        throw new Error('You must be signed in to upload a car');
      }
      
      // First upload the image if exists
      let imageUrl = '';
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('file', formData.image);
        
        const token = await getToken();
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: imageFormData
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
      
      // Then create the car listing
      const carData = {
        ...formData,
        image: imageUrl,
        ownerId: userId
      };
      
      delete carData.file; // Remove the actual file object
      
      const token = await getToken();
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(carData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create car listing');
      }
      
      // Success
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/my-cars');
      }, 2000);
      
    } catch (err) {
      console.error('Error uploading car:', err);
      setError(err.message || 'An error occurred while uploading your car.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">List Your Car for Rent</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <Check size={20} className="mr-2" />
          <span>Your car has been successfully listed! Redirecting to your cars...</span>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <X size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Car Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {imagePreview ? (
            <div className="relative w-full h-48">
              <img 
                src={imagePreview} 
                alt="Car Preview" 
                className="h-full mx-auto object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setFormData({...formData, image: null});
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload size={36} className="mx-auto text-gray-400" />
              <p className="text-gray-500">Drag and drop an image or click to browse</p>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </div>
          )}
        </div>
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Car Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Toyota Camry 2023"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
              <option value="van">Van</option>
              <option value="convertible">Convertible</option>
              <option value="sports">Sports</option>
              <option value="economy">Economy</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your car, its condition, and any special features"
          ></textarea>
        </div>
        
        {/* Price and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign size={16} className="inline mr-1" />
              Daily Rate (USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 45"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin size={16} className="inline mr-1" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>
        
        {/* Car Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              <Users size={16} className="inline mr-1" />
              Passengers
            </label>
            <input
              type="number"
              id="passengers"
              name="passengers"
              min="1"
              max="10"
              value={formData.passengers}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="doors" className="block text-sm font-medium text-gray-700 mb-1">
              Doors
            </label>
            <input
              type="number"
              id="doors"
              name="doors"
              min="2"
              max="6"
              value={formData.doors}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
              <Gauge size={16} className="inline mr-1" />
              MPG
            </label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              min="1"
              value={formData.mileage}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={16} className="inline mr-1" />
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              min="1990"
              max={new Date().getFullYear()}
              value={formData.year}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        </div>
        
        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Features
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {carFeatures.map((feature) => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={`feature-${feature}`}
                  name="features"
                  value={feature}
                  checked={formData.features.includes(feature)}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">
                  {feature}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
              Uploading...
            </>
          ) : (
            'List Your Car'
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadCarForm;