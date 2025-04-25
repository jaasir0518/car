'use client';

import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DatePicker({
  selectedDate,
  onChange,
  minDate,
  maxDate,
  placeholderText = 'Select a date',
  disabled = false,
  ...props
}) {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholderText}
      disabled={disabled}
      dateFormat="MM/dd/yyyy"
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      wrapperClassName="w-full"
      {...props}
    />
  );
}