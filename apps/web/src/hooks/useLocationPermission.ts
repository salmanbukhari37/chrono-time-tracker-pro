"use client";

import { useState, useEffect, useCallback } from "react";

export type LocationStatus = "allowed" | "skipped" | "denied" | "unknown";

interface LocationState {
  hasPermission: boolean | null;
  position: GeolocationPosition | null;
  error: string | null;
  status: LocationStatus;
}

// Key for localStorage to ensure consistent usage
const LOCATION_STATUS_KEY = "locationStatus";

export const useLocationPermission = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    hasPermission: null,
    position: null,
    error: null,
    status: "unknown",
  });

  // Load status from localStorage (used in multiple places)
  const getLocationStatusFromStorage = useCallback((): LocationStatus => {
    if (typeof window === "undefined") return "unknown";
    const storedStatus = localStorage.getItem(LOCATION_STATUS_KEY);
    return (storedStatus as LocationStatus) || "unknown";
  }, []);

  // Save status to localStorage (used in multiple places)
  const saveLocationStatus = useCallback((status: LocationStatus) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCATION_STATUS_KEY, status);
  }, []);

  // Check geolocation permissions
  useEffect(() => {
    // First check localStorage for already saved preference
    const locationStatus = getLocationStatusFromStorage();

    // If we have a saved preference, use it
    if (
      locationStatus === "allowed" ||
      locationStatus === "skipped" ||
      locationStatus === "denied"
    ) {
      setLocationState((prev) => ({
        ...prev,
        hasPermission: locationStatus === "allowed",
        status: locationStatus,
      }));
      return;
    }

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationState({
        hasPermission: false,
        position: null,
        error: "Geolocation is not supported by your browser",
        status: "denied",
      });
      saveLocationStatus("denied");
      return;
    }

    // Try permissions API first
    if (
      navigator.permissions &&
      typeof navigator.permissions.query === "function"
    ) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            // Permission is granted, but verify we can actually get location
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocationState({
                  hasPermission: true,
                  position,
                  error: null,
                  status: "allowed",
                });
                saveLocationStatus("allowed");
              },
              (error) => {
                setLocationState({
                  hasPermission: false,
                  position: null,
                  error: "Unable to retrieve your location: " + error.message,
                  status: "denied",
                });
                saveLocationStatus("denied");
              }
            );
          } else if (permissionStatus.state === "denied") {
            setLocationState({
              hasPermission: false,
              position: null,
              error: "Location permission was denied",
              status: "denied",
            });
            saveLocationStatus("denied");
          } else {
            // "prompt" - user needs to be asked
            setLocationState((prev) => ({
              ...prev,
              hasPermission: null,
              status: "unknown",
            }));
          }
        })
        .catch(() => {
          // Permission API failed - fall back to localStorage if available
          const storedStatus = getLocationStatusFromStorage();
          if (
            storedStatus === "allowed" ||
            storedStatus === "skipped" ||
            storedStatus === "denied"
          ) {
            setLocationState((prev) => ({
              ...prev,
              hasPermission: storedStatus === "allowed",
              status: storedStatus,
            }));
          } else {
            // No saved preference, mark as unknown to show prompt
            setLocationState((prev) => ({
              ...prev,
              hasPermission: null,
              status: "unknown",
            }));
          }
        });
    } else {
      // Permissions API not supported - fall back to localStorage or keep as unknown
      const storedStatus = getLocationStatusFromStorage();
      if (
        storedStatus === "allowed" ||
        storedStatus === "skipped" ||
        storedStatus === "denied"
      ) {
        setLocationState((prev) => ({
          ...prev,
          hasPermission: storedStatus === "allowed",
          status: storedStatus,
        }));
      } else {
        // No saved preference, mark as unknown to show prompt
        setLocationState((prev) => ({
          ...prev,
          hasPermission: null,
          status: "unknown",
        }));
      }
    }
  }, [getLocationStatusFromStorage, saveLocationStatus]);

  const handleLocationGranted = useCallback(
    (position: GeolocationPosition) => {
      setLocationState({
        hasPermission: true,
        position,
        error: null,
        status: "allowed",
      });
      saveLocationStatus("allowed");
    },
    [saveLocationStatus]
  );

  const handleLocationDenied = useCallback(() => {
    setLocationState((prev) => ({
      ...prev,
      hasPermission: false,
      status: "skipped",
    }));
    saveLocationStatus("skipped");
  }, [saveLocationStatus]);

  const promptForLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        status: "denied",
      }));
      saveLocationStatus("denied");
      return Promise.reject("Geolocation not supported");
    }

    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationGranted(position);
          resolve(position);
        },
        (error) => {
          setLocationState((prev) => ({
            ...prev,
            hasPermission: false,
            error: "Unable to retrieve your location: " + error.message,
            status: "denied",
          }));
          saveLocationStatus("denied");
          reject(error);
        }
      );
    });
  }, [handleLocationGranted, saveLocationStatus]);

  // Reset location status to force re-prompting
  const resetLocationStatus = useCallback(() => {
    localStorage.removeItem(LOCATION_STATUS_KEY);
    setLocationState({
      hasPermission: null,
      position: null,
      error: null,
      status: "unknown",
    });
  }, []);

  return {
    ...locationState,
    handleLocationGranted,
    handleLocationDenied,
    promptForLocation,
    resetLocationStatus,
    getLocationStatusFromStorage,
  };
};
