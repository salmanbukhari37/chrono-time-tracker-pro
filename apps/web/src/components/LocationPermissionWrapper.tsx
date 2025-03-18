"use client";

import React from "react";
import { LocationPermissionRequest } from "./LocationPermissionRequest";
import { useLocationPermission } from "@/hooks/useLocationPermission";

interface LocationPermissionWrapperProps {
  children: React.ReactNode;
}

export const LocationPermissionWrapper: React.FC<
  LocationPermissionWrapperProps
> = ({ children }) => {
  const { hasPermission, error, handleLocationGranted, handleLocationDenied } =
    useLocationPermission();

  return (
    <>
      {children}
      {hasPermission === null && (
        <LocationPermissionRequest
          onLocationGranted={handleLocationGranted}
          onLocationDenied={handleLocationDenied}
        />
      )}
    </>
  );
};
