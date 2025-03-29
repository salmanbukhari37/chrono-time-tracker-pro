"use client";

import React, { useEffect, useState } from "react";
import { LocationPermissionRequest } from "./LocationPermissionRequest";
import { useLocationPermission } from "@/hooks/useLocationPermission";

export const LocationModalWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const { status, hasPermission, handleLocationGranted, handleLocationDenied } =
    useLocationPermission();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  // Only show the modal if status is unknown (first-time user or reset)
  if (status !== "unknown") {
    return null;
  }

  return (
    <LocationPermissionRequest
      onLocationGranted={handleLocationGranted}
      onLocationDenied={handleLocationDenied}
    />
  );
};
