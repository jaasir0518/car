import React from 'react';

/**
 * Loader component that displays a loading spinner
 * @param {Object} props
 * @param {string} [props.size='medium'] - Size of the loader: 'small', 'medium', 'large'
 * @param {string} [props.color='primary'] - Color theme: 'primary', 'secondary', 'light'
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.text] - Optional loading text to display
 */
export function Loader({ 
  size = 'medium', 
  color = 'primary',
  className = '',
  text
}) {
  // Size mappings
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };
  
  // Color mappings
  const colorClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    light: 'border-white border-t-transparent'
  };
  
  const spinnerClasses = `
    inline-block rounded-full animate-spin
    ${sizeClasses[size] || sizeClasses.medium}
    ${colorClasses[color] || colorClasses.primary}
    ${className}
  `;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={spinnerClasses} role="status" aria-label="loading"></div>
      {text && (
        <span className="mt-2 text-sm text-gray-500">{text}</span>
      )}
    </div>
  );
}

// For backwards compatibility and default export
export default Loader;