import React from "react";

const Input = ({
  label,
  type = "text",
  id,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          id={id}
          className={`block w-full rounded-lg border shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm ${
            Icon ? "pl-10" : "pl-4"
          } py-2.5 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
