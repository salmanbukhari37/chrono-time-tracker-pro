"use client";

import { useState, useEffect } from "react";

interface LocationState {
  hasPermission: boolean | null;
  position: GeolocationPosition | null;
  error: string | null;
}

export const useLocationPermission = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    hasPermission: null,
    position: null,
    error: null,
  });

  useEffect(() => {
    // Check if location permission has been previously requested
    const locationStatus = localStorage.getItem("locationStatus");
    if (locationStatus === "allowed" || locationStatus === "skipped") {
      setLocationState((prev) => ({
        ...prev,
        hasPermission: locationStatus === "allowed",
      }));
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        hasPermission: false,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    // Check current permission status
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationState({
                hasPermission: true,
                position,
                error: null,
              });
              localStorage.setItem("locationStatus", "allowed");
            },
            (error) => {
              setLocationState({
                hasPermission: false,
                position: null,
                error: "Unable to retrieve your location",
              });
            }
          );
        } else if (permissionStatus.state === "denied") {
          setLocationState({
            hasPermission: false,
            position: null,
            error: "Location permission was denied",
          });
          localStorage.setItem("locationStatus", "skipped");
        }
      })
      .catch(() => {
        // If permissions API is not supported, we'll show the request dialog
        const locationStatus = localStorage.getItem("locationStatus");
        if (locationStatus === "allowed" || locationStatus === "skipped") {
          setLocationState((prev) => ({
            ...prev,
            hasPermission: locationStatus === "allowed",
          }));
        } else {
          setLocationState((prev) => ({
            ...prev,
            hasPermission: null,
          }));
        }
      });
  }, []);

  const handleLocationGranted = (position: GeolocationPosition) => {
    setLocationState({
      hasPermission: true,
      position,
      error: null,
    });
    localStorage.setItem("locationStatus", "allowed");
  };

  const handleLocationDenied = () => {
    setLocationState((prev) => ({
      ...prev,
      hasPermission: false,
    }));
    localStorage.setItem("locationStatus", "skipped");
  };

  return {
    ...locationState,
    handleLocationGranted,
    handleLocationDenied,
  };
};
