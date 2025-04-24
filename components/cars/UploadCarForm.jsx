// components/cars/UploadCarForm.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocations } from '../../hooks/useLocations';
import { createCar } from '../../lib/api/supabase-api';

const CATEGORIES = [
  'Economy', 'Compact', 'Midsize', 'SUV', 'Luxury', 'Van', 'Convertible'
];

export default function UploadCarForm() {
  const router = useRouter();
  const { locations, loading: loadingLocations } = useLocations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: '',
    image_url: '',
    available: true,
    location_id: '',
    description: '',
    category: '',
    features: {}
  });

  const [featureInputs, setFeatureInputs] = useState([
    { key: '', value: '' }
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatureInputs = [...featureInputs];
    newFeatureInputs[index][field] = value;
    setFeatureInputs(newFeatureInputs);
    
    // Update the features object in formData
    const features = {};
    featureInputs.forEach(input => {
      if (input.key && (input.value || input.value === false)) {
        features[input.key] = input.value;
      }
    });
    setFormData({ ...formData, features });
  };

  const addFeatureField = () => {
    setFeatureInputs([...featureInputs, { key: '', value: '' }]);
  };

  const removeFeatureField = (index) => {
    if (featureInputs.length > 1) {
      const newFeatureInputs = [...featureInputs];
      newFeatureInputs.splice(index, 1);
      setFeatureInputs(newFeatureInputs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Build the features object
    const features = {};
    featureInputs.forEach(input => {
      if (input.key) {
        features[input.key] = input.value;
      }
    });
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare the final car data
      const carData = {
        ...formData,
        features,
        year: parseInt(formData.year),
        price_per_day: parseFloat(formData.price_per_day)
      };
      
      // Send to Supabase
      await createCar(carData);
      
      // Redirect to cars page
      router.push('/cars');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Car Information */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Car Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Make
          </label>
          <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Model
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price Per Day ($)
          </label>
          <input
            type="number"
            name="price_per_day"
            value={formData.price_per_day}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to use a placeholder image
          </p>
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Location
          </label>
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loadingLocations}
          >
            <option value="">Select a location</option>
            {locations?.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.city}, {location.state}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700 font-medium">
            Features
          </label>
          <button
            type="button"
            onClick={addFeatureField}
            className="text-blue-600 hover:text-blue-800"
          >
            + Add Feature
          </button>
        </div>
        
        {featureInputs.map((feature, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Feature name"
              value={feature.key}
              onChange={(e) => handleFeatureChange(index, 'key', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Value"
              value={feature.value}
              onChange={(e) => handleFeatureChange(index, 'value', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeFeatureField(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-gray-700">
          Car is available for rental
        </label>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Uploading...' : 'Upload Car'}
        </button>
      </div>
    </form>
  );
}