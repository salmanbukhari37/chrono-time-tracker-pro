import React, { useState } from "react";
import { IconType } from "react-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormInputProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  error?: string;
  Icon: IconType;
  autoComplete?: string;
  register: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  type,
  label,
  placeholder,
  error,
  Icon,
  autoComplete,
  register,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={id}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          autoComplete={autoComplete}
          className={`w-full pl-10 ${
            type === "password" ? "pr-10" : "pr-3"
          } py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
          placeholder={placeholder}
          {...register}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5" />
            ) : (
              <FaEye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};
