import { useState } from 'react';
import { Calendar, MapPin, Filter, Check } from 'lucide-react';

const SearchFilters = ({ onFilter }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [vehicleType, setVehicleType] = useState('all');
  const [transmission, setTransmission] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      location,
      startDate,
      endDate,
      priceRange,
      vehicleType,
      transmission
    });
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit}>
        {/* Basic Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Location */}
          <div className="relative">
            <div className="flex items-center border rounded-md p-2">
              <MapPin size={20} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Location"
                className="w-full focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          {/* Date Range */}
          <div className="relative">
            <div className="flex items-center border rounded-md p-2">
              <Calendar size={20} className="text-gray-500 mr-2" />
              <input
                type="date"
                className="w-full focus:outline-none mr-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                className="w-full focus:outline-none ml-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter Toggle and Search Button */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={toggleFilters}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter size={20} className="mr-2" />
              Filters
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              Search
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {isFiltersOpen && (
          <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price: ${priceRange[1]}/day
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={handlePriceChange}
                className="w-full"
              />
            </div>
            
            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="van">Van</option>
                <option value="convertible">Convertible</option>
              </select>
            </div>
            
            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">Any</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;