import React from 'react';

interface SelectProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string; // Added helpText prop for additional context or loading states
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  helpText,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
          disabled ? 'bg-gray-100 text-gray-500' : ''
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default Select;
