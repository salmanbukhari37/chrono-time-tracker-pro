import React from "react";

interface SuccessIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`mx-auto flex items-center justify-center rounded-full bg-green-100 ${className}`}
    >
      <svg
        className={`${sizeClasses[size]} text-green-600`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
  );
};
