"use client";

import React, { useEffect, useState } from "react";
import { LocationPermissionRequest } from "./LocationPermissionRequest";
import { useLocationPermission } from "@/hooks/useLocationPermission";

export const LocationModalWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const { hasPermission, handleLocationGranted, handleLocationDenied } =
    useLocationPermission();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR or if permission is already handled
  if (!mounted || hasPermission !== null) {
    return null;
  }

  return (
    <LocationPermissionRequest
      onLocationGranted={handleLocationGranted}
      onLocationDenied={handleLocationDenied}
    />
  );
};
