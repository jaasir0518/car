'use client';

import { useState } from 'react';

export function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true,
    });

    // Validate on blur if rules exist
    if (validationRules[name]) {
      validateField(name, values[name]);
    }
  };

  // Validate a single field
  const validateField = (name, value) => {
    const fieldRules = validationRules[name];
    
    if (!fieldRules) return true;
    
    let error = null;
    
    if (fieldRules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      error = fieldRules.required === true ? 'This field is required' : fieldRules.required;
    } else if (fieldRules.minLength && value.length < fieldRules.minLength.value) {
      error = fieldRules.minLength.message || `Must be at least ${fieldRules.minLength.value} characters`;
    } else if (fieldRules.maxLength && value.length > fieldRules.maxLength.value) {
      error = fieldRules.maxLength.message || `Must be less than ${fieldRules.maxLength.value} characters`;
    } else if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
      error = fieldRules.pattern.message || 'Invalid format';
    } else if (fieldRules.validate) {
      const validateResult = fieldRules.validate(value, values);
      if (validateResult) {
        error = validateResult;
      }
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
    
    return !error;
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const isFieldValid = validateField(field, values[field]);
      if (!isFieldValid) {
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (onSubmit) => {
    return async (e) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      
      setTouched(allTouched);
      
      const isValid = validateForm();
      
      if (isValid) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  };

  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  // Set multiple form values at once
  const setMultipleValues = (newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues: setMultipleValues,
  };
}