import { useState, useEffect } from 'react';

interface GeolocationState {
  location: { lat: number; lng: number } | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 5000, 
  maximumAge: 0
};

const useGeolocation = (options: UseGeolocationOptions = defaultOptions) => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        location: null,
        error: error.message,
        loading: false,
      });
    };

    // Default NYC coordinates as fallback for testing/development
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };

    // Start loading
    setState(prev => ({ ...prev, loading: true }));

    const watchId = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options
    );

    // Set a timeout for geolocation request
    const timeoutId = setTimeout(() => {
      if (state.loading) {
        setState({
          location: defaultLocation,
          error: 'Geolocation request timed out, using default location',
          loading: false,
        });
      }
    }, options.timeout || 5000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  return state;
};

export default useGeolocation;
