import React, { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "flex justify-center items-center border rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "border-transparent text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500",
    outline:
      "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500",
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner
            className="-ml-1 mr-2"
            size={size === "lg" ? "md" : "sm"}
          />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </button>
  );
};
