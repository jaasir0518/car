import React from 'react';

export default function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full rounded-md border-gray-300 shadow-sm
          focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}