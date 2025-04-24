// components/cars/SearchFilters.jsx
import React from 'react';

const CATEGORIES = [
  'Economy', 'Compact', 'Midsize', 'SUV', 'Luxury', 'Van', 'Convertible'
];

export default function SearchFilters({ filters, onFilterChange, locations }) {
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    onFilterChange({ category: value === '' ? undefined : value });
  };
  
  const handleLocationChange = (e) => {
    const { value } = e.target;
    onFilterChange({ location_id: value === '' ? undefined : value });
  };
  
  const handleAvailabilityChange = (e) => {
    const { checked } = e.target;
    onFilterChange({ available: checked });
  };
  
  const handlePriceMinChange = (e) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onFilterChange({ priceMin: value });
  };
  
  const handlePriceMaxChange = (e) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    onFilterChange({ priceMax: value });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter Cars</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.category || ''}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Location Filter */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Location
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.location_id || ''}
            onChange={handleLocationChange}
          >
            <option value="">All Locations</option>
            {locations?.map(location => (
              <option key={location.id} value={location.id}>
                {location.city}, {location.state}
              </option>
            ))}
          </select>
        </div>
        
        {/* Price Range */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Price Range ($ per day)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.priceMin || ''}
              onChange={handlePriceMinChange}
              min="0"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.priceMax || ''}
              onChange={handlePriceMaxChange}
              min="0"
            />
          </div>
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={filters.available === true}
              onChange={handleAvailabilityChange}
            />
            <span className="ml-2 text-gray-700">Show only available cars</span>
          </label>
        </div>
      </div>
    </div>
  );
}