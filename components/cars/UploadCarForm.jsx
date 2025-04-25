// components/cars/UploadCarForm.jsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarModel } from '@/lib/db/models/Car';
import { supabase } from '../../lib/db/index';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

export default function UploadCarForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    license_plate: '',
    daily_rate: '',
    mileage: '',
    transmission: 'automatic',
    fuel_type: 'petrol',
    seats: 5,
    description: '',
    location_id: ''
  });
  
  const [images, setImages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch locations for dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, city')
        .order('name');
        
      if (!error && data) {
        setLocations(data);
        
        // Set default location if available
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, location_id: data[0].id }));
        }
      }
    };
    
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convert number inputs to numbers
    const processedValue = type === 'number' ? 
      (value === '' ? '' : Number(value)) : 
      value;
      
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Basic validation
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      if (!isValid) {
        setError(`File ${file.name} is not an image`);
      }
      return isValid;
    });
    
    setImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Basic validation
      if (!formData.make || !formData.model || !formData.daily_rate) {
        throw new Error('Please fill out all required fields');
      }
      
      if (images.length === 0) {
        throw new Error('Please upload at least one image');
      }
      
      // Submit car data and images
      const { car, error } = await CarModel.createCar(formData, images);
      
      if (error) {
        throw new Error(error);
      }
      
      // Redirect to the new car page
      router.push(`/cars/${car.id}`);
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">List Your Car for Rent</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            label="Make*"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Model*"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Year*"
            name="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
          
          <Input
            label="License Plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
          />
          
          <Input
            label="Daily Rate ($)*"
            name="daily_rate"
            type="number"
            min="1"
            step="0.01"
            value={formData.daily_rate}
            onChange={handleChange}
            required
          />
          
          <Input
            label="Mileage"
            name="mileage"
            type="number"
            min="0"
            value={formData.mileage}
            onChange={handleChange}
          />
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transmission
            </label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            >
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type
            </label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          <Input
            label="Seats"
            name="seats"
            type="number"
            min="1"
            max="10"
            value={formData.seats}
            onChange={handleChange}
          />
          
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            >
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name} ({location.city})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            placeholder="Describe your car, its features, and any special instructions..."
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Images*
          </label>
          <div className="mt-1 border-2 border-dashed border-gray-300 rounded-md p-6">
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <div className="text-center">
                  <div className="mt-2 flex justify-center">
                    <Button type="button" variant="secondary">
                      Upload Images
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, WEBP up to 5MB each
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Preview of uploaded images */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tr-md">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? <Loader size="sm" color="white" /> : 'List Your Car'}
          </Button>
        </div>
      </form>
    </div>
  );
}