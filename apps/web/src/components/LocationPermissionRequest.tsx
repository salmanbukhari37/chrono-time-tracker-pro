"use client";

import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface LocationPermissionRequestProps {
  onLocationGranted: (position: GeolocationPosition) => void;
  onLocationDenied: () => void;
}

export const LocationPermissionRequest: React.FC<
  LocationPermissionRequestProps
> = ({ onLocationGranted, onLocationDenied }) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = () => {
    setIsRequesting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsRequesting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsRequesting(false);
        onLocationGranted(position);
      },
      (error) => {
        setIsRequesting(false);
        setError("Unable to retrieve your location");
        onLocationDenied();
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-6">
          <FaMapMarkerAlt className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enable Location
          </h2>
          <p className="text-gray-600">
            To provide you with accurate time tracking and location-based
            features, we need access to your location.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={requestLocationPermission}
            disabled={isRequesting}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequesting ? "Requesting..." : "Allow Location Access"}
          </button>
          <button
            onClick={onLocationDenied}
            disabled={isRequesting}
            className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};
